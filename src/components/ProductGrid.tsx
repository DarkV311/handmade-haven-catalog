import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  description: string;
}

interface ProductGridProps {
  products: Product[];
  selectedCategory?: string;
}

export function ProductGrid({ products, selectedCategory }: ProductGridProps) {
  const filteredProducts = selectedCategory && selectedCategory !== 'all' 
    ? products.filter(product => product.category === selectedCategory)
    : products;

  const handleWhatsApp = (product: Product) => {
    const message = `مرحباً، أرغب في الاستفسار عن هذا المنتج:\n\n📦 ${product.name}\n💰 ${product.price}\n\nهل يمكنكم تقديم المزيد من التفاصيل؟`;
    const whatsappUrl = `https://wa.me/201234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="container mx-auto px-6 py-8">
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
              product={product} 
              onWhatsApp={handleWhatsApp}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    'wooden-stamps': 'البصمات الخشب والأكليريك',
    'incense-burners': 'أشكال المباخر', 
    'clock-numbers': 'أشكال أرقام الساعات',
    'quran-decor': 'آيات قرآنية وديكور',
    'stamp-supplies': 'مستلزمات البصمات',
    'handmade-supplies': 'مستلزمات الهاند ميد'
  };
  return categoryNames[category] || category;
}