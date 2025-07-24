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
      className={`${collapsed ? "w-16" : "w-72"} bg-gradient-to-b from-card to-card/80 backdrop-blur-sm border-l border-border/50 shadow-elegant transition-all duration-300`}
      collapsible="icon"
      side="right"
    >
      {/* Header with elegant design */}
      <div className="p-6 border-b border-border/30 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="space-y-1">
              <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">الأقسام</h2>
              <p className="text-xs text-muted-foreground">اختر القسم المطلوب</p>
            </div>
          )}
          <SidebarTrigger className="p-2 hover:bg-primary/10 rounded-xl transition-all duration-200 hover:scale-105" />
        </div>
      </div>

      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {allCategories.map((category, index) => (
                <SidebarMenuItem key={category.id}>
                  <SidebarMenuButton 
                    asChild
                    className={`w-full justify-start py-4 px-4 rounded-xl transition-all duration-300 group hover:scale-[1.02] ${
                      selectedCategory === category.id 
                        ? 'bg-gradient-primary text-primary-foreground shadow-glow border border-primary/20' 
                        : 'hover:bg-gradient-subtle text-foreground border border-transparent hover:border-border/30 hover:shadow-warm'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                     <button onClick={() => onCategoryChange(category.id)} className="w-full">
                       <div className="flex items-center w-full">
                         <div className={`p-2 rounded-lg mr-3 transition-all duration-200 ${
                           selectedCategory === category.id 
                             ? 'bg-primary-foreground/20' 
                             : 'bg-primary/10 group-hover:bg-primary/20'
                         }`}>
                           <category.icon size={18} className="flex-shrink-0" />
                         </div>
                         {!collapsed && (
                           <>
                             <span className="flex-1 text-right font-medium text-sm">{category.name}</span>
                             <span className={`text-xs px-3 py-1 rounded-full font-semibold transition-all duration-200 ${
                               selectedCategory === category.id 
                                 ? 'bg-primary-foreground/20 text-primary-foreground' 
                                 : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                             }`}>
                               {category.count}
                             </span>
                           </>
                         )}
                       </div>
                     </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Footer with decorative element */}
      {!collapsed && (
        <div className="p-4 mt-auto border-t border-border/30 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="text-center">
            <div className="w-12 h-1 bg-gradient-primary rounded-full mx-auto mb-2"></div>
            <p className="text-xs text-muted-foreground">تصفح بسهولة</p>
          </div>
        </div>
      )}
    </Sidebar>
  );
}