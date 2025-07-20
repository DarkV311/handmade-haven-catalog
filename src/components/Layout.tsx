import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CategorySidebar } from "./CategorySidebar";
import { Package, Flame, Clock, BookOpen, Stamp, Palette } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  count: number;
}

interface LayoutProps {
  children: React.ReactNode;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories: Category[] = [
  { id: 'wooden-stamps', name: 'البصمات الخشب والأكليريك', icon: Stamp, count: 3 },
  { id: 'incense-burners', name: 'أشكال المباخر', icon: Flame, count: 2 },
  { id: 'clock-numbers', name: 'أشكال أرقام الساعات', icon: Clock, count: 2 },
  { id: 'quran-decor', name: 'آيات قرآنية وديكور', icon: BookOpen, count: 1 },
  { id: 'stamp-supplies', name: 'مستلزمات البصمات', icon: Package, count: 1 },
  { id: 'handmade-supplies', name: 'مستلزمات الهاند ميد', icon: Palette, count: 1 }
];

export function Layout({ children, selectedCategory, onCategoryChange }: LayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <CategorySidebar 
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          categories={categories}
        />
        
        <main className="flex-1">
          {/* Header */}
          <header className="bg-card border-b border-border shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    كتالوج المنتجات اليدوية
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    اكتشف أجمل التصاميم والمنتجات المصنوعة يدوياً
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">للتواصل</div>
                  <div className="font-semibold text-foreground">01004119595</div>
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