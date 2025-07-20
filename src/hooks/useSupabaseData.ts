import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  price_currency: string;
  image_url: string;
  category_id: string;
  is_active: boolean;
  sort_order: number;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  description: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الأقسام');
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المنتجات');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}

export function useSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*');

        if (error) throw error;
        
        const settingsData = data || [];
        setSettings(settingsData);
        
        // Create a map for easy access
        const map = settingsData.reduce((acc, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {} as Record<string, string>);
        
        setSettingsMap(map);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الإعدادات');
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return { settings, settingsMap, loading, error };
}