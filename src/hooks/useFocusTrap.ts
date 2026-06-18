import { useEffect, useRef } from 'react';

interface FocusTrapProps {
  isActive: boolean;
  onClose: () => void;
}

export function useFocusTrap({ isActive, onClose }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Save current active element to restore later
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])'
    ].join(',');

    const focusableElements = Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];

    if (focusableElements.length > 0) {
      // Focus the first element on open
      const timeoutId = setTimeout(() => {
        // Re-check container matches in case component unmounted
        if (containerRef.current) {
          const currentFocusables = Array.from(containerRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[];
          if (currentFocusables.length > 0) {
            currentFocusables[0].focus();
          }
        }
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        // Close on Escape
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
          return;
        }

        // Trap focus on Tab
        if (e.key === 'Tab') {
          if (!containerRef.current) return;
          const currentFocusables = Array.from(containerRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[];
          if (currentFocusables.length === 0) return;

          const firstElement = currentFocusables[0];
          const lastElement = currentFocusables[currentFocusables.length - 1];

          if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('keydown', handleKeyDown);
        // Restore focus on close
        if (previousActiveElementRef.current) {
          previousActiveElementRef.current.focus();
        }
      };
    } else {
      // If no focusable elements inside, still close on Escape
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive, onClose]);

  return containerRef;
}
