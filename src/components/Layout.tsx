import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CategorySidebar } from "./CategorySidebar";
import { Package, Flame, Clock, BookOpen, Stamp, Palette } from "lucide-react";
import { useCategories, useSettings } from "@/hooks/useSupabaseData";

interface LayoutProps {
  children: React.ReactNode;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function Layout({ children, selectedCategory, onCategoryChange }: LayoutProps) {
  const { categories } = useCategories();
  const { settingsMap } = useSettings();

  // Icon mapping
  const iconMap: Record<string, React.ComponentType<any>> = {
    Stamp,
    Flame,
    Clock,
    BookOpen,
    Package,
    Palette,
  };

  // Convert categories for sidebar
  const sidebarCategories = categories.map(cat => ({
    id: cat.slug,
    name: cat.name,
    icon: iconMap[cat.icon] || Package,
    count: 0 // Will be calculated based on products
  }));

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <CategorySidebar 
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          categories={sidebarCategories}
        />
        
        <main className="flex-1">
          {/* Header */}
          <header className="bg-card border-b border-border shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {settingsMap.site_title || 'كتالوج المنتجات اليدوية'}
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {settingsMap.site_description || 'اكتشف أجمل التصاميم والمنتجات المصنوعة يدوياً'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <a 
                  href="/admin" 
                  className="text-sm bg-gradient-primary hover:bg-gradient-warm text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  لوحة الإدارة
                </a>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">للتواصل</div>
                  <div className="font-semibold text-foreground">
                    {settingsMap.contact_phone || '01004119595'}
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}