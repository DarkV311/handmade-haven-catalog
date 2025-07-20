import { useState } from "react";
import { Layout } from "@/components/Layout";
import { HeroBanner } from "@/components/HeroBanner";
import { ProductGrid } from "@/components/ProductGrid";
import { products } from "@/data/products";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <Layout 
      selectedCategory={selectedCategory} 
      onCategoryChange={setSelectedCategory}
    >
      <div className="pb-8">
        <HeroBanner />
        <ProductGrid 
          products={products} 
          selectedCategory={selectedCategory}
        />
      </div>
    </Layout>
  );
};

export default Index;
