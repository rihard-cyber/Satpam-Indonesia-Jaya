import { supabase } from './supabase';

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      return supabase.auth.signInWithPassword({ email, password });
    },
    register: async (email: string, password: string, metadata: Record<string, any>) => {
      return supabase.auth.signUp({ email, password, options: { data: metadata } });
    },
    logout: async () => supabase.auth.signOut(),
    getUser: async () => supabase.auth.getUser(),
  },

  profile: {
    get: async (userId: string) => {
      return supabase
        .from('profiles')
        .select('*, tingkatan:tingkatan_id(*)')
        .eq('user_id', userId)
        .single();
    },
    update: async (userId: string, data: any) => {
      return supabase.from('profiles').update(data).eq('user_id', userId);
    },
  },

  materi: {
    list: async (tingkatan?: string) => {
      let query = supabase
        .from('materi')
        .select('*, kategori:materi_kategori_id(*)')
        .eq('is_published', true)
        .order('urutan');
      if (tingkatan) query = query.eq('kategori.tingkatan_id', tingkatan);
      return query;
    },
    get: async (id: string) => {
      return supabase.from('materi').select('*').eq('id', id).single();
    },
  },

  loker: {
    list: async () => {
      return supabase
        .from('job_vacancies')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
    },
  },

  forum: {
    posts: async () => {
      return supabase
        .from('forum_posts')
        .select('*, user:user_id(nama_lengkap), category:category_id(nama)')
        .order('created_at', { ascending: false });
    },
  },
};
