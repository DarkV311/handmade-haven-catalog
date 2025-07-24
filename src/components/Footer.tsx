import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { useSettings } from "@/hooks/useSupabaseData";

export function Footer() {
  const { settingsMap } = useSettings();

  const socialLinks = [
    {
      name: "فيسبوك",
      icon: Facebook,
      url: settingsMap.facebook_url || "#",
      color: "hover:text-blue-500"
    },
    {
      name: "إنستغرام", 
      icon: Instagram,
      url: settingsMap.instagram_url || "#",
      color: "hover:text-pink-500"
    },
    {
      name: "تيك توك",
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.909 2.909 2.896 2.896 0 0 1-2.909-2.909 2.896 2.896 0 0 1 2.909-2.909c.301 0 .591.041.855.119V9.44a6.336 6.336 0 0 0-.855-.059A6.364 6.364 0 0 0 3.1 15.745a6.364 6.364 0 0 0 6.364 6.364 6.364 6.364 0 0 0 6.364-6.364V7.939a7.822 7.822 0 0 0 4.6 1.487V6.055a4.797 4.797 0 0 1-.839-.369Z"/>
        </svg>
      ),
      url: settingsMap.tiktok_url || "#",
      color: "hover:text-black dark:hover:text-white"
    },
    {
      name: "تليجرام",
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm5.568 8.16l-1.61 7.515c-.12.537-.437.667-.887.416l-2.456-1.815-1.185 1.14c-.131.131-.243.243-.5.243l.178-2.52L15.736 9.8c.187-.166-.04-.258-.291-.092l-3.734 2.35-1.607-.503c-.35-.109-.356-.35.072-.517l6.267-2.41c.291-.109.547.069.453.492z"/>
        </svg>
      ),
      url: settingsMap.telegram_url || "#",
      color: "hover:text-blue-400"
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-muted/50 to-background border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* معلومات الموقع */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {settingsMap.site_title || 'كتالوج المنتجات اليدوية'}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {settingsMap.site_description || 'اكتشف أجمل التصاميم والمنتجات المصنوعة يدوياً بعناية فائقة وجودة عالية'}
            </p>
          </div>

          {/* معلومات التواصل */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">معلومات التواصل</h4>
            <div className="space-y-3">
              {settingsMap.contact_phone && (
                <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                  <a href={`tel:${settingsMap.contact_phone}`} className="hover:underline">
                    {settingsMap.contact_phone}
                  </a>
                </div>
              )}
              
              {settingsMap.contact_email && (
                <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                  <a href={`mailto:${settingsMap.contact_email}`} className="hover:underline">
                    {settingsMap.contact_email}
                  </a>
                </div>
              )}
              
              {settingsMap.contact_address && (
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{settingsMap.contact_address}</span>
                </div>
              )}
            </div>
          </div>

          {/* روابط التواصل الاجتماعي */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">تابعنا على</h4>
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const IconComponent = link.icon;
                return link.url && link.url !== "#" ? (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full bg-muted ${link.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                    aria-label={link.name}
                  >
                    <IconComponent />
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} {settingsMap.site_title || 'كتالوج المنتجات اليدوية'} - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}