/**
 * Tipos del e-commerce. Todo el contenido (marca, productos, tema, etc.)
 * es configurable desde /admin o editando src/data/catalog.ts.
 */

export type ArtKind = 'ring' | 'necklace' | 'earrings' | 'bracelet' | 'watch' | 'box';

export type JewelryTypeKey = 'ring' | 'necklace' | 'earrings' | 'bracelet' | 'ai-relief' | 'glb-custom';

export type SettingStyleKey =
  | 'solitaire'
  | 'halo'
  | 'three-stone'
  | 'bezel'
  | 'cathedral'
  | 'vintage'
  | 'toi-et-moi'
  | 'cluster'
  | 'tension'
  | 'signet'
  | 'bypass'
  | 'tiara';

export type CutShapeKey =
  | 'round'
  | 'emerald'
  | 'oval'
  | 'princess'
  | 'pear'
  | 'marquise'
  | 'cushion'
  | 'heart'
  | 'asscher'
  | 'baguette';

export type BandStyleKey =
  | 'plain'
  | 'pave'
  | 'twisted'
  | 'split'
  | 'knife'
  | 'beaded'
  | 'channel'
  | 'chevron';

/** Opción seleccionable de un producto (ej: Talla, Material, Color). */
export interface ProductOption {
  name: string;
  values: { label: string; priceDelta: number }[];
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  /** Precio anterior (tachado) para mostrar descuentos. 0 = sin descuento */
  compareAtPrice: number;
  categoryId: string;
  /** URLs de imagen o data-URLs. Si está vacío se usa la ilustración (art) */
  images: string[];
  art: { kind: ArtKind; color: string };
  options: ProductOption[];
  specs: ProductSpec[];
  /** Stock disponible. -1 = ilimitado */
  stock: number;
  sku: string;
  featured: boolean;
  active: boolean;
  badge: string;
  createdAt: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  art: { kind: ArtKind; color: string };
}

export interface CustomizerSettingStyle {
  id: SettingStyleKey;
  name: string;
  subtitle: string;
  priceDelta: number;
}
export interface CustomizerCutShape {
  id: CutShapeKey;
  name: string;
  subtitle: string;
  priceDelta: number;
}
export interface CustomizerBandStyle {
  id: BandStyleKey;
  name: string;
  subtitle: string;
  priceDelta: number;
}
export interface CustomizerMetal {
  id: string;
  name: string;
  color: string;
  priceDelta: number;
}
export interface CustomizerGem {
  id: string;
  name: string;
  color: string;
  pricePerCt: number;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface StoreSettings {
  brand: {
    name: string;
    tagline: string;
    logoUrl: string;
    description: string;
  };
  theme: {
    mode: 'dark' | 'light';
    accent: string;
    fontStyle: 'serif' | 'sans';
  };
  locale: {
    currency: string;
    locale: string;
  };
  announcement: { enabled: boolean; text: string };
  nav: NavLink[];
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    secondaryLabel: string;
    secondaryHref: string;
    imageUrl: string;
    show3D: boolean;
  };
  sections: {
    categoriesTitle: string;
    featuredTitle: string;
    featuredSubtitle: string;
    benefits: { title: string; text: string }[];
    newsletterTitle: string;
    newsletterText: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  shipping: {
    flatRate: number;
    freeFrom: number;
    note: string;
  };
  payments: {
    wompi: boolean;
    whatsappOrders: boolean;
    orderPrefix: string;
  };
  customizer: {
    enabled: boolean;
    navLabel: string;
    title: string;
    subtitle: string;
    basePrice: number;
    minCarats: number;
    maxCarats: number;
    engraving: boolean;
    meshyApiKey?: string;
    settings?: CustomizerSettingStyle[];
    cuts?: CustomizerCutShape[];
    bands?: CustomizerBandStyle[];
    metals: CustomizerMetal[];
    gems: CustomizerGem[];
  };
}

export interface CatalogData {
  settings: StoreSettings;
  categories: Category[];
  products: Product[];
}

/* ---------- Carrito y pedidos ---------- */

export interface BespokeConfig {
  jewelryType?: string;
  settingStyle?: string;
  cutShape?: string;
  bandStyle?: string;
  metal: string;
  gemstone: string;
  sideGemstone?: string;
  carats: number;
  ringSize: number;
  finish?: string;
  engravingText?: string;
  customReferenceImage?: string;
}

export interface CartItem {
  /** Clave única: productId + opciones elegidas */
  id: string;
  productId: string;
  title: string;
  variantLabel: string;
  price: number;
  quantity: number;
  image: string;
  art: { kind: ArtKind; color: string };
  isBespoke: boolean;
  bespokeConfig?: BespokeConfig;
}

export interface OrderRecord {
  id: string;
  reference: string;
  createdAt: number;
  customer: { name: string; email: string; phone: string; address: string; city: string; notes: string };
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  method: 'wompi' | 'whatsapp';
  status: 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado';
}
