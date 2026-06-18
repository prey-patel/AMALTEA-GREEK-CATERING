/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Download, Loader2 } from 'lucide-react';

interface FlipbookModalProps {
  lang: 'en' | 'pl';
  pdfUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

// Dynamically load PDF.js from cdnjs
/* eslint-disable @typescript-eslint/no-explicit-any */
const loadPdfJs = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).pdfjsLib) {
      resolve((window as any).pdfjsLib);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      const pdfjs = (window as any).pdfjsLib;
      pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(pdfjs);
    };
    script.onerror = (e) => reject(new Error('Failed to load PDF.js: ' + String(e)));
    document.head.appendChild(script);
  });
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export function FlipbookModal({ lang, pdfUrl, isOpen, onClose }: FlipbookModalProps) {
  const [loading, setLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [pages, setPages] = useState<string[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0); // 0-based page index for mobile, or spread index for desktop
  const [zoom, setZoom] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Handle window resizing to detect mobile layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Load and render PDF using PDF.js
  useEffect(() => {
    let active = true;
    if (!isOpen || !pdfUrl) return;

    const renderPdf = async () => {
      setLoading(true);
      setPages([]);
      setCurrentPageIndex(0);
      setZoom(1);

      try {
        setLoadingStatus(lang === 'pl' ? 'Inicjowanie czytnika...' : 'Initializing reader...');
        const pdfjs = await loadPdfJs();
        
        setLoadingStatus(lang === 'pl' ? 'Pobieranie menu PDF...' : 'Downloading PDF menu...');
        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        const numPages = pdf.numPages;
        const renderedPages: string[] = [];

        for (let i = 1; i <= numPages; i++) {
          if (!active) return;
          setLoadingStatus(
            lang === 'pl' 
              ? `Generowanie strony ${i} z ${numPages}...` 
              : `Rendering page ${i} of ${numPages}...`
          );

          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 }); // High-quality rendering scale

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (context) {
            await page.render({ canvasContext: context, viewport }).promise;
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            renderedPages.push(dataUrl);
          }
        }

        if (active) {
          setPages(renderedPages);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error rendering PDF menu:', err);
        if (active) {
          setLoadingStatus(
            lang === 'pl' 
              ? 'Wystąpił błąd podczas ładowania dokumentu PDF.' 
              : 'Error loading PDF document.'
          );
        }
      }
    };

    renderPdf();

    return () => {
      active = false;
    };
  }, [isOpen, pdfUrl, lang]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading || isFlipping) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pages, currentPageIndex, loading, isMobile, isFlipping]);

  const maxPageIndex = isMobile 
    ? pages.length - 1 
    : Math.ceil((pages.length + 1) / 2) - 1; // Double spread counting (Cover is index 0)

  const handleNext = () => {
    if (currentPageIndex < maxPageIndex && !isFlipping) {
      setFlipDirection('next');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPageIndex(prev => prev + 1);
        setIsFlipping(false);
      }, 500); // Wait for turn animation
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0 && !isFlipping) {
      setFlipDirection('prev');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPageIndex(prev => prev - 1);
        setIsFlipping(false);
      }, 500); // Wait for turn animation
    }
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75));
  const resetZoom = () => setZoom(1);

  if (!isOpen) return null;

  // Desktop Spread Renderer Helper
  const getDesktopPages = (spreadIdx: number) => {
    if (spreadIdx === 0) {
      // Cover page (Right side only)
      return { left: null, right: pages[0] };
    }
    const leftIdx = spreadIdx * 2 - 1;
    const rightIdx = spreadIdx * 2;
    return {
      left: pages[leftIdx] || null,
      right: pages[rightIdx] || null
    };
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950/80 backdrop-blur-md p-4 font-sans select-none text-white overflow-hidden"
      >
        {/* Header toolbar */}
        <div className="flex justify-between items-center bg-slate-900/60 border border-slate-800 px-4 py-3 shadow-lg backdrop-blur-sm z-10">
          <div className="flex items-center space-x-3">
            <span className="font-serif text-xs font-bold tracking-widest text-[#C5A880] uppercase">
              {lang === 'pl' ? 'Karta Menu' : 'Menu Book'}
            </span>
          </div>

          {/* Zoom & Action Controls */}
          {!loading && (
            <div className="flex items-center space-x-1.5 sm:space-x-3">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoom <= 0.75}
                className="p-1.5 hover:bg-slate-800 disabled:opacity-30 rounded transition-colors text-slate-355 cursor-pointer"
                title={lang === 'pl' ? 'Pomniejsz' : 'Zoom Out'}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={resetZoom}
                className="p-1.5 hover:bg-slate-800 rounded transition-colors text-slate-355 cursor-pointer"
                title={lang === 'pl' ? 'Resetuj zoom' : 'Reset Zoom'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={zoomIn}
                disabled={zoom >= 2.5}
                className="p-1.5 hover:bg-slate-800 disabled:opacity-30 rounded transition-colors text-slate-355 cursor-pointer"
                title={lang === 'pl' ? 'Powiększ' : 'Zoom In'}
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

              <a
                href={pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-slate-800 rounded transition-colors text-slate-355 flex items-center justify-center cursor-pointer"
                title={lang === 'pl' ? 'Pobierz PDF' : 'Download PDF'}
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Close modal */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
            title={lang === 'pl' ? 'Zamknij' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main interactive area */}
        <div 
          ref={containerRef}
          className="flex-grow flex items-center justify-center p-4 relative overflow-auto"
        >
          {loading ? (
            <div className="text-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#C5A880] mx-auto" />
              <p className="font-mono text-xs text-[#C5A880] uppercase tracking-widest">
                {loadingStatus}
              </p>
            </div>
          ) : (
            // Perspective Wrap for 3D Book view
            <motion.div
              style={{ scale: zoom }}
              className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-200"
            >
              {isMobile ? (
                // Mobile layout: Single page with smooth 3D flip card
                <div className="relative w-[85vw] max-w-[360px] max-h-[60vh] aspect-[1/1.4] shadow-2xl bg-white border border-slate-200 rounded-sm overflow-hidden select-text text-black">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentPageIndex}
                      initial={{ 
                        opacity: 0, 
                        rotateY: flipDirection === 'next' ? 45 : -45, 
                        x: flipDirection === 'next' ? 50 : -50 
                      }}
                      animate={{ opacity: 1, rotateY: 0, x: 0 }}
                      exit={{ 
                        opacity: 0, 
                        rotateY: flipDirection === 'next' ? -45 : 45, 
                        x: flipDirection === 'next' ? -50 : 50 
                      }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      src={pages[currentPageIndex]}
                      alt={`Menu Page ${currentPageIndex + 1}`}
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  </AnimatePresence>
                </div>
              ) : (
                // Desktop Layout: Symmetrical Double-Page Spread
                <div 
                  className="flex relative w-[90vw] max-w-[840px] max-h-[70vh] aspect-[1.4/1] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] bg-[#1e150f]/80 p-3 rounded-md border border-[#C5A880]/15"
                  style={{ perspective: '1600px' }}
                >
                  {/* Symmetrical Spines & Leather Cover */}
                  <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent border-l border-amber-905/10 rounded-l z-20 pointer-events-none" />
                  <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/40 to-transparent border-r border-amber-905/10 rounded-r z-20 pointer-events-none" />
                  
                  {/* Center spine */}
                  <div className="absolute inset-y-3 left-1/2 -ml-[1px] w-[2px] bg-gradient-to-r from-black/80 via-yellow-900/20 to-black/80 shadow-[0_0_10px_rgba(0,0,0,0.8)] z-35 pointer-events-none" />

                  {/* LEFT PAGE */}
                  <div className="w-1/2 h-full bg-white border-r border-slate-100 relative overflow-hidden flex items-center justify-center select-text text-black rounded-l-sm">
                    {getDesktopPages(currentPageIndex).left ? (
                      <img
                        src={getDesktopPages(currentPageIndex).left || ''}
                        alt="Left Page"
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    ) : (
                      // Left cover padding (inside of front cover)
                      <div className="w-full h-full bg-[#faf7f2] dark:bg-slate-900 flex items-center justify-center relative">
                        <div className="absolute inset-4 border border-dashed border-[#C5A880]/30" />
                      </div>
                    )}
                    <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/8 to-transparent pointer-events-none" />
                  </div>

                  {/* RIGHT PAGE */}
                  <div className="w-1/2 h-full bg-white border-l border-slate-100 relative overflow-hidden flex items-center justify-center select-text text-black rounded-r-sm">
                    {getDesktopPages(currentPageIndex).right ? (
                      <img
                        src={getDesktopPages(currentPageIndex).right || ''}
                        alt="Right Page"
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    ) : (
                      // Right cover padding (inside of back cover)
                      <div className="w-full h-full bg-[#faf7f2] dark:bg-slate-900 flex items-center justify-center relative">
                        <div className="absolute inset-4 border border-dashed border-[#C5A880]/30" />
                      </div>
                    )}
                    <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/8 to-transparent pointer-events-none" />
                  </div>

                  {/* 3D Flipping Animation Page Overlay */}
                  {isFlipping && (
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: 12,
                        bottom: 12,
                        width: 'calc(50% - 12px)',
                        left: flipDirection === 'next' ? '50%' : '12px',
                        transformOrigin: flipDirection === 'next' ? 'left center' : 'right center',
                        zIndex: 30,
                        transformStyle: 'preserve-3d',
                      }}
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: flipDirection === 'next' ? -180 : 180 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="bg-white pointer-events-none shadow-2xl relative overflow-hidden rounded-sm"
                    >
                      {/* Page shadows / depth */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 backface-hidden" />
                      
                      {/* Render appropriate flipping side texture */}
                      {flipDirection === 'next' ? (
                        // Next Page Turn: Front of flip is the current right page, back of flip is the next left page
                        <div className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }}>
                          <div className="absolute inset-0 backface-hidden flex items-center justify-center">
                            <img
                              src={getDesktopPages(currentPageIndex).right || ''}
                              className="w-full h-full object-contain"
                              alt="Flipping Page Front"
                            />
                          </div>
                          <div className="absolute inset-0 backface-hidden flex items-center justify-center" style={{ transform: 'rotateY(180deg)' }}>
                            <img
                              src={getDesktopPages(currentPageIndex + 1).left || ''}
                              className="w-full h-full object-contain"
                              alt="Flipping Page Back"
                            />
                          </div>
                        </div>
                      ) : (
                        // Prev Page Turn: Front of flip is the current left page, back of flip is the prev right page
                        <div className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }}>
                          <div className="absolute inset-0 backface-hidden flex items-center justify-center">
                            <img
                              src={getDesktopPages(currentPageIndex).left || ''}
                              className="w-full h-full object-contain"
                              alt="Flipping Page Front"
                            />
                          </div>
                          <div className="absolute inset-0 backface-hidden flex items-center justify-center" style={{ transform: 'rotateY(180deg)' }}>
                            <img
                              src={getDesktopPages(currentPageIndex - 1).right || ''}
                              className="w-full h-full object-contain"
                              alt="Flipping Page Back"
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        {!loading && (
          <div className="flex justify-between items-center bg-slate-900/60 border border-slate-800 px-6 py-4 shadow-lg backdrop-blur-sm z-10 max-w-sm mx-auto w-full mb-2">
            {/* Prev arrow */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentPageIndex === 0 || isFlipping}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-20 transition-all rounded text-white cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page info */}
            <span className="font-mono text-xs text-slate-300 uppercase tracking-widest">
              {isMobile ? (
                `${lang === 'pl' ? 'Strona' : 'Page'} ${currentPageIndex + 1} / ${pages.length}`
              ) : (
                currentPageIndex === 0 
                  ? (lang === 'pl' ? 'Okładka' : 'Cover')
                  : `${lang === 'pl' ? 'Strony' : 'Pages'} ${currentPageIndex * 2} - ${Math.min(currentPageIndex * 2 + 1, pages.length)} / ${pages.length}`
              )}
            </span>

            {/* Next arrow */}
            <button
              type="button"
              onClick={handleNext}
              disabled={currentPageIndex === maxPageIndex || isFlipping}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-20 transition-all rounded text-white cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
