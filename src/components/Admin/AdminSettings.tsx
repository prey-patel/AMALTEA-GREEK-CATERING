import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, LogOut, CheckCircle, AlertTriangle, 
  Settings, Key, Mail, UserPlus, RefreshCw, Trash2, 
  UserX, UserCheck, Eye, Upload,
  Briefcase, Award, Users, Utensils, Heart, Sparkles, 
  Calendar, TrendingUp, Coins, Coffee, Globe, Building, 
  Cake, Gift, Music, Smile, Home, Bookmark, Compass, 
  ChefHat, GlassWater, Wine, Flame, Sun
} from 'lucide-react';
import { PageHeroData, CateringCategory } from '../../types';

const LucideIconsLookup: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase, Award, Users, Utensils, Heart, Sparkles, Calendar, TrendingUp,
  Coins, Coffee, Globe, Building, Cake, Gift, Music, Smile, Home, Bookmark,
  Compass, ChefHat, GlassWater, Wine, Flame, Sun
};

interface AdminSettingsProps {
  onLogout: () => void;
  lang: 'en' | 'pl';
  onBackToGallery: () => void;
  refreshPageHeroes?: () => void;
  refreshCategories?: () => void;
}

interface AdminUser {
  user_id: string;
  email: string;
  role: 'owner' | 'admin';
  is_active: boolean;
  created_at: string;
  created_by: string | null;
}

