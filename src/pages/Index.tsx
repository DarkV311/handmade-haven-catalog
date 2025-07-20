import { useState } from "react";
import { Layout } from "@/components/Layout";
import { HeroBanner } from "@/components/HeroBanner";
import { DynamicProductGrid } from "@/components/DynamicProductGrid";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <Layout 
      selectedCategory={selectedCategory} 
      onCategoryChange={setSelectedCategory}
    >
      <div className="pb-8">
        <HeroBanner />
        <DynamicProductGrid selectedCategory={selectedCategory} />
      </div>
    </Layout>
  );
};

export default Index;
