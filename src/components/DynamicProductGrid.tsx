import { ProductCard } from "./ProductCard";
import { useProducts, useCategories } from "@/hooks/useSupabaseData";

interface DynamicProductGridProps {
  selectedCategory?: string;
}

export function DynamicProductGrid({ selectedCategory }: DynamicProductGridProps) {
  const { products, loading: productsLoading } = useProducts();
  const { categories } = useCategories();

  if (productsLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-16">
          <p className="text-muted-foreground text-xl">جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  // Filter products based on selected category
  const filteredProducts = selectedCategory && selectedCategory !== 'all' 
    ? products.filter(product => {
        const category = categories.find(cat => cat.slug === selectedCategory);
        return category && product.category_id === category.id;
      })
    : products;

  // Get category name for display
  const getCategoryName = (categorySlug: string): string => {
    if (categorySlug === 'all') return 'جميع المنتجات';
    const category = categories.find(cat => cat.slug === categorySlug);
    return category ? category.name : categorySlug;
  };

  return (
    <div id="products" className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {selectedCategory && selectedCategory !== 'all' 
            ? `منتجات ${getCategoryName(selectedCategory)}`
            : 'جميع المنتجات'
          }
        </h2>
        <div className="w-24 h-1 bg-gradient-primary rounded-full"></div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-xl">لا توجد منتجات في هذا القسم حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={{
                id: product.id,
                name: product.name,
                price: `${product.price} ${product.price_currency}`,
                image: product.image_url,
                category: product.category_id,
                description: product.description
              }} 
              onWhatsApp={() => {}} // Not used anymore since WhatsApp is handled in ProductCard
            />
          ))}
        </div>
      )}
    </div>
  );
}