export default function AdminSettings({ onLogout, lang, onBackToGallery, refreshPageHeroes, refreshCategories }: AdminSettingsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'account' | 'admins' | 'heroes' | 'categories'>('account');
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [currentUserRole, setCurrentUserRole] = useState<'owner' | 'admin' | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // Catering Categories States
  const [categoriesList, setCategoriesList] = useState<CateringCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [selectedCategoryPage, setSelectedCategoryPage] = useState<'business' | 'private'>('business');
  
  // Add/Edit Form State
  const [editingCategory, setEditingCategory] = useState<CateringCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState<{
    page: 'business' | 'private';
    title_en: string;
    title_pl: string;
    description_en: string;
    description_pl: string;
    icon_name: string;
    sort_order: number;
    menu_pdf_url: string;
  }>({
    page: 'business',
    title_en: '',
    title_pl: '',
    description_en: '',
    description_pl: '',
    icon_name: 'Utensils',
    sort_order: 10,
    menu_pdf_url: '',
  });
  const [showCategoryFormModal, setShowCategoryFormModal] = useState(false);
  
  // Delete Category Target
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<CateringCategory | null>(null);

  // Page Heroes States
  const [heroesList, setHeroesList] = useState<PageHeroData[]>([]);
  const [selectedHeroId, setSelectedHeroId] = useState<string>('home');
  const [heroForm, setHeroForm] = useState<Omit<PageHeroData, 'id'>>({
    badge_en: '',
    badge_pl: '',
    title_en: '',
    title_pl: '',
    subtitle_en: '',
    subtitle_pl: '',
    image_url: '',
  });
  const [heroesLoading, setHeroesLoading] = useState(false);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroUploadProgress, setHeroUploadProgress] = useState(0);
  const heroFileInputRef = React.useRef<HTMLInputElement>(null);

  // Category PDF upload state & ref
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfUploadProgress, setPdfUploadProgress] = useState(0);
  const categoryPdfInputRef = React.useRef<HTMLInputElement>(null);

  // Status Message
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // My Account - Change Password Form
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // My Account - Change Email Form
  const [newEmail, setNewEmail] = useState('');

  // Owner - Admin List
  const [adminList, setAdminList] = useState<AdminUser[]>([]);
  const [listLoading, setListLoading] = useState(false);

  // Owner - Invite Admin Form
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'owner'>('owner');

  // Confirmation Modals
  const [confirmAction, setConfirmAction] = useState<{
    type: 'disable' | 'enable' | 'remove' | 'role_owner' | 'role_admin' | 'reset_password';
    admin: AdminUser;
  } | null>(null);

  const supabaseUrl = (import.meta as unknown as { env: Record<string, string | undefined> }).env.VITE_SUPABASE_URL || '';

  useEffect(() => {
    fetchCurrentAdminProfile();
  }, []);

  useEffect(() => {
    if (activeSubTab === 'admins' && (currentUserRole === 'owner' || currentUserRole === 'admin')) {
      fetchAdminUsers();
    }
  }, [activeSubTab, currentUserRole]);

  useEffect(() => {
    if (activeSubTab === 'heroes') {
      fetchHeroes();
    }
  }, [activeSubTab]);

  useEffect(() => {
    if (activeSubTab === 'categories') {
      fetchCateringCategoriesList();
    }
  }, [activeSubTab]);

  const fetchCateringCategoriesList = async () => {
    setCategoriesLoading(true);
    try {
      const { data, error } = await supabase
        .from('catering_categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      if (data) {
        setCategoriesList(data);
      }
    } catch (err) {
      console.error('Error fetching catering categories:', err);
      setStatusMessage({
        type: 'error',
        text: lang === 'pl' ? 'Nie udało się pobrać kategorii cateringu.' : 'Failed to fetch catering categories.'
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleCategoryFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setActionLoading(true);
    try {
      const payload = {
        page: categoryForm.page,
        title_en: categoryForm.title_en,
        title_pl: categoryForm.title_pl,
        description_en: categoryForm.description_en,
        description_pl: categoryForm.description_pl,
        icon_name: categoryForm.icon_name,
        sort_order: Number(categoryForm.sort_order),
        menu_pdf_url: categoryForm.menu_pdf_url || null,
        updated_at: new Date().toISOString()
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('catering_categories')
          .update(payload)
          .eq('id', editingCategory.id);
        if (error) throw error;

        try {
          await supabase.rpc('log_admin_action', {
            action: 'UPDATE_CATERING_CATEGORY',
            target_table: 'catering_categories',
            target_id: editingCategory.id,
            metadata: { title_en: payload.title_en, page: payload.page }
          });
        } catch (logErr) {
          console.warn('Logging action failed:', logErr);
        }

        setStatusMessage({
          type: 'success',
          text: lang === 'pl' ? 'Kategoria cateringu została pomyślnie zaktualizowana!' : 'Catering category has been successfully updated!'
        });
      } else {
        const { data, error } = await supabase
          .from('catering_categories')
          .insert([{ ...payload, created_at: new Date().toISOString() }])
          .select()
          .single();
        if (error) throw error;

        try {
          await supabase.rpc('log_admin_action', {
            action: 'CREATE_CATERING_CATEGORY',
            target_table: 'catering_categories',
            target_id: data.id,
            metadata: { title_en: payload.title_en, page: payload.page }
          });
        } catch (logErr) {
          console.warn('Logging action failed:', logErr);
        }

        setStatusMessage({
          type: 'success',
          text: lang === 'pl' ? 'Kategoria cateringu została pomyślnie dodana!' : 'Catering category has been successfully added!'
        });
      }

      setShowCategoryFormModal(false);
      setEditingCategory(null);
      setCategoryForm({
        page: selectedCategoryPage,
        title_en: '',
        title_pl: '',
        description_en: '',
        description_pl: '',
        icon_name: 'Utensils',
        sort_order: 10,
        menu_pdf_url: '',
      });

      fetchCateringCategoriesList();
      if (refreshCategories) {
        refreshCategories();
      }
    } catch (err) {
      console.error('Error saving catering category:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setStatusMessage({
        type: 'error',
        text: errMsg || (lang === 'pl' ? 'Wystąpił błąd podczas zapisywania kategorii.' : 'Failed to save catering category.')
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryTarget) return;
    setStatusMessage(null);
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('catering_categories')
        .delete()
        .eq('id', deleteCategoryTarget.id);
      if (error) throw error;

      try {
        await supabase.rpc('log_admin_action', {
          action: 'DELETE_CATERING_CATEGORY',
          target_table: 'catering_categories',
          target_id: deleteCategoryTarget.id,
          metadata: { title_en: deleteCategoryTarget.title_en, page: deleteCategoryTarget.page }
        });
      } catch (logErr) {
        console.warn('Logging action failed:', logErr);
      }

      setStatusMessage({
        type: 'success',
        text: lang === 'pl' ? 'Kategoria cateringu została pomyślnie usunięta!' : 'Catering category has been successfully deleted!'
      });

      setDeleteCategoryTarget(null);
      fetchCateringCategoriesList();
      if (refreshCategories) {
        refreshCategories();
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setStatusMessage({
        type: 'error',
        text: errMsg || (lang === 'pl' ? 'Wystąpił błąd podczas usuwania kategorii.' : 'Failed to delete catering category.')
      });
    } finally {
      setActionLoading(false);
    }
  };

  const fetchHeroes = async () => {
    setHeroesLoading(true);
    try {
      const { data, error } = await supabase
        .from('page_heroes')
        .select('*');
      if (error) throw error;
      if (data) {
        setHeroesList(data);
        const currentHero = data.find(h => h.id === selectedHeroId) || data[0];
        if (currentHero) {
          setSelectedHeroId(currentHero.id);
          setHeroForm({
            badge_en: currentHero.badge_en,
            badge_pl: currentHero.badge_pl,
            title_en: currentHero.title_en,
            title_pl: currentHero.title_pl,
            subtitle_en: currentHero.subtitle_en,
            subtitle_pl: currentHero.subtitle_pl,
            image_url: currentHero.image_url,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching heroes:', err);
      setStatusMessage({
        type: 'error',
        text: lang === 'pl' ? 'Nie udało się pobrać bohaterów stron.' : 'Failed to fetch page heroes.'
      });
    } finally {
      setHeroesLoading(false);
    }
  };

  const handleHeroSelectChange = (id: string) => {
    setSelectedHeroId(id);
    const found = heroesList.find(h => h.id === id);
    if (found) {
      setHeroForm({
        badge_en: found.badge_en,
        badge_pl: found.badge_pl,
        title_en: found.title_en,
        title_pl: found.title_pl,
        subtitle_en: found.subtitle_en,
        subtitle_pl: found.subtitle_pl,
        image_url: found.image_url,
      });
    }
  };

  const handleHeroFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('page_heroes')
        .update({
          badge_en: heroForm.badge_en,
          badge_pl: heroForm.badge_pl,
          title_en: heroForm.title_en,
          title_pl: heroForm.title_pl,
          subtitle_en: heroForm.subtitle_en,
          subtitle_pl: heroForm.subtitle_pl,
          image_url: heroForm.image_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedHeroId);

      if (error) throw error;

      // Log action in audit logs
      try {
        await supabase.rpc('log_admin_action', {
          action: 'UPDATE_PAGE_HERO',
          target_table: 'page_heroes',
          target_id: selectedHeroId,
          metadata: { page: selectedHeroId }
        });
      } catch (logErr) {
        console.warn('Logging action failed:', logErr);
      }

      setStatusMessage({
        type: 'success',
        text: lang === 'pl' ? 'Bohater strony został pomyślnie zaktualizowany!' : 'Page hero has been successfully updated!'
      });

      // Update local state list
      setHeroesList(prev => prev.map(h => h.id === selectedHeroId ? { ...h, ...heroForm } : h));

      // Refresh app state
      if (refreshPageHeroes) {
        refreshPageHeroes();
      }
    } catch (err) {
      console.error('Error updating hero:', err);
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleHeroFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    setHeroUploading(true);
    setHeroUploadProgress(20);
    setStatusMessage(null);

    const originalName = file.name;
    const cleanExt = originalName.substring(originalName.lastIndexOf('.')).toLowerCase();
    const uniqueHash = Math.random().toString(36).substring(2, 8);
    const uniqueFilename = `hero_${selectedHeroId}_${Date.now()}_${uniqueHash}${cleanExt}`;

    try {
      setHeroUploadProgress(50);
      
      // Upload file to Supabase Storage in 'gallery' bucket
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .upload(uniqueFilename, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (storageError) throw storageError;
      setHeroUploadProgress(80);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(uniqueFilename);

      setHeroUploadProgress(100);

      // Update the image_url field in our form state
      setHeroForm(prev => ({ ...prev, image_url: publicUrl }));

      setStatusMessage({
        type: 'success',
        text: lang === 'pl' 
          ? 'Zdjęcie przesłane pomyślnie. Nie zapomnij zapisać zmian!' 
          : 'Image uploaded successfully. Remember to save changes!'
      });
    } catch (err) {
      console.error('Hero image upload error:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setStatusMessage({
        type: 'error',
        text: errMsg || (lang === 'pl' ? 'Wystąpił błąd podczas przesyłania zdjęcia.' : 'Failed to upload image.')
      });
    } finally {
      setHeroUploading(false);
      // Reset input value so same file can be selected again
      if (heroFileInputRef.current) {
        heroFileInputRef.current.value = '';
      }
    }
  };

  const handleCategoryPdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (PDF)
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setStatusMessage({
        type: 'error',
        text: lang === 'pl' ? 'Tylko pliki PDF są akceptowane.' : 'Only PDF files are accepted.'
      });
      return;
    }

    // Validate size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setStatusMessage({
        type: 'error',
        text: lang === 'pl' ? 'Rozmiar pliku nie może przekraczać 10MB.' : 'File size cannot exceed 10MB.'
      });
      return;
    }

    setPdfUploading(true);
    setPdfUploadProgress(20);
    setStatusMessage(null);

    const originalName = file.name;
    const cleanExt = originalName.substring(originalName.lastIndexOf('.')).toLowerCase();
    const uniqueHash = Math.random().toString(36).substring(2, 8);
    const uniqueFilename = `menu_${categoryForm.page}_${Date.now()}_${uniqueHash}${cleanExt}`;

    try {
      setPdfUploadProgress(50);
      
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .upload(`menus/${uniqueFilename}`, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (storageError) throw storageError;
      setPdfUploadProgress(80);

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(`menus/${uniqueFilename}`);

      setPdfUploadProgress(100);

      setCategoryForm(prev => ({ ...prev, menu_pdf_url: publicUrl }));

      setStatusMessage({
        type: 'success',
        text: lang === 'pl' 
          ? 'Menu PDF przesłane pomyślnie. Nie zapomnij zapisać zmian!' 
          : 'Menu PDF uploaded successfully. Remember to save changes!'
      });
    } catch (err) {
      console.error('Menu PDF upload error:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setStatusMessage({
        type: 'error',
        text: errMsg || (lang === 'pl' ? 'Wystąpił błąd podczas przesyłania menu PDF.' : 'Failed to upload PDF.')
      });
    } finally {
      setPdfUploading(false);
      if (categoryPdfInputRef.current) {
        categoryPdfInputRef.current.value = '';
      }
    }
  };

  const fetchCurrentAdminProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      setCurrentUserEmail(user.email || '');

      // Fetch role and active status
      const { data, error } = await supabase
        .from('admin_users')
        .select('role, is_active')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        if (!data.is_active) {
          // If admin has been disabled, trigger logout
          console.warn('Current admin user is disabled.');
        }
        setCurrentUserRole(data.role as 'owner' | 'admin');
      }
    }
  };

  const fetchAdminUsers = async () => {
    setListLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) throw new Error('No active auth session.');

      const response = await fetch(`${supabaseUrl}/functions/v1/manage-admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'LIST_ADMINS' })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to retrieve admin list.');
      }

      setAdminList(resData.admins || []);
    } catch (err: unknown) {
      console.error('Fetch admins error:', err);
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setListLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
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

  // Change Own Password
  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (newPassword.length < 8) {
      setStatusMessage({
        type: 'error',
        text: lang === 'pl' ? 'Hasło musi mieć co najmniej 8 znaków.' : 'Password must be at least 8 characters long.'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({
        type: 'error',
        text: lang === 'pl' ? 'Hasła nie pasują do siebie.' : 'Passwords do not match.'
      });
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      // Log action in audit logs
      await supabase.rpc('log_admin_action', {
        action: 'CHANGE_OWN_PASSWORD',
        target_table: 'auth.users',
        target_id: currentUserId
      });

      setStatusMessage({
        type: 'success',
        text: lang === 'pl' ? 'Twoje hasło zostało zmienione pomyślnie!' : 'Your password has been successfully updated!'
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      console.error('Password change error:', err);
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Request Own Password Reset Email
  const handleRequestResetEmail = async () => {
    setStatusMessage(null);
    setActionLoading(true);
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(currentUserEmail, {
        redirectTo: `${origin}/admin`
      });

      if (error) throw error;

      await supabase.rpc('log_admin_action', {
        action: 'SEND_PASSWORD_RESET',
        target_table: 'auth.users',
        target_id: currentUserId,
        metadata: { self_reset: true }
      });

      setStatusMessage({
        type: 'success',
        text: lang === 'pl' 
          ? 'Link do resetu hasła został wysłany na Twój adres e-mail.' 
          : 'Password reset link has been dispatched to your email address.'
      });
    } catch (err: unknown) {
      console.error('Reset link request error:', err);
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Change Own Email
  const handleEmailChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!newEmail || newEmail.toLowerCase() === currentUserEmail.toLowerCase()) {
      setStatusMessage({
        type: 'error',
        text: lang === 'pl' ? 'Wprowadź nowy adres e-mail.' : 'Please enter a new email address.'
      });
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;

      await supabase.rpc('log_admin_action', {
        action: 'CHANGE_OWN_EMAIL',
        target_table: 'auth.users',
        target_id: currentUserId,
        metadata: { new_email: newEmail }
      });

      setStatusMessage({
        type: 'success',
        text: lang === 'pl' 
          ? 'Żądanie zmiany adresu e-mail zostało wysłane. Sprawdź skrzynkę odbiorczą na obu adresach e-mail w celu potwierdzenia.' 
          : 'Email update initiated. A confirmation link has been sent to both your old and new email addresses.'
      });
      setNewEmail('');
    } catch (err: unknown) {
      console.error('Email change error:', err);
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Invite a new admin user
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!inviteEmail) {
      setStatusMessage({
        type: 'error',
        text: lang === 'pl' ? 'Wprowadź adres e-mail.' : 'Please enter an email address.'
      });
      return;
    }

    setActionLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) throw new Error('No active auth session.');

      const response = await fetch(`${supabaseUrl}/functions/v1/manage-admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'INVITE_ADMIN',
          params: { email: inviteEmail, role: inviteRole }
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to invite administrator.');
      }

      setStatusMessage({
        type: 'success',
        text: lang === 'pl' 
          ? `Zaproszenie zostało wysłane do ${inviteEmail}.` 
          : `Invitation successfully sent to ${inviteEmail}.`
      });
      setInviteEmail('');
      setInviteRole('owner');
      fetchAdminUsers();
    } catch (err: unknown) {
      console.error('Invite error:', err);
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Perform confirmable administrative actions via Edge Function
  const executeAdminAction = async () => {
    if (!confirmAction) return;

    setStatusMessage(null);
    setActionLoading(true);
    const targetAdmin = confirmAction.admin;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) throw new Error('No active auth session.');

      let actionName = '';
      let params: Record<string, unknown> = {};

      if (confirmAction.type === 'disable') {
        actionName = 'DISABLE_ADMIN_USER';
        params = { target_user_id: targetAdmin.user_id, is_active: false };
      } else if (confirmAction.type === 'enable') {
        actionName = 'DISABLE_ADMIN_USER';
        params = { target_user_id: targetAdmin.user_id, is_active: true };
      } else if (confirmAction.type === 'role_owner') {
        actionName = 'UPDATE_ADMIN_ROLE';
        params = { target_user_id: targetAdmin.user_id, role: 'owner' };
      } else if (confirmAction.type === 'role_admin') {
        actionName = 'UPDATE_ADMIN_ROLE';
        params = { target_user_id: targetAdmin.user_id, role: 'admin' };
      } else if (confirmAction.type === 'remove') {
        actionName = 'REMOVE_ADMIN_ROLE';
        params = { target_user_id: targetAdmin.user_id };
      } else if (confirmAction.type === 'reset_password') {
        actionName = 'SEND_PASSWORD_RESET';
        params = { target_email: targetAdmin.email };
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/manage-admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: actionName, params })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Operation failed.');
      }

      setStatusMessage({
        type: 'success',
        text: lang === 'pl' ? 'Operacja zakończona pomyślnie!' : 'Operation completed successfully!'
      });

      setConfirmAction(null);
      fetchAdminUsers();
    } catch (err: unknown) {
      console.error('Admin action execution error:', err);
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-950 text-white p-6 border border-[#C5A880]/30 shadow-lg relative overflow-hidden rounded">
        {/* Frame borders */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#C5A880]/40 m-1" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#C5A880]/40 m-1" />
        
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-[#C5A880]" />
            <h1 className="font-serif text-xl sm:text-2xl uppercase tracking-wider">
              {lang === 'pl' ? 'USTAWIENIA KONTA' : 'ADMINISTRATOR SETTINGS'}
            </h1>
          </div>
          <p className="text-[10px] sm:text-xs font-mono text-slate-400">
            {lang === 'pl' ? 'Zalogowany jako: ' : 'Logged in as: '}<span className="text-sky-300 font-bold">{currentUserEmail}</span>
            {currentUserRole && <span className="ml-2 text-[#C5A880] border border-[#C5A880]/30 px-1.5 py-0.2 rounded font-semibold text-[8px] uppercase">{currentUserRole}</span>}
          </p>
        </div>

        <div className="flex flex-row space-x-3 mt-4 sm:mt-0 z-10 w-full sm:w-auto">
          {/* Navigation */}
          <button
            onClick={onBackToGallery}
            className="flex-1 sm:flex-initial px-4 py-2 border border-slate-800 text-slate-400 hover:text-white text-xs font-mono flex items-center justify-center space-x-1.5 cursor-pointer rounded"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'pl' ? 'Powrót' : 'Back to Gallery'}</span>
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

      {/* Global Status messages */}
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

      {/* Tab Selectors */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 font-mono text-xs mb-6">
        <button
          onClick={() => setActiveSubTab('account')}
          className={`py-3 px-6 font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
            activeSubTab === 'account'
              ? 'border-[#C5A880] text-[#C5A880] dark:text-[#E2D1B6]'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          {lang === 'pl' ? 'Moje konto' : 'My Account'}
        </button>

        <button
          onClick={() => setActiveSubTab('heroes')}
          className={`py-3 px-6 font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
            activeSubTab === 'heroes'
              ? 'border-[#C5A880] text-[#C5A880] dark:text-[#E2D1B6]'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          {lang === 'pl' ? 'Bohaterowie stron' : 'Page Heroes'}
        </button>

        <button
          onClick={() => setActiveSubTab('categories')}
          className={`py-3 px-6 font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
            activeSubTab === 'categories'
              ? 'border-[#C5A880] text-[#C5A880] dark:text-[#E2D1B6]'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          {lang === 'pl' ? 'Oferta cateringowa' : 'Catering Categories'}
        </button>
        
        {(currentUserRole === 'owner' || currentUserRole === 'admin') && (
          <button
            onClick={() => setActiveSubTab('admins')}
            className={`py-3 px-6 font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
              activeSubTab === 'admins'
                ? 'border-[#C5A880] text-[#C5A880] dark:text-[#E2D1B6]'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            {lang === 'pl' ? 'Zarządzaj administratorami' : 'Admin Users'}
          </button>
        )}
      </div>

      {/* SUBTAB 1: My Account Settings */}
      {activeSubTab === 'account' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Password update card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded shadow-sm space-y-5">
            <h2 className="font-serif text-lg font-bold text-blue-950 dark:text-slate-100 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center space-x-2">
              <Key className="w-4 h-4 text-[#C5A880]" />
              <span>{lang === 'pl' ? 'Zmień hasło' : 'Change Password'}</span>
            </h2>

            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] block mb-1">
                  {lang === 'pl' ? 'Nowe hasło' : 'New Password'}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={actionLoading}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                  required
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] block mb-1">
                  {lang === 'pl' ? 'Potwierdź nowe hasło' : 'Confirm New Password'}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={actionLoading}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold tracking-widest uppercase cursor-pointer border border-[#C5A880] disabled:opacity-45 hover:shadow transition-all"
              >
                {lang === 'pl' ? 'Zaktualizuj hasło' : 'Update Password'}
              </button>
            </form>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4 text-center">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mb-2">
                {lang === 'pl' ? 'Lub prześlij link resetujący na swój adres e-mail' : 'Or dispatch a password reset link to your email'}
              </p>
              <button
                type="button"
                onClick={handleRequestResetEmail}
                disabled={actionLoading}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:border-[#C5A880] text-slate-700 dark:text-slate-300 text-xs font-mono cursor-pointer rounded"
              >
                {lang === 'pl' ? 'Wyślij e-mail resetujący' : 'Send Reset Link Email'}
              </button>
            </div>
          </div>

          {/* Email change card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded shadow-sm space-y-5">
            <h2 className="font-serif text-lg font-bold text-blue-950 dark:text-slate-100 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center space-x-2">
              <Mail className="w-4 h-4 text-[#C5A880]" />
              <span>{lang === 'pl' ? 'Zmień adres e-mail' : 'Change Email Address'}</span>
            </h2>

            <form onSubmit={handleEmailChangeSubmit} className="space-y-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] block mb-1">
                  {lang === 'pl' ? 'Obecny adres e-mail' : 'Current Email Address'}
                </label>
                <input
                  type="text"
                  value={currentUserEmail}
                  className="w-full px-3 py-2 border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-400 text-xs rounded"
                  disabled
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] block mb-1">
                  {lang === 'pl' ? 'Nowy adres e-mail' : 'New Email Address'}
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  disabled={actionLoading}
                  placeholder="new-admin@amaltea.com.pl"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                  required
                />
              </div>

              <div className="p-3 border border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400 font-mono text-[10px] leading-relaxed rounded">
                ⚠️ {lang === 'pl' 
                  ? 'Zatwierdzenie tej operacji wyśle potwierdzenie na stary oraz nowy adres e-mail. Adres zostanie zmieniony po kliknięciu w oba linki.' 
                  : 'Updating your email requires confirming the links sent to both your current address and the new address.'}
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold tracking-widest uppercase cursor-pointer border border-[#C5A880] disabled:opacity-45 hover:shadow transition-all"
              >
                {lang === 'pl' ? 'Zmień adres e-mail' : 'Request Email Change'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Manage Admin Users */}
      {activeSubTab === 'admins' && (currentUserRole === 'owner' || currentUserRole === 'admin') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Invite form (email + role) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded shadow-sm">
            <h2 className="font-serif text-lg font-bold text-blue-950 dark:text-slate-100 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-3 mb-5 flex items-center space-x-2">
              <UserPlus className="w-4 h-4 text-[#C5A880]" />
              <span>{lang === 'pl' ? 'Zaproś administratora' : 'Invite Admin'}</span>
            </h2>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] block mb-1">
                  {lang === 'pl' ? 'Adres e-mail' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  disabled={actionLoading}
                  placeholder="admin-invite@amaltea.com.pl"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                  required
                />
              </div>



              <div className="p-3 border border-[#C5A880]/20 bg-[#C5A880]/5 text-slate-500 font-mono text-[9px] leading-relaxed rounded">
                💡 {lang === 'pl' 
                  ? 'Zostanie wysłany e-mail z linkiem aktywacyjnym. Użytkownik sam ustawi swoje hasło logowania po kliknięciu.' 
                  : 'An invite email will be sent. The user will define their password when accepting.'}
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold tracking-widest uppercase cursor-pointer border border-[#C5A880] disabled:opacity-45 hover:shadow transition-all"
              >
                {lang === 'pl' ? 'Wyślij zaproszenie' : 'Send Invitation'}
              </button>
            </form>
          </div>

          {/* Admin user listing */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
              <h2 className="font-serif text-lg font-bold text-blue-950 dark:text-slate-100 uppercase tracking-wide">
                {lang === 'pl' ? 'Administratorzy' : 'Registered Administrators'}
              </h2>
              <button 
                onClick={fetchAdminUsers}
                disabled={listLoading}
                className="text-[#C5A880] hover:text-[#E2D1B6] disabled:opacity-50 p-1 cursor-pointer"
                title="Refresh list"
              >
                <RefreshCw className={`w-4 h-4 ${listLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {listLoading ? (
              <div className="min-h-[30vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : adminList.length === 0 ? (
              <div className="p-10 border border-dashed border-slate-200 dark:border-slate-850 rounded text-center text-slate-400 font-mono text-xs uppercase">
                {lang === 'pl' ? 'Brak danych o administratorach.' : 'No administrators registered.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[#C5A880] uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-2 font-semibold">{lang === 'pl' ? 'Adres E-mail' : 'Email Address'}</th>
                      <th className="py-2.5 px-2 font-semibold">{lang === 'pl' ? 'Rola' : 'Role'}</th>
                      <th className="py-2.5 px-2 font-semibold">{lang === 'pl' ? 'Status' : 'Status'}</th>
                      <th className="py-2.5 px-2 font-semibold text-right">{lang === 'pl' ? 'Akcje' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-300">
                    {adminList.map((admin) => (
                      <tr key={admin.user_id} className={`hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors ${admin.user_id === currentUserId ? 'bg-sky-500/5' : ''}`}>
                        <td className="py-3 px-2 font-sans text-xs">
                          <div className="font-semibold">{admin.email}</div>
                          {admin.user_id === currentUserId && (
                            <span className="text-[8px] font-mono text-sky-500 bg-sky-500/10 px-1 py-0.2 rounded font-bold uppercase">
                              {lang === 'pl' ? 'Ty' : 'You'}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                            admin.role === 'owner' 
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                              : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                          }`}>
                            {admin.role}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-1.5 py-0.5 rounded font-bold text-[8px] uppercase ${
                            admin.is_active 
                              ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                              : 'bg-red-500/10 text-red-500 border border-red-500/20'
                          }`}>
                            {admin.is_active ? (lang === 'pl' ? 'Aktywny' : 'Active') : (lang === 'pl' ? 'Zablokowany' : 'Disabled')}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right space-x-1.5 whitespace-nowrap">
                          {/* Disable / Enable Toggle */}
                          {admin.user_id !== currentUserId && (
                            <button
                              onClick={() => setConfirmAction({
                                type: admin.is_active ? 'disable' : 'enable',
                                admin
                              })}
                              className={`p-1.5 rounded cursor-pointer transition-colors ${
                                admin.is_active 
                                  ? 'text-amber-500 hover:bg-amber-500/10' 
                                  : 'text-green-500 hover:bg-green-500/10'
                              }`}
                              title={admin.is_active ? (lang === 'pl' ? 'Zablokuj dostęp' : 'Disable access') : (lang === 'pl' ? 'Odblokuj dostęp' : 'Enable access')}
                              disabled={actionLoading}
                            >
                              {admin.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            </button>
                          )}



                          {/* Send password reset reset link */}
                          <button
                            onClick={() => setConfirmAction({
                              type: 'reset_password',
                              admin
                            })}
                            className="text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 p-1.5 rounded cursor-pointer transition-colors"
                            title={lang === 'pl' ? 'Wyślij e-mail resetujący hasło' : 'Send password reset email'}
                            disabled={actionLoading}
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          {/* Remove Admin Role from admin_users list */}
                          {admin.user_id !== currentUserId && (
                            <button
                              onClick={() => setConfirmAction({
                                type: 'remove',
                                admin
                              })}
                              className="text-red-400 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded cursor-pointer transition-colors"
                              title={lang === 'pl' ? 'Odbierz uprawnienia' : 'Revoke Admin Role'}
                              disabled={actionLoading}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: Page Heroes Editor */}
      {activeSubTab === 'heroes' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
            <h2 className="font-serif text-lg font-bold text-blue-950 dark:text-slate-100 uppercase tracking-wide flex items-center space-x-2">
              <Settings className="w-4 h-4 text-[#C5A880]" />
              <span>{lang === 'pl' ? 'Edytuj Bohaterów Stron' : 'Edit Page Heroes'}</span>
            </h2>
            <button 
              onClick={fetchHeroes}
              disabled={heroesLoading}
              className="text-[#C5A880] hover:text-[#E2D1B6] disabled:opacity-50 p-1 cursor-pointer"
              title="Refresh heroes"
              type="button"
            >
              <RefreshCw className={`w-4 h-4 ${heroesLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {heroesLoading ? (
            <div className="min-h-[30vh] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleHeroFormSubmit} className="space-y-6">
              {/* Target Page Selector */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] block mb-1">
                  {lang === 'pl' ? 'Wybierz stronę' : 'Select Page'}
                </label>
                <select
                  value={selectedHeroId}
                  onChange={(e) => handleHeroSelectChange(e.target.value)}
                  disabled={actionLoading}
                  className="w-full md:max-w-xs px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                >
                  <option value="home">{lang === 'pl' ? 'Strona Główna (Home Page)' : 'Home Page'}</option>
                  <option value="about">{lang === 'pl' ? 'O Nas (About Us)' : 'About Us'}</option>
                  <option value="business">{lang === 'pl' ? 'Dla Biznesu (Business)' : 'Business'}</option>
                  <option value="private">{lang === 'pl' ? 'Klient Prywatny (Private)' : 'Private'}</option>
                  <option value="gallery">{lang === 'pl' ? 'Galeria (Gallery)' : 'Gallery'}</option>
                  <option value="contact">{lang === 'pl' ? 'Kontakt (Contact)' : 'Contact'}</option>
                </select>
              </div>

              {/* Translation Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Badge Section */}
                <div className="space-y-4 border border-slate-100 dark:border-slate-850 p-4 rounded bg-slate-50/50 dark:bg-slate-950/20">
                  <h3 className="font-mono text-[11px] font-bold text-blue-900 dark:text-sky-450 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-1.5">
                    {lang === 'pl' ? 'Etykieta (Badge)' : 'Badge Copy'}
                  </h3>
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block mb-1">
                      {lang === 'pl' ? 'Etykieta (EN)' : 'Badge (EN)'}
                    </label>
                    <input
                      type="text"
                      value={heroForm.badge_en}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, badge_en: e.target.value }))}
                      disabled={actionLoading}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block mb-1">
                      {lang === 'pl' ? 'Etykieta (PL)' : 'Badge (PL)'}
                    </label>
                    <input
                      type="text"
                      value={heroForm.badge_pl}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, badge_pl: e.target.value }))}
                      disabled={actionLoading}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                      required
                    />
                  </div>
                </div>

                {/* Title Section */}
                <div className="space-y-4 border border-slate-100 dark:border-slate-850 p-4 rounded bg-slate-50/50 dark:bg-slate-950/20">
                  <h3 className="font-mono text-[11px] font-bold text-blue-900 dark:text-sky-450 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-1.5">
                    {lang === 'pl' ? 'Tytuł główny' : 'Hero Title'}
                  </h3>
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block mb-1">
                      {lang === 'pl' ? 'Tytuł (EN)' : 'Title (EN)'}
                    </label>
                    <input
                      type="text"
                      value={heroForm.title_en}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, title_en: e.target.value }))}
                      disabled={actionLoading}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block mb-1">
                      {lang === 'pl' ? 'Tytuł (PL)' : 'Title (PL)'}
                    </label>
                    <input
                      type="text"
                      value={heroForm.title_pl}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, title_pl: e.target.value }))}
                      disabled={actionLoading}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                      required
                    />
                  </div>
                </div>

                {/* Subtitle Section */}
                <div className="md:col-span-2 space-y-4 border border-slate-100 dark:border-slate-850 p-4 rounded bg-slate-50/50 dark:bg-slate-950/20">
                  <h3 className="font-mono text-[11px] font-bold text-blue-900 dark:text-sky-450 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-1.5">
                    {lang === 'pl' ? 'Podtytuł (Subtitle)' : 'Hero Subtitle'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block mb-1">
                        {lang === 'pl' ? 'Podtytuł (EN)' : 'Subtitle (EN)'}
                      </label>
                      <textarea
                        value={heroForm.subtitle_en}
                        onChange={(e) => setHeroForm(prev => ({ ...prev, subtitle_en: e.target.value }))}
                        disabled={actionLoading}
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880] resize-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block mb-1">
                        {lang === 'pl' ? 'Podtytuł (PL)' : 'Subtitle (PL)'}
                      </label>
                      <textarea
                        value={heroForm.subtitle_pl}
                        onChange={(e) => setHeroForm(prev => ({ ...prev, subtitle_pl: e.target.value }))}
                        disabled={actionLoading}
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880] resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Background Image Section */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-12 gap-6 items-end border border-slate-100 dark:border-slate-850 p-4 rounded bg-slate-50/50 dark:bg-slate-950/20">
                  <div className="md:col-span-8 space-y-4">
                    <h3 className="font-mono text-[11px] font-bold text-blue-900 dark:text-sky-450 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-1.5">
                      {lang === 'pl' ? 'Obraz w tle' : 'Background Image'}
                    </h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block mb-1">
                          {lang === 'pl' ? 'URL obrazu (wpisz ręcznie lub prześlij plik poniżej)' : 'Image URL (enter manually or upload below)'}
                        </label>
                        <input
                          type="url"
                          value={heroForm.image_url}
                          onChange={(e) => setHeroForm(prev => ({ ...prev, image_url: e.target.value }))}
                          disabled={actionLoading || heroUploading}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                          required
                        />
                      </div>

                      {/* File Upload Button & Progress */}
                      <div className="space-y-2">
                        <label className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block mb-1">
                          {lang === 'pl' ? 'Prześlij plik z urządzenia' : 'Upload file from device'}
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="file"
                            ref={heroFileInputRef}
                            onChange={handleHeroFileChange}
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            disabled={actionLoading || heroUploading}
                          />
                          <button
                            type="button"
                            onClick={() => heroFileInputRef.current?.click()}
                            disabled={actionLoading || heroUploading}
                            className="px-4 py-2 border border-[#C5A880] hover:bg-[#C5A880]/10 text-slate-900 dark:text-white font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer disabled:opacity-50 transition-colors flex items-center space-x-1.5 rounded-none"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{lang === 'pl' ? 'Wybierz i prześlij zdjęcie' : 'Choose & Upload Photo'}</span>
                          </button>
                          
                          {heroUploading && (
                            <div className="flex items-center space-x-2 text-[10px] font-mono text-[#C5A880]">
                              <span className="w-3 h-3 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
                              <span>{heroUploadProgress}%</span>
                            </div>
                          )}
                        </div>
                        <p className="text-[9px] text-slate-400 font-sans">
                          {lang === 'pl' 
                            ? 'Dopuszczalne formaty: JPG, PNG, WEBP. Maksymalny rozmiar: 5MB.' 
                            : 'Allowed formats: JPG, PNG, WEBP. Max size: 5MB.'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-4">
                    <div className="relative h-28 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden rounded">
                      {heroForm.image_url ? (
                        <>
                          <img
                            src={heroForm.image_url}
                            alt="Background Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-[9px] text-white font-mono uppercase bg-slate-900/80 px-2 py-0.5 rounded">Preview</span>
                          </div>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono uppercase">No Preview</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold tracking-widest uppercase cursor-pointer border border-[#C5A880] disabled:opacity-45 hover:shadow transition-all flex items-center space-x-2"
                >
                  {actionLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{lang === 'pl' ? 'Zapisywanie...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <span>{lang === 'pl' ? 'Zapisz zmiany' : 'Save Changes'}</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* SUBTAB 4: Catering Categories Editor */}
      {activeSubTab === 'categories' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 dark:border-slate-800 pb-4 gap-4">
            <div className="space-y-1">
              <h2 className="font-serif text-lg font-bold text-blue-950 dark:text-slate-100 uppercase tracking-wide flex items-center space-x-2">
                <Settings className="w-4 h-4 text-[#C5A880]" />
                <span>{lang === 'pl' ? 'Oferta i Subkategorie' : 'Catering Categories & Services'}</span>
              </h2>
              <p className="text-slate-450 dark:text-slate-500 font-sans text-xs">
                {lang === 'pl' 
                  ? 'Zarządzaj sekcjami wyświetlanymi na podstronach Dla Biznesu i Klient Prywatny.' 
                  : 'Manage subcategory cards displayed on the Business and Private catering pages.'}
              </p>
            </div>
            
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button 
                onClick={fetchCateringCategoriesList}
                disabled={categoriesLoading}
                className="text-[#C5A880] hover:text-[#E2D1B6] disabled:opacity-50 p-2 border border-slate-200 dark:border-slate-800 rounded cursor-pointer bg-transparent"
                title="Refresh categories"
                type="button"
              >
                <RefreshCw className={`w-4 h-4 ${categoriesLoading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryForm({
                    page: selectedCategoryPage,
                    title_en: '',
                    title_pl: '',
                    description_en: '',
                    description_pl: '',
                    icon_name: 'Utensils',
                    sort_order: (categoriesList.filter(c => c.page === selectedCategoryPage).length + 1) * 10,
                    menu_pdf_url: '',
                  });
                  setShowCategoryFormModal(true);
                }}
                disabled={actionLoading}
                className="flex-grow sm:flex-initial px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white font-mono text-xs font-bold tracking-widest uppercase cursor-pointer border border-[#C5A880] hover:shadow transition-all flex items-center justify-center space-x-1.5 rounded-none"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{lang === 'pl' ? 'Dodaj nową' : 'Add Category'}</span>
              </button>
            </div>
          </div>

          {/* Page Filter Tabs */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 font-mono text-[11px] mb-4">
            <button
              onClick={() => setSelectedCategoryPage('business')}
              className={`py-2 px-4 font-semibold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
                selectedCategoryPage === 'business'
                  ? 'border-[#C5A880] text-[#C5A880] dark:text-[#E2D1B6]'
                  : 'border-transparent text-slate-400 hover:text-slate-650 dark:hover:text-slate-250'
              }`}
            >
              {lang === 'pl' ? 'Dla Biznesu' : 'Business Catering'}
            </button>
            <button
              onClick={() => setSelectedCategoryPage('private')}
              className={`py-2 px-4 font-semibold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
                selectedCategoryPage === 'private'
                  ? 'border-[#C5A880] text-[#C5A880] dark:text-[#E2D1B6]'
                  : 'border-transparent text-slate-400 hover:text-slate-650 dark:hover:text-slate-250'
              }`}
            >
              {lang === 'pl' ? 'Klient Prywatny' : 'Private Celebrations'}
            </button>
          </div>

          {categoriesLoading ? (
            <div className="min-h-[30vh] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : categoriesList.filter(c => c.page === selectedCategoryPage).length === 0 ? (
            <div className="p-12 border border-dashed border-slate-200 dark:border-slate-800 rounded text-center text-slate-400 font-mono text-xs uppercase">
              {lang === 'pl' ? 'Brak zdefiniowanych kategorii dla tej strony.' : 'No categories configured for this page.'}
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded">
              <table className="w-full text-left font-mono text-[11px] border-collapse bg-slate-50/20 dark:bg-slate-950/10">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[#C5A880] uppercase tracking-wider text-[10px] bg-slate-100/50 dark:bg-slate-900/50">
                    <th className="py-3 px-4 font-semibold w-12 text-center">{lang === 'pl' ? 'Ikona' : 'Icon'}</th>
                    <th className="py-3 px-4 font-semibold w-1/4">{lang === 'pl' ? 'Tytuł (PL / EN)' : 'Title (PL / EN)'}</th>
                    <th className="py-3 px-4 font-semibold">{lang === 'pl' ? 'Opis (PL / EN)' : 'Description (PL / EN)'}</th>
                    <th className="py-3 px-4 font-semibold w-16 text-center">{lang === 'pl' ? 'Kolejność' : 'Sort'}</th>
                    <th className="py-3 px-4 font-semibold text-right w-24">{lang === 'pl' ? 'Akcje' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-755 dark:text-slate-300">
                  {categoriesList
                    .filter(c => c.page === selectedCategoryPage)
                    .map((cat) => {
                      const IconComponent = LucideIconsLookup[cat.icon_name] || LucideIconsLookup.Utensils;
                      return (
                        <tr key={cat.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-950/30 transition-colors">
                          <td className="py-4 px-4 text-center">
                            <div className="w-8 h-8 mx-auto bg-blue-50 dark:bg-blue-900/20 text-blue-805 dark:text-blue-450 flex items-center justify-center rounded">
                              <IconComponent className="w-4 h-4" />
                            </div>
                          </td>
                          <td className="py-4 px-4 font-sans text-xs space-y-1">
                            <div className="font-bold text-blue-955 dark:text-sky-200">{cat.title_pl}</div>
                            <div className="text-slate-400 dark:text-slate-500 italic">{cat.title_en}</div>
                          </td>
                          <td className="py-4 px-4 font-sans text-xs space-y-1">
                            <div className="line-clamp-2 text-slate-600 dark:text-slate-300">{cat.description_pl}</div>
                            <div className="line-clamp-2 text-slate-400 dark:text-slate-500 italic">{cat.description_en}</div>
                          </td>
                          <td className="py-4 px-4 text-center font-bold text-slate-900 dark:text-white">
                            {cat.sort_order}
                          </td>
                          <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategory(cat);
                                setCategoryForm({
                                  page: cat.page,
                                  title_en: cat.title_en,
                                  title_pl: cat.title_pl,
                                  description_en: cat.description_en,
                                  description_pl: cat.description_pl,
                                  icon_name: cat.icon_name,
                                  sort_order: cat.sort_order,
                                  menu_pdf_url: cat.menu_pdf_url || '',
                                });
                                setShowCategoryFormModal(true);
                              }}
                              disabled={actionLoading}
                              className="p-1.5 text-sky-500 hover:bg-sky-500/10 rounded cursor-pointer transition-colors"
                              title={lang === 'pl' ? 'Edytuj' : 'Edit'}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteCategoryTarget(cat)}
                              disabled={actionLoading}
                              className="p-1.5 text-red-400 hover:bg-red-500/10 rounded cursor-pointer transition-colors"
                              title={lang === 'pl' ? 'Usuń' : 'Delete'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Category Form Modal Overlay */}
      {showCategoryFormModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] dark:bg-slate-900 border border-[#C5A880]/40 p-6 max-w-2xl w-full rounded shadow-2xl relative overflow-hidden space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            
            {/* Corner Filigrees */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#C5A880]/40 m-1" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#C5A880]/40 m-1" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#C5A880]/40 m-1" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#C5A880]/40 m-1" />

            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
              {editingCategory 
                ? (lang === 'pl' ? 'Edytuj Kategorię' : 'Edit Catering Category') 
                : (lang === 'pl' ? 'Dodaj Nową Kategorię' : 'Add Catering Category')}
            </h3>

            <form onSubmit={handleCategoryFormSubmit} className="space-y-4 font-sans text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Page Selection */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] block mb-1">
                    {lang === 'pl' ? 'Strona docelowa' : 'Target Page'}
                  </label>
                  <select
                    value={categoryForm.page}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, page: e.target.value as 'business' | 'private' }))}
                    disabled={actionLoading}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                  >
                    <option value="business">{lang === 'pl' ? 'Dla Biznesu (Business)' : 'Business Catering'}</option>
                    <option value="private">{lang === 'pl' ? 'Klient Prywatny (Private)' : 'Private Celebrations'}</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] block mb-1">
                    {lang === 'pl' ? 'Kolejność sortowania' : 'Sort Order'}
                  </label>
                  <input
                    type="number"
                    value={categoryForm.sort_order}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
                    disabled={actionLoading}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                    required
                  />
                </div>
              </div>

              {/* Title Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] block mb-1">
                    {lang === 'pl' ? 'Tytuł (Polski)' : 'Title (Polish)'}
                  </label>
                  <input
                    type="text"
                    value={categoryForm.title_pl}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, title_pl: e.target.value }))}
                    disabled={actionLoading}
                    placeholder="np. Catering bankietowy"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                    required
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] block mb-1">
                    {lang === 'pl' ? 'Tytuł (Angielski)' : 'Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={categoryForm.title_en}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, title_en: e.target.value }))}
                    disabled={actionLoading}
                    placeholder="e.g. Banquet Catering"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                    required
                  />
                </div>
              </div>

              {/* Description Fields */}
              <div className="space-y-3">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] block mb-1">
                    {lang === 'pl' ? 'Opis (Polski)' : 'Description (Polish)'}
                  </label>
                  <textarea
                    value={categoryForm.description_pl}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description_pl: e.target.value }))}
                    disabled={actionLoading}
                    rows={3}
                    placeholder="Opisz ofertę dla polskich klientów..."
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880] resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] block mb-1">
                    {lang === 'pl' ? 'Opis (Angielski)' : 'Description (English)'}
                  </label>
                  <textarea
                    value={categoryForm.description_en}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description_en: e.target.value }))}
                    disabled={actionLoading}
                    rows={3}
                    placeholder="Describe the service for English clients..."
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880] resize-none"
                    required
                  />
                </div>
              </div>

              {/* Menu PDF Link & Upload */}
              <div className="border border-slate-100 dark:border-slate-850 p-4 rounded bg-slate-50/50 dark:bg-slate-950/20 space-y-3">
                <h4 className="font-mono text-[10px] font-bold text-blue-900 dark:text-sky-450 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  {lang === 'pl' ? 'Menu PDF (Opcjonalnie)' : 'Menu PDF (Optional)'}
                </h4>
                
                <div>
                  <label className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block mb-1">
                    {lang === 'pl' ? 'Adres URL do pliku PDF' : 'PDF File URL'}
                  </label>
                  <input
                    type="url"
                    value={categoryForm.menu_pdf_url}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, menu_pdf_url: e.target.value }))}
                    disabled={actionLoading || pdfUploading}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:ring-[#C5A880] focus:border-[#C5A880]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block mb-1">
                    {lang === 'pl' ? 'Prześlij plik PDF z komputera' : 'Upload PDF from computer'}
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      ref={categoryPdfInputRef}
                      onChange={handleCategoryPdfChange}
                      accept="application/pdf"
                      className="hidden"
                      disabled={actionLoading || pdfUploading}
                    />
                    <button
                      type="button"
                      onClick={() => categoryPdfInputRef.current?.click()}
                      disabled={actionLoading || pdfUploading}
                      className="px-4 py-2 border border-[#C5A880] hover:bg-[#C5A880]/10 text-slate-900 dark:text-white font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer disabled:opacity-50 transition-colors flex items-center space-x-1.5 rounded-none"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{lang === 'pl' ? 'Wybierz i prześlij plik PDF' : 'Choose & Upload PDF'}</span>
                    </button>

                    {categoryForm.menu_pdf_url && (
                      <button
                        type="button"
                        onClick={() => setCategoryForm(prev => ({ ...prev, menu_pdf_url: '' }))}
                        disabled={actionLoading || pdfUploading}
                        className="px-3 py-2 border border-red-500 hover:bg-red-500/10 text-red-500 font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer disabled:opacity-50 transition-colors rounded-none"
                      >
                        {lang === 'pl' ? 'Usuń powiązany PDF' : 'Remove PDF'}
                      </button>
                    )}
                    
                    {pdfUploading && (
                      <div className="flex items-center space-x-2 text-[10px] font-mono text-[#C5A880]">
                        <span className="w-3 h-3 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
                        <span>{pdfUploadProgress}%</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-400 font-sans">
                    {lang === 'pl' 
                      ? 'Pliki są zapisywane w bezpiecznej chmurze. Maksymalny rozmiar: 10MB.' 
                      : 'Files are stored in secure cloud storage. Max size: 10MB.'}
                  </p>
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880] block mb-2">
                  {lang === 'pl' ? 'Wybierz ikonę' : 'Choose Icon'} (<span>{categoryForm.icon_name}</span>)
                </label>
                
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 max-h-[140px] overflow-y-auto rounded">
                  {['Briefcase', 'Award', 'Users', 'Utensils', 'Heart', 'Sparkles', 'Calendar', 'TrendingUp', 'Coins', 'Coffee', 'Globe', 'Building', 'Cake', 'Gift', 'Music', 'Smile', 'Home', 'Bookmark', 'Compass', 'ChefHat', 'GlassWater', 'Wine', 'Flame', 'Sun'].map((iconName) => {
                    const IconComp = LucideIconsLookup[iconName] || LucideIconsLookup.Utensils;
                    const isSelected = categoryForm.icon_name === iconName;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setCategoryForm(prev => ({ ...prev, icon_name: iconName }))}
                        className={`p-2 border rounded flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected 
                            ? 'border-[#C5A880] bg-[#C5A880]/15 text-[#C5A880] scale-105 font-bold' 
                            : 'border-slate-100 dark:border-slate-850 text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-850/50'
                        }`}
                        title={iconName}
                      >
                        <IconComp className="w-5 h-5" />
                        <span className="text-[7px] truncate max-w-full font-mono">{iconName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-3 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setShowCategoryFormModal(false)}
                  disabled={actionLoading}
                  className="flex-1 py-2.5 border border-slate-300 dark:border-slate-800 text-slate-500 hover:text-slate-700 bg-white dark:bg-slate-900 cursor-pointer text-center uppercase"
                >
                  {lang === 'pl' ? 'Anuluj' : 'Cancel'}
                </button>
                
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 border border-[#C5A880] bg-[#C5A880] hover:bg-[#b0946b] text-slate-950 font-bold cursor-pointer text-center uppercase transition-all flex items-center justify-center space-x-1.5"
                >
                  {actionLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>{lang === 'pl' ? 'Zapisywanie...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <span>{lang === 'pl' ? 'Zapisz' : 'Save'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Modal */}
      {deleteCategoryTarget && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] dark:bg-slate-900 border border-red-500/40 p-6 max-w-md w-full rounded shadow-2xl relative overflow-hidden space-y-6 animate-scale-up">
            
            {/* Corner Filigrees */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-red-500/30 m-1" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-red-500/30 m-1" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-red-500/30 m-1" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-red-500/30 m-1" />

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white uppercase text-center tracking-wider">
                {lang === 'pl' ? 'Potwierdź usunięcie' : 'Confirm Deletion'}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed text-center font-sans">
                {lang === 'pl' 
                  ? `Czy na pewno chcesz usunąć kategorię "${deleteCategoryTarget.title_pl}"? Ta operacja usunie ją całkowicie z podstrony i bazy danych.`
                  : `Are you sure you want to delete category "${deleteCategoryTarget.title_en}"? This will permanently remove it from the page and database.`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2.5 sm:space-y-0 sm:space-x-3 text-xs font-mono">
              <button
                type="button"
                onClick={() => setDeleteCategoryTarget(null)}
                disabled={actionLoading}
                className="flex-1 py-2.5 border border-slate-350 dark:border-slate-850 text-slate-505 hover:text-slate-705 bg-white dark:bg-slate-900 cursor-pointer text-center uppercase"
              >
                {lang === 'pl' ? 'Anuluj' : 'Cancel'}
              </button>
              
              <button
                type="button"
                onClick={handleDeleteCategory}
                disabled={actionLoading}
                className="flex-1 py-2.5 border border-red-500 bg-red-500 hover:bg-red-600 text-white font-bold cursor-pointer text-center uppercase transition-all flex items-center justify-center space-x-1.5"
              >
                {actionLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{lang === 'pl' ? 'Usuwanie...' : 'Deleting...'}</span>
                  </>
                ) : (
                  <span>{lang === 'pl' ? 'Usuń' : 'Delete'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal Overlay */}
      {confirmAction && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] dark:bg-slate-900 border border-[#C5A880]/40 p-6 max-w-md w-full rounded shadow-2xl relative overflow-hidden space-y-6 animate-scale-up">
            
            {/* Corner Filigrees */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#C5A880]/40 m-1" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#C5A880]/40 m-1" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#C5A880]/40 m-1" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#C5A880]/40 m-1" />

            <div className="space-y-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                confirmAction.type === 'remove' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white uppercase text-center tracking-wider">
                {lang === 'pl' ? 'Potwierdź operację' : 'Confirm Action'}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed text-center font-sans">
                {confirmAction.type === 'disable' && (
                  lang === 'pl' 
                    ? `Czy na pewno chcesz zablokować dostęp administratora dla użytkownika "${confirmAction.admin.email}"? Zablokowany użytkownik nie będzie mógł logować się ani wykonywać żadnych akcji.`
                    : `Are you sure you want to disable administrator access for "${confirmAction.admin.email}"? They will be blocked from logging in or executing any operations.`
                )}
                {confirmAction.type === 'enable' && (
                  lang === 'pl' 
                    ? `Czy na pewno chcesz odblokować dostęp dla użytkownika "${confirmAction.admin.email}"?`
                    : `Are you sure you want to enable access for "${confirmAction.admin.email}"?`
                )}
                {confirmAction.type === 'remove' && (
                  lang === 'pl' 
                    ? `Czy na pewno chcesz odebrać uprawnienia administratora użytkownikowi "${confirmAction.admin.email}"? Wpis z tabeli "admin_users" zostanie usunięty, odbierając mu wszelki dostęp (konto logowania pozostanie).`
                    : `Are you sure you want to revoke administrative permissions for "${confirmAction.admin.email}"? This deletes their mapping from "admin_users", blocking all panel access (their auth login remains).`
                )}
                {confirmAction.type === 'role_owner' && (
                  lang === 'pl' 
                    ? `Czy na pewno chcesz promować użytkownika "${confirmAction.admin.email}" do roli OWNER? Użytkownicy z rolą Owner mogą zarządzać kontami innych administratorów.`
                    : `Are you sure you want to promote "${confirmAction.admin.email}" to OWNER role? Owner users have permissions to manage other administrative accounts.`
                )}
                {confirmAction.type === 'role_admin' && (
                  lang === 'pl' 
                    ? `Czy na pewno chcesz zmienić rolę użytkownika "${confirmAction.admin.email}" na ADMIN? Utraci on uprawnienia do zarządzania innymi kontami.`
                    : `Are you sure you want to change "${confirmAction.admin.email}" to ADMIN role? They will lose permissions to manage other accounts.`
                )}
                {confirmAction.type === 'reset_password' && (
                  lang === 'pl' 
                    ? `Czy na pewno chcesz wysłać link resetujący hasło na adres "${confirmAction.admin.email}"?`
                    : `Are you sure you want to dispatch a password reset link email to "${confirmAction.admin.email}"?`
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2.5 sm:space-y-0 sm:space-x-3 text-xs font-mono">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                disabled={actionLoading}
                className="flex-1 py-2.5 border border-slate-300 dark:border-slate-800 text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-50 cursor-pointer text-center uppercase"
              >
                {lang === 'pl' ? 'Anuluj' : 'Cancel'}
              </button>
              
              <button
                type="button"
                onClick={executeAdminAction}
                disabled={actionLoading}
                className={`flex-1 py-2.5 border text-white cursor-pointer text-center font-bold uppercase transition-all flex items-center justify-center space-x-1.5 ${
                  confirmAction.type === 'remove' 
                    ? 'border-red-500 bg-red-500 hover:bg-red-600' 
                    : 'border-amber-500 bg-[#C5A880] hover:bg-[#b0946b]'
                }`}
              >
                {actionLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{lang === 'pl' ? 'Przetwarzanie...' : 'Processing...'}</span>
                  </>
                ) : (
                  <span>{lang === 'pl' ? 'Potwierdzam' : 'Confirm'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
