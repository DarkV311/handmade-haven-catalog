import { useState } from "react";
import { ChevronLeft, Package, Flame, Clock, BookOpen, Stamp, Palette } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  count: number;
}

interface CategorySidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: Category[];
}

export function CategorySidebar({ selectedCategory, onCategoryChange, categories }: CategorySidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const allCategories = [
    { id: 'all', name: 'جميع المنتجات', icon: Package, count: categories.reduce((acc, cat) => acc + cat.count, 0) },
    ...categories
  ];

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-80"} bg-card border-r border-border transition-all duration-300`}
      collapsible="icon"
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-xl font-bold text-foreground">الأقسام</h2>
          )}
          <SidebarTrigger className="p-2 hover:bg-muted rounded-lg transition-colors" />
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 p-4">
              {allCategories.map((category) => (
                <SidebarMenuItem key={category.id}>
                  <SidebarMenuButton 
                    asChild
                    className={`w-full justify-start py-3 px-4 rounded-lg transition-all duration-200 ${
                      selectedCategory === category.id 
                        ? 'bg-gradient-primary text-primary-foreground shadow-glow' 
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <button onClick={() => onCategoryChange(category.id)}>
                      <category.icon size={20} className="ml-3 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-right">{category.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            selectedCategory === category.id 
                              ? 'bg-primary-foreground/20 text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {category.count}
                          </span>
                        </>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}