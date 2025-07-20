import woodenStamp1 from "@/assets/wooden-stamp-1.jpg";
import incenseBurner1 from "@/assets/incense-burner-1.jpg";
import clockNumbers1 from "@/assets/clock-numbers-1.jpg";

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  description: string;
}

export const products: Product[] = [
  // البصمات الخشب والأكليريك
  {
    id: "ws-1",
    name: "بصمة خشبية بآية الكرسي",
    price: "120 ج.م",
    image: woodenStamp1,
    category: "wooden-stamps",
    description: "بصمة خشبية مصنوعة يدوياً محفور عليها آية الكرسي بخط عربي جميل"
  },
  {
    id: "ws-2", 
    name: "بصمة أكليريك للبسملة",
    price: "95 ج.م",
    image: woodenStamp1,
    category: "wooden-stamps",
    description: "بصمة من الأكليريك عالي الجودة مع تصميم أنيق للبسملة"
  },
  {
    id: "ws-3",
    name: "بصمة خشبية دائرية",
    price: "85 ج.م", 
    image: woodenStamp1,
    category: "wooden-stamps",
    description: "بصمة خشبية دائرية الشكل مع زخارف إسلامية تقليدية"
  },

  // أشكال المباخر
  {
    id: "ib-1",
    name: "مبخرة نحاسية كلاسيكية",
    price: "250 ج.م",
    image: incenseBurner1,
    category: "incense-burners", 
    description: "مبخرة من النحاس الأصلي مصنوعة يدوياً بتصميم تراثي أنيق"
  },
  {
    id: "ib-2",
    name: "مبخرة خشبية مطعمة",
    price: "180 ج.م",
    image: incenseBurner1,
    category: "incense-burners",
    description: "مبخرة خشبية مطعمة بالنحاس مع نقوش عربية تقليدية"
  },

  // أشكال أرقام الساعات
  {
    id: "cn-1",
    name: "أرقام ساعة عربية خشبية",
    price: "75 ج.م",
    image: clockNumbers1,
    category: "clock-numbers",
    description: "مجموعة أرقام ساعة باللغة العربية مصنوعة من الخشب الطبيعي"
  },
  {
    id: "cn-2",
    name: "أرقام ساعة أكليريك ذهبية", 
    price: "90 ج.م",
    image: clockNumbers1,
    category: "clock-numbers",
    description: "أرقام ساعة من الأكليريك بلون ذهبي لامع وتصميم عصري"
  },

  // آيات قرآنية وديكور
  {
    id: "qd-1",
    name: "لوحة آية الكرسي المذهبة",
    price: "200 ج.م",
    image: woodenStamp1,
    category: "quran-decor",
    description: "لوحة فنية لآية الكرسي بخط عربي مذهب على خشب طبيعي"
  },

  // مستلزمات البصمات
  {
    id: "ss-1",
    name: "حبر بصمات أسود",
    price: "25 ج.م",
    image: woodenStamp1,
    category: "stamp-supplies",
    description: "حبر عالي الجودة للبصمات الخشبية والأكليريك"
  },

  // مستلزمات الهاند ميد
  {
    id: "hs-1",
    name: "طقم أدوات النحت",
    price: "150 ج.م",
    image: woodenStamp1,
    category: "handmade-supplies", 
    description: "طقم كامل من أدوات النحت على الخشب للمبتدئين والمحترفين"
  }
];

export const categories = [
  { id: 'wooden-stamps', name: 'البصمات الخشب والأكليريك', icon: 'Stamp', count: 3 },
  { id: 'incense-burners', name: 'أشكال المباخر', icon: 'Flame', count: 2 },
  { id: 'clock-numbers', name: 'أشكال أرقام الساعات', icon: 'Clock', count: 2 },
  { id: 'quran-decor', name: 'آيات قرآنية وديكور', icon: 'BookOpen', count: 1 },
  { id: 'stamp-supplies', name: 'مستلزمات البصمات', icon: 'Package', count: 1 },
  { id: 'handmade-supplies', name: 'مستلزمات الهاند ميد', icon: 'Palette', count: 1 }
];