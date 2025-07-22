import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  productsCount: number;
  categoriesCount: number;
  ordersCount: number;
  visitorsCount: number;
  recentProducts: any[];
  popularProducts: any[];
  recentMessages: any[];
  recentOrders: any[];
}

export interface Color {
  id: string;
  name: string;
  hex_code: string;
  is_active: boolean;
  sort_order: number;
}

export interface Size {
  id: string;
  name: string;
  display_name: string;
  is_active: boolean;
  sort_order: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  status: string;
  total_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    productsCount: 0,
    categoriesCount: 0,
    ordersCount: 0,
    visitorsCount: 0,
    recentProducts: [],
    popularProducts: [],
    recentMessages: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        // Fetch basic counts
        const [productsRes, categoriesRes, ordersRes, visitorsRes] = await Promise.all([
          supabase.from('products').select('id', { count: 'exact' }),
          supabase.from('categories').select('id', { count: 'exact' }),
          supabase.from('orders').select('id', { count: 'exact' }),
          supabase.from('visitor_stats').select('id', { count: 'exact' })
        ]);

        // Fetch recent products
        const { data: recentProducts } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch popular products (most viewed) - using basic query for now
        const { data: popularProducts } = await supabase
          .from('product_views')
          .select('product_id')
          .limit(5);

        // Fetch recent messages
        const { data: recentMessages } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch recent orders
        const { data: recentOrders } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          productsCount: productsRes.count || 0,
          categoriesCount: categoriesRes.count || 0,
          ordersCount: ordersRes.count || 0,
          visitorsCount: visitorsRes.count || 0,
          recentProducts: recentProducts || [],
          popularProducts: popularProducts || [],
          recentMessages: recentMessages || [],
          recentOrders: recentOrders || []
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الإحصائيات');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  return { stats, loading, error };
}

export function useColors() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchColors() {
      try {
        const { data, error } = await supabase
          .from('colors')
          .select('*')
          .order('sort_order');

        if (error) throw error;
        setColors(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الألوان');
      } finally {
        setLoading(false);
      }
    }

    fetchColors();
  }, []);

  return { colors, loading, error, refetch: () => window.location.reload() };
}

export function useSizes() {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSizes() {
      try {
        const { data, error } = await supabase
          .from('sizes')
          .select('*')
          .order('sort_order');

        if (error) throw error;
        setSizes(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المقاسات');
      } finally {
        setLoading(false);
      }
    }

    fetchSizes();
  }, []);

  return { sizes, loading, error, refetch: () => window.location.reload() };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الطلبات');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: () => window.location.reload() };
}

export function useContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الرسائل');
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, []);

  return { messages, loading, error, refetch: () => window.location.reload() };
}