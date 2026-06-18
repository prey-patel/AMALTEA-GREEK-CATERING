import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Upload, LogOut, CheckCircle, AlertTriangle, Shield, Grid, ListCollapse, Settings } from 'lucide-react';

interface GalleryItem {
  id: string;
  image_url: string;
  file_path: string | null;
  title: string | null;
  alt_text: string | null;
  category: string;
  description: string | null;
  created_at: string;
}

interface AuditLog {
  id: string;
  action: string;
  user_email: string | null;
  target_table: string | null;
  target_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface AdminGalleryProps {
  onLogout: () => void;
  lang: 'en' | 'pl';
  onGoToSettings: () => void;
}

export default function AdminGallery({ onLogout, lang, onGoToSettings }: AdminGalleryProps) {
  const [activeTab, setActiveTab] = useState<'manage' | 'logs'>('manage');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [adminEmail, setAdminEmail] = useState<string>('');
  
  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Upload Form States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [category, setCategory] = useState('food');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchGallery();
  }, []);

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchAuditLogs();
    }
  }, [activeTab]);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setAdminEmail(user.email || 'admin@amaltea.com.pl');
    }
  };

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGalleryItems(data || []);
    } catch (err: unknown) {
      console.error('Fetch gallery error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    setLogsLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (err: unknown) {
      console.error('Fetch audit logs error:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Log logout event before clearing authentication session
        await supabase.rpc('log_admin_action', {
          action: 'LOGOUT',
          target_table: 'auth.users',
          target_id: user.id
        });
      }
    } catch (err) {
      console.error('Logout logging warning:', err);
    }
    await supabase.auth.signOut();
    onLogout();
  };

  // Image validation and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    validateAndSetFile(file);
  };

  const validateAndSetFile = (file: File) => {
    setStatusMessage(null);
    
    // MIME type check
    const validMimes = ['image/jpeg', 'image/png', 'image/webp'];
    const validExts = ['.jpg', '.jpeg', '.png', '.webp'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validMimes.includes(file.type) && !validExts.includes(fileExt)) {
      setStatusMessage({
        type: 'error',
        text: lang === 'pl' 
          ? 'Niepoprawny format pliku. Dopuszczalne są tylko pliki JPG, PNG i WEBP.' 
          : 'Invalid file format. Only JPG, PNG, and WEBP are allowed.'
      });
      return;
    }

    // Size check (Max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setStatusMessage({
        type: 'error',
        text: lang === 'pl' 
          ? 'Plik jest za duży. Maksymalny rozmiar to 5MB.' 
          : 'File size too large. Maximum size allowed is 5MB.'
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Prepopulate Alt Text with file name as a starting point
    const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
    if (!altText) setAltText(baseName.replace(/[-_]/g, ' '));
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(10);
    setStatusMessage(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setStatusMessage({
        type: 'error',
        text: lang === 'pl' ? 'Sesja wygasła. Zaloguj się ponownie.' : 'Session expired. Please log in again.'
      });
      setUploading(false);
      return;
    }

    // Sanitize filename & generate unique path to prevent conflicts
    const originalName = selectedFile.name;
    const cleanExt = originalName.substring(originalName.lastIndexOf('.')).toLowerCase();
    const cleanBaseName = originalName
      .substring(0, originalName.lastIndexOf('.'))
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toLowerCase();
    const uniqueHash = Math.random().toString(36).substring(2, 8);
    const uniqueFilename = `${Date.now()}_${uniqueHash}_${cleanBaseName}${cleanExt}`;
    const filePath = `gallery/${uniqueFilename}`;

    try {
      setUploadProgress(30);
      
      // Upload file to Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .upload(uniqueFilename, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) throw storageError;
      setUploadProgress(60);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(uniqueFilename);

      setUploadProgress(80);

      // Insert record into Database
      const { data: dbItem, error: dbError } = await supabase
        .from('gallery')
        .insert({
          image_url: publicUrl,
          file_path: filePath,
          title: title || null,
          alt_text: altText || null,
          category,
          description: description || null,
          created_by: user.id
        })
        .select()
        .single();

      if (dbError) {
        // Rollback: delete storage object if database insert fails
        await supabase.storage.from('gallery').remove([uniqueFilename]);
        throw dbError;
      }

      setUploadProgress(100);

      // Log successful upload in immutable audit logs via RPC
      await supabase.rpc('log_admin_action', {
        action: 'UPLOAD_IMAGE',
        target_table: 'gallery',
        target_id: dbItem.id,
        metadata: { title: title || originalName, category, filePath }
      });

      setStatusMessage({
        type: 'success',
        text: lang === 'pl' 
          ? 'Zdjęcie zostało dodane pomyślnie!' 
          : 'Image successfully uploaded and added to database!'
      });

      // Reset Form State
      setSelectedFile(null);
      setPreviewUrl(null);
      setTitle('');
      setAltText('');
      setCategory('food');
      setDescription('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      fetchGallery();
    } catch (err: unknown) {
      console.error('Upload error:', err);
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    const itemId = deleteTarget.id;
    const filePath = deleteTarget.file_path;
    const itemTitle = deleteTarget.title || 'Untitled';

    try {
      // 1. Delete database record first to stop public render immediately
      const { error: dbError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', itemId);

      if (dbError) throw new Error('Database record removal failed: ' + dbError.message);

      // 2. Delete storage file if it exists
      if (filePath) {
        const storageRelativePath = filePath.replace('gallery/', '');
        const { error: storageError } = await supabase.storage
          .from('gallery')
          .remove([storageRelativePath]);

        if (storageError) {
          // Log warning about orphaned file in storage, but don't fail since database is clean
          await supabase.rpc('log_admin_action', {
            action: 'DELETE_IMAGE_ORPHAN_WARNING',
            target_table: 'gallery',
            target_id: itemId,
            metadata: { filePath, error: storageError.message }
          });
          
          throw new Error(
            lang === 'pl'
              ? 'Wpis usunięto z bazy, ale plik w magazynie pozostał osierocony.'
              : 'Record deleted from database, but cleaning file from storage failed (file is orphaned).'
          );
        }
      }

      // 3. Log successful deletion
      await supabase.rpc('log_admin_action', {
        action: 'DELETE_IMAGE',
        target_table: 'gallery',
        target_id: itemId,
        metadata: { title: itemTitle, filePath }
      });

      setStatusMessage({
        type: 'success',
        text: lang === 'pl' ? 'Zdjęcie zostało usunięte.' : 'Image deleted successfully.'
      });

      setDeleteTarget(null);
      fetchGallery();
    } catch (err: unknown) {
      console.error('Delete error:', err);
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Admin Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-950 text-white p-6 border border-[#C5A880]/30 shadow-lg relative overflow-hidden rounded">
        {/* Frame borders */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#C5A880]/40 m-1" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#C5A880]/40 m-1" />
        
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-[#C5A880]" />
            <h1 className="font-serif text-xl sm:text-2xl uppercase tracking-wider">
              {lang === 'pl' ? 'KONSOLA ADMINISTRACYJNA' : 'ADMIN CONTROL CENTER'}
            </h1>
          </div>
          <p className="text-[10px] sm:text-xs font-mono text-slate-400">
            {lang === 'pl' ? 'Zalogowany jako: ' : 'Logged in as: '}<span className="text-sky-300 font-bold">{adminEmail}</span>
          </p>
        </div>

        <div className="flex flex-row space-x-3 mt-4 sm:mt-0 z-10 w-full sm:w-auto">
          {/* Tab Navigation */}
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 sm:flex-initial px-4 py-2 border text-xs font-mono flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'manage'
                ? 'border-[#C5A880] text-[#0A1128] bg-gradient-to-r from-[#C5A880] to-[#E2D1B6] font-bold'
                : 'border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{lang === 'pl' ? 'Zarządzaj' : 'Gallery Grid'}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 sm:flex-initial px-4 py-2 border text-xs font-mono flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'logs'
                ? 'border-[#C5A880] text-[#0A1128] bg-gradient-to-r from-[#C5A880] to-[#E2D1B6] font-bold'
                : 'border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ListCollapse className="w-3.5 h-3.5" />
            <span>{lang === 'pl' ? 'Dziennik zdarzeń' : 'Audit Logs'}</span>
          </button>

          <button
            onClick={onGoToSettings}
            className="flex-1 sm:flex-initial px-4 py-2 border border-slate-800 text-slate-400 hover:text-white text-xs font-mono flex items-center justify-center space-x-1.5 cursor-pointer rounded"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{lang === 'pl' ? 'Ustawienia' : 'Settings'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs font-mono flex items-center justify-center space-x-1.5 cursor-pointer rounded"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'pl' ? 'Wyloguj' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* Global Action Messages */}
      {statusMessage && (
        <div className={`p-4 border font-mono text-xs flex items-start space-x-2.5 rounded ${
          statusMessage.type === 'success' 
            ? 'border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400' 
            : 'border-red-500/20 bg-red-500/5 text-red-500'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-green-500" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Tab: Gallery Upload & Grid */}
      {activeTab === 'manage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Upload Area */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded shadow-sm">
            <h2 className="font-serif text-lg font-bold text-blue-950 dark:text-slate-100 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
              {lang === 'pl' ? 'Dodaj nowe zdjęcie' : 'Upload New Photo'}
            </h2>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              
              {/* File Drop/Input Area */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                  previewUrl 
                    ? 'border-[#C5A880]/50 bg-[#C5A880]/5' 
                    : 'border-slate-300 dark:border-slate-800 hover:border-[#C5A880]'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={uploading}
                />
                
                {previewUrl ? (
                  <div className="relative w-full max-h-48 overflow-hidden rounded border border-[#C5A880]/30">
                    <img 
                      src={previewUrl} 
                      alt="Upload Preview" 
                      className="w-full h-full object-contain object-center max-h-48"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 hover:bg-slate-900/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-mono bg-slate-950/80 px-2.5 py-1 rounded">
                        {lang === 'pl' ? 'Zmień plik' : 'Change file'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-slate-400 dark:text-slate-500">
                    <Upload className="w-10 h-10 mx-auto text-[#C5A880] stroke-[1.5]" />
                    <p className="text-xs font-mono uppercase tracking-wider">
                      {lang === 'pl' ? 'Wybierz zdjęcie (JPG, PNG, WEBP)' : 'Select image (JPG, PNG, WEBP)'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {lang === 'pl' ? 'Maksymalny rozmiar pliku: 5MB' : 'Maximum file size: 5MB'}
                    </p>
                  </div>
                )}
              </div>

              {/* Upload Progress Bar */}
              {uploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-[10px] text-[#C5A880]">
                    <span>{lang === 'pl' ? 'Wgrywanie pliku...' : 'Uploading...'}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 overflow-hidden rounded">
                    <div 
                      className="h-full bg-gradient-to-r from-[#C5A880] to-[#E2D1B6] transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Form Input fields */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] block mb-1">
                  {lang === 'pl' ? 'Tytuł (SEO)' : 'Title (SEO)'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={uploading}
                  placeholder={lang === 'pl' ? 'np. Danie Weselne z Grilla' : 'e.g. Wedding Grilled Banquet'}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] block mb-1">
                  {lang === 'pl' ? 'Tekst alternatywny - Alt Text (SEO)' : 'Alt Text (SEO)'}
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  disabled={uploading}
                  placeholder={lang === 'pl' ? 'Opis dla wyszukiwarek i czytników' : 'Description for search engines'}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] block mb-1">
                  {lang === 'pl' ? 'Kategoria' : 'Category'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                >
                  <option value="food">{lang === 'pl' ? 'Jedzenie / Dania' : 'Food / Dishes'}</option>
                  <option value="wedding">{lang === 'pl' ? 'Wesela' : 'Weddings'}</option>
                  <option value="corporate">{lang === 'pl' ? 'Wydarzenia firmowe' : 'Corporate'}</option>
                  <option value="venue">{lang === 'pl' ? 'Lokalizacje / Aranżacje' : 'Venues / Setups'}</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] block mb-1">
                  {lang === 'pl' ? 'Opis' : 'Description'}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={uploading}
                  rows={3}
                  placeholder={lang === 'pl' ? 'Krótki opis potrawy lub wydarzenia...' : 'Brief description of food or event...'}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                />
              </div>

              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold tracking-widest uppercase cursor-pointer border border-[#C5A880] disabled:opacity-45 hover:shadow transition-all"
              >
                {uploading ? (
                  <span className="flex items-center justify-center space-x-1.5">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{lang === 'pl' ? 'Wysyłanie...' : 'Uploading...'}</span>
                  </span>
                ) : (
                  <span>{lang === 'pl' ? 'Dodaj zdjęcie' : 'Submit Upload'}</span>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Existing Image List */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
              <h2 className="font-serif text-lg font-bold text-blue-950 dark:text-slate-100 uppercase tracking-wide">
                {lang === 'pl' ? 'Istniejące zdjęcia' : 'Existing Gallery Items'}
              </h2>
              <span className="font-mono text-xs text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded">
                {galleryItems.length} items
              </span>
            </div>

            {loading ? (
              <div className="min-h-[30vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : galleryItems.length === 0 ? (
              <div className="p-10 border border-dashed border-slate-200 dark:border-slate-850 rounded text-center text-slate-400 font-mono text-xs uppercase">
                {lang === 'pl' ? 'Brak zdjęć w galerii.' : 'No images found in database.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-1">
                {galleryItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 flex flex-row rounded overflow-hidden relative group"
                  >
                    <div className="w-24 h-24 shrink-0 bg-slate-900 relative">
                      <img 
                        src={item.image_url} 
                        alt={item.alt_text || 'Gallery thumbnail'} 
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-slate-900/90 text-sky-400 text-[8px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-wide rounded">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-3 flex-grow flex flex-col justify-between overflow-hidden">
                      <div className="space-y-1">
                        <h4 className="font-serif text-xs font-bold text-slate-900 dark:text-white truncate uppercase tracking-wide">
                          {item.title || 'Untitled'}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono truncate">
                          {item.alt_text || 'No alt text'}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-sans line-clamp-2 leading-relaxed">
                          {item.description || 'No description provided.'}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[8px] font-mono text-slate-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="text-red-400 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded cursor-pointer transition-colors"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
            <h2 className="font-serif text-lg font-bold text-blue-950 dark:text-slate-100 uppercase tracking-wide flex items-center space-x-1.5">
              <span>{lang === 'pl' ? 'Systemowy rejestr zdarzeń' : 'System Audit Trail'}</span>
            </h2>
            <span className="text-[9px] font-mono text-red-500 border border-red-500/30 bg-red-500/5 px-2.5 py-1 uppercase rounded font-bold">
              🔒 Immutable Logs
            </span>
          </div>

          {logsLoading ? (
            <div className="min-h-[30vh] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="p-10 border border-dashed border-slate-200 dark:border-slate-850 rounded text-center text-slate-400 font-mono text-xs uppercase">
              {lang === 'pl' ? 'Brak wpisów w dzienniku.' : 'No audit entries logged.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[#C5A880] uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3 font-semibold">{lang === 'pl' ? 'Czas' : 'Timestamp'}</th>
                    <th className="py-2.5 px-3 font-semibold">{lang === 'pl' ? 'Użytkownik' : 'Admin'}</th>
                    <th className="py-2.5 px-3 font-semibold">{lang === 'pl' ? 'Akcja' : 'Event Action'}</th>
                    <th className="py-2.5 px-3 font-semibold">{lang === 'pl' ? 'Tabela' : 'Target'}</th>
                    <th className="py-2.5 px-3 font-semibold">{lang === 'pl' ? 'Szczegóły' : 'Metadata Logs'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-300">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-400">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-sky-400 font-bold">{log.user_email || 'System'}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          log.action.includes('WARNING')
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : log.action.includes('DELETE')
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : log.action.includes('UPLOAD')
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {log.target_table ? `${log.target_table}(${log.target_id?.substring(0, 8)})` : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-xs leading-normal max-w-xs truncate" title={JSON.stringify(log.metadata)}>
                        {log.metadata ? JSON.stringify(log.metadata) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal Overlay */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] dark:bg-slate-900 border border-[#C5A880]/40 p-6 max-w-md w-full rounded shadow-2xl relative overflow-hidden space-y-6 animate-scale-up">
            
            {/* Corner Filigrees */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#C5A880]/40 m-1" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#C5A880]/40 m-1" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#C5A880]/40 m-1" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#C5A880]/40 m-1" />

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white uppercase text-center tracking-wider">
                {lang === 'pl' ? 'Potwierdź usunięcie' : 'Confirm Action'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed text-center font-sans">
                {lang === 'pl' 
                  ? `Czy na pewno chcesz usunąć zdjęcie "${deleteTarget.title || 'Untitled'}"? Usunięcie spowoduje wykasowanie wpisu z bazy danych oraz powiązanego pliku z magazynu plików.`
                  : `Are you sure you want to delete the image "${deleteTarget.title || 'Untitled'}"? This action will permanently remove the database metadata and the associated file from cloud storage.`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2.5 sm:space-y-0 sm:space-x-3 text-xs font-mono">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2.5 border border-slate-300 dark:border-slate-800 text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-50 cursor-pointer text-center uppercase"
              >
                {lang === 'pl' ? 'Anuluj' : 'Cancel'}
              </button>
              
              <button
                type="button"
                onClick={handleDeleteItem}
                disabled={deleting}
                className="flex-1 py-2.5 border border-red-500 bg-red-500 text-white hover:bg-red-600 cursor-pointer text-center font-bold uppercase transition-all flex items-center justify-center space-x-1.5"
              >
                {deleting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{lang === 'pl' ? 'Usuwanie...' : 'Deleting...'}</span>
                  </>
                ) : (
                  <span>{lang === 'pl' ? 'TAK, USUŃ' : 'YES, DELETE'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
