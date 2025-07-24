import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings, useHeroImages } from "@/hooks/useSupabaseData";
import heroBanner from "@/assets/hero-banner.jpg";

const defaultBannerImages = [
  {
    id: 1,
    src: heroBanner,
    title: "أجمل التصاميم اليدوية",
    subtitle: "اكتشف مجموعتنا المميزة من المنتجات المصنوعة يدوياً بعناية فائقة"
  },
  {
    id: 2,
    src: heroBanner,
    title: "بصمات خشبية فاخرة",
    subtitle: "تصاميم عربية أصيلة لإضافة لمسة جمالية مميزة"
  },
  {
    id: 3,
    src: heroBanner,
    title: "مباخر تراثية أنيقة",
    subtitle: "روائح عطرة وتصاميم كلاسيكية تجمع بين الأصالة والحداثة"
  }
];

export function HeroBanner() {
  const { settingsMap } = useSettings();
  const { heroImages } = useHeroImages();
  const [currentSlide, setCurrentSlide] = useState(0);

  // استخدام الصور المخصصة من قاعدة البيانات أو الصور الافتراضية
  const bannerImages = heroImages.length > 0 
    ? heroImages.map(img => ({
        id: img.id,
        src: img.image_url,
        title: img.title,
        subtitle: settingsMap.hero_subtitle || "اكتشف مجموعتنا المميزة"
      }))
    : defaultBannerImages;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl mx-6 mt-6 shadow-warm">
      {/* Background Images */}
      {bannerImages.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.src}
            alt={image.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white z-10">
        <div className="max-w-4xl px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            {settingsMap.hero_title || bannerImages[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in">
            {settingsMap.hero_subtitle || bannerImages[currentSlide].subtitle}
          </p>
          <Button 
            variant="warm"
            size="lg" 
            className="px-8 py-3 text-lg font-semibold"
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {settingsMap.hero_button_text || 'تصفح المنتجات'}
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30 z-20"
        onClick={prevSlide}
      >
        <ChevronLeft size={20} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30 z-20"
        onClick={nextSlide}
      >
        <ChevronRight size={20} />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            className={`w-4 h-4 rounded-full transition-all duration-300 hover:scale-110 ${
              index === currentSlide 
                ? 'bg-white shadow-glow scale-110 ring-2 ring-white/50' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}