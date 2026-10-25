/**
 * ============================================================
 *  CATÁLOGO Y CONFIGURACIÓN POR DEFECTO DE LA TIENDA
 * ============================================================
 *  Este archivo es la "fuente de verdad" que se despliega con la web.
 *  Puedes editarlo a mano o, más fácil, usar el panel /admin y luego
 *  "Exportar" el JSON y pegarlo aquí (ver README).
 *
 *  Sube CATALOG_VERSION cada vez que cambies este archivo para que los
 *  navegadores que ya tenían una versión guardada se actualicen.
 */
import type { CatalogData, Category, Product, StoreSettings } from '@/types';

export const CATALOG_VERSION = 1;

const t = new Date('2026-01-01').getTime();

function product(p: Partial<Product> & Pick<Product, 'id' | 'name' | 'price' | 'categoryId' | 'art'>): Product {
  return {
    slug: p.id,
    description: '',
    compareAtPrice: 0,
    images: [],
    options: [],
    specs: [],
    stock: -1,
    sku: p.id.toUpperCase(),
    featured: false,
    active: true,
    badge: '',
    createdAt: t,
    ...p,
  };
}

const RING_SIZES = ['5', '6', '7', '8', '9', '10'].map((s) => ({ label: `Talla ${s}`, priceDelta: 0 }));
const METALS = [
  { label: 'Oro amarillo 18k', priceDelta: 0 },
  { label: 'Oro rosado 18k', priceDelta: 150000 },
  { label: 'Oro blanco 18k', priceDelta: 120000 },
];

/* ------------------------------------------------------------------ */
/*  PLANTILLA 1: JOYERÍA                                              */
/* ------------------------------------------------------------------ */

const jewelrySettings: StoreSettings = {
  brand: {
    name: 'Atelier Vendome',
    tagline: 'Alta joyería · Bogotá',
    logoUrl: '',
    description:
      'Joyas de autor elaboradas a mano con oro 18k, diamantes y esmeraldas colombianas. Diseños únicos y piezas personalizadas.',
  },
  theme: { mode: 'dark', accent: '#c5a880', fontStyle: 'serif' },
  locale: { currency: 'COP', locale: 'es-CO' },
  announcement: { enabled: true, text: 'Envío gratis en compras superiores a $500.000 · Garantía de por vida' },
  nav: [
    { label: 'Tienda', href: '/tienda' },
    { label: 'Anillos', href: '/tienda?cat=anillos' },
    { label: 'Collares', href: '/tienda?cat=collares' },
    { label: 'Contacto', href: '/#contacto' },
  ],
  hero: {
    eyebrow: 'Nueva colección 2026',
    title: 'Joyas que cuentan tu historia',
    subtitle:
      'Piezas de oro 18k y piedras preciosas, creadas por maestros joyeros. Elige una de nuestras creaciones o diseña la tuya en 3D.',
    ctaLabel: 'Ver colección',
    ctaHref: '/tienda',
    secondaryLabel: 'Diseñar mi anillo',
    secondaryHref: '/personalizador',
    imageUrl: '',
    show3D: true,
  },
  sections: {
    categoriesTitle: 'Compra por categoría',
    featuredTitle: 'Piezas destacadas',
    featuredSubtitle: 'Las favoritas de nuestros clientes',
    benefits: [
      { title: 'Certificado de autenticidad', text: 'Cada pieza incluye certificado y estuche de lujo.' },
      { title: 'Envío asegurado', text: 'Despacho a todo el país con seguro incluido.' },
      { title: 'Garantía de por vida', text: 'Mantenimiento y limpieza gratuita de tus joyas.' },
      { title: 'Hecho a medida', text: 'Personaliza metal, piedra y grabado a tu gusto.' },
    ],
    newsletterTitle: 'Únete al círculo',
    newsletterText: 'Recibe lanzamientos y ofertas exclusivas en tu correo.',
  },
  contact: {
    email: 'hola@atelier-vendome.com',
    phone: '+57 300 000 0000',
    whatsapp: '573000000000',
    address: 'Bogotá, Colombia',
    instagram: '',
    facebook: '',
    tiktok: '',
  },
  shipping: { flatRate: 18000, freeFrom: 500000, note: 'Entrega en 2 a 5 días hábiles.' },
  payments: { wompi: true, whatsappOrders: true, orderPrefix: 'AV' },
  customizer: {
    enabled: true,
    navLabel: 'Diseña tu anillo 3D',
    title: 'Solitario personalizado',
    subtitle: 'Taller de alta joyería',
    basePrice: 3200000,
    minCarats: 0.5,
    maxCarats: 3,
    engraving: true,
    metals: [
      { id: 'oro-amarillo', name: 'Oro amarillo 18k', color: '#ffd24a', priceDelta: 0 },
      { id: 'oro-rosado', name: 'Oro rosado 18k', color: '#e8a598', priceDelta: 150000 },
      { id: 'platino', name: 'Platino 950', color: '#e5e8ec', priceDelta: 650000 },
      { id: 'bronce', name: 'Bronce oscuro', color: '#6b5236', priceDelta: -100000 },
    ],
    gems: [
      { id: 'diamante', name: 'Diamante D-Flawless', color: '#f4fbff', pricePerCt: 8500000 },
      { id: 'esmeralda', name: 'Esmeralda de Muzo', color: '#12c45a', pricePerCt: 6200000 },
      { id: 'zafiro', name: 'Zafiro azul', color: '#2468d6', pricePerCt: 5100000 },
      { id: 'rubi', name: 'Rubí sangre de paloma', color: '#e0112b', pricePerCt: 7800000 },
      { id: 'onix', name: 'Ónix negro', color: '#1a1a1f', pricePerCt: 1800000 },
    ],
  },
};

const jewelryCategories: Category[] = [
  { id: 'anillos', slug: 'anillos', name: 'Anillos', description: 'Solitarios, alianzas y anillos de autor', image: '', art: { kind: 'ring', color: '#d9b36c' } },
  { id: 'collares', slug: 'collares', name: 'Collares', description: 'Cadenas y dijes en oro y plata', image: '', art: { kind: 'necklace', color: '#e6c78f' } },
  { id: 'aretes', slug: 'aretes', name: 'Aretes', description: 'Topos, argollas y pendientes', image: '', art: { kind: 'earrings', color: '#cfa9c7' } },
  { id: 'pulseras', slug: 'pulseras', name: 'Pulseras', description: 'Esclavas, tennis y brazaletes', image: '', art: { kind: 'bracelet', color: '#9fc3d6' } },
];

const jewelryProducts: Product[] = [
  product({
    id: 'solitario-aurora', name: 'Solitario Aurora', price: 4850000, compareAtPrice: 5400000, categoryId: 'anillos',
    art: { kind: 'ring', color: '#e8c97a' }, featured: true, badge: 'Más vendido', stock: 6,
    description: 'Clásico solitario con diamante central de 0.5 ct engastado en garras sobre una banda de oro 18k pulida a espejo.',
    options: [{ name: 'Talla', values: RING_SIZES }, { name: 'Metal', values: METALS }],
    specs: [{ label: 'Piedra', value: 'Diamante 0.5 ct' }, { label: 'Pureza', value: 'VS1 · Color F' }, { label: 'Metal', value: 'Oro 18k' }],
  }),
  product({
    id: 'alianza-eterna', name: 'Alianza Eterna', price: 1890000, categoryId: 'anillos',
    art: { kind: 'ring', color: '#d9a45a' }, featured: true, stock: 12,
    description: 'Alianza de matrimonio de perfil cómodo, acabado satinado y grabado interior opcional.',
    options: [{ name: 'Talla', values: RING_SIZES }, { name: 'Metal', values: METALS }],
    specs: [{ label: 'Ancho', value: '4 mm' }, { label: 'Metal', value: 'Oro 18k' }],
  }),
  product({
    id: 'anillo-esmeralda-muzo', name: 'Anillo Esmeralda de Muzo', price: 6900000, categoryId: 'anillos',
    art: { kind: 'ring', color: '#3fbf7f' }, featured: true, badge: 'Edición limitada', stock: 3,
    description: 'Esmeralda colombiana de Muzo rodeada de un halo de diamantes. Pieza numerada.',
    options: [{ name: 'Talla', values: RING_SIZES }],
    specs: [{ label: 'Piedra', value: 'Esmeralda 1.2 ct' }, { label: 'Origen', value: 'Muzo, Colombia' }],
  }),
  product({
    id: 'collar-luna', name: 'Collar Luna', price: 980000, compareAtPrice: 1150000, categoryId: 'collares',
    art: { kind: 'necklace', color: '#e6c78f' }, featured: true, stock: 20,
    description: 'Cadena fina con dije de media luna y circonia. Ideal para uso diario.',
    options: [{ name: 'Largo', values: [{ label: '40 cm', priceDelta: 0 }, { label: '45 cm', priceDelta: 30000 }, { label: '50 cm', priceDelta: 60000 }] }],
    specs: [{ label: 'Metal', value: 'Oro 18k' }, { label: 'Cierre', value: 'Mosquetón' }],
  }),
  product({
    id: 'gargantilla-perla', name: 'Gargantilla de Perlas', price: 1450000, categoryId: 'collares',
    art: { kind: 'necklace', color: '#f1e8da' }, stock: 8,
    description: 'Perlas cultivadas de agua dulce con cierre de oro. Elegancia atemporal.',
    specs: [{ label: 'Perlas', value: '7-8 mm' }, { label: 'Largo', value: '42 cm' }],
  }),
  product({
    id: 'dije-corazon', name: 'Dije Corazón de Diamante', price: 2300000, categoryId: 'collares',
    art: { kind: 'necklace', color: '#e9b4b4' }, badge: 'Nuevo', stock: 10,
    description: 'Corazón de oro rosado con diamante de 0.1 ct. El regalo perfecto.',
    specs: [{ label: 'Piedra', value: 'Diamante 0.1 ct' }],
  }),
  product({
    id: 'topos-brillante', name: 'Topos Brillante', price: 1250000, categoryId: 'aretes',
    art: { kind: 'earrings', color: '#cfd8e6' }, featured: true, stock: 15,
    description: 'Topos con diamantes de 0.15 ct c/u, engaste de cuatro garras.',
    options: [{ name: 'Metal', values: METALS }],
    specs: [{ label: 'Total', value: '0.30 ct' }],
  }),
  product({
    id: 'argollas-clasicas', name: 'Argollas Clásicas', price: 860000, categoryId: 'aretes',
    art: { kind: 'earrings', color: '#e3bb78' }, stock: 25,
    description: 'Argollas medianas de oro 18k, ligeras y brillantes.',
    options: [{ name: 'Diámetro', values: [{ label: '15 mm', priceDelta: 0 }, { label: '20 mm', priceDelta: 120000 }, { label: '25 mm', priceDelta: 240000 }] }],
  }),
  product({
    id: 'pendientes-zafiro', name: 'Pendientes de Zafiro', price: 3200000, categoryId: 'aretes',
    art: { kind: 'earrings', color: '#4a74d9' }, stock: 4,
    description: 'Zafiros azules en talla gota con detalle de diamantes.',
    specs: [{ label: 'Piedra', value: 'Zafiro 2 x 0.8 ct' }],
  }),
  product({
    id: 'pulsera-tennis', name: 'Pulsera Tennis', price: 5600000, compareAtPrice: 6200000, categoryId: 'pulseras',
    art: { kind: 'bracelet', color: '#dcdfe6' }, featured: true, badge: 'Premium', stock: 5,
    description: 'Línea continua de diamantes en oro blanco 18k con cierre de seguridad.',
    options: [{ name: 'Largo', values: [{ label: '16 cm', priceDelta: 0 }, { label: '17 cm', priceDelta: 0 }, { label: '18 cm', priceDelta: 150000 }] }],
    specs: [{ label: 'Diamantes', value: '2.0 ct total' }],
  }),
  product({
    id: 'esclava-oro', name: 'Esclava de Oro', price: 1350000, categoryId: 'pulseras',
    art: { kind: 'bracelet', color: '#e8c97a' }, stock: 14,
    description: 'Esclava rígida con placa para grabar nombre o fecha especial.',
    options: [{ name: 'Metal', values: METALS }],
  }),
  product({
    id: 'brazalete-trenzado', name: 'Brazalete Trenzado', price: 780000, categoryId: 'pulseras',
    art: { kind: 'bracelet', color: '#c9a28c' }, stock: 18,
    description: 'Brazalete flexible de plata 925 bañada en oro rosa.',
  }),
];

/* ------------------------------------------------------------------ */
/*  PLANTILLA 2: TIENDA GENERAL (ropa, accesorios, belleza, etc.)      */
/* ------------------------------------------------------------------ */

const generalSettings: StoreSettings = {
  ...jewelrySettings,
  brand: { name: 'Mi Tienda', tagline: 'Productos seleccionados', logoUrl: '', description: 'Tu tienda online. Edita todos los textos desde el panel de administración.' },
  theme: { mode: 'light', accent: '#1f6feb', fontStyle: 'sans' },
  announcement: { enabled: true, text: 'Envíos a todo el país · Pago seguro' },
  nav: [
    { label: 'Tienda', href: '/tienda' },
    { label: 'Contacto', href: '/#contacto' },
  ],
  hero: {
    ...jewelrySettings.hero,
    eyebrow: 'Bienvenido', title: 'Todo lo que buscas en un solo lugar',
    subtitle: 'Descubre nuestros productos y compra de forma fácil y segura.',
    ctaLabel: 'Comprar ahora', secondaryLabel: '', show3D: false,
  },
  sections: {
    ...jewelrySettings.sections,
    featuredSubtitle: 'Lo más vendido de la semana',
    benefits: [
      { title: 'Envío rápido', text: 'Recibe tu pedido en pocos días.' },
      { title: 'Pago seguro', text: 'Tarjetas, PSE, Nequi y más.' },
      { title: 'Devoluciones fáciles', text: '30 días para cambiar de opinión.' },
      { title: 'Soporte', text: 'Te atendemos por WhatsApp.' },
    ],
    newsletterTitle: 'Suscríbete', newsletterText: 'Recibe ofertas y novedades.',
  },
  shipping: { flatRate: 12000, freeFrom: 150000, note: 'Entrega en 2 a 5 días hábiles.' },
  payments: { wompi: true, whatsappOrders: true, orderPrefix: 'TD' },
  customizer: { ...jewelrySettings.customizer, enabled: false },
};

const generalCategories: Category[] = [
  { id: 'novedades', slug: 'novedades', name: 'Novedades', description: 'Lo último en llegar', image: '', art: { kind: 'box', color: '#6aa7ff' } },
  { id: 'ofertas', slug: 'ofertas', name: 'Ofertas', description: 'Precios especiales', image: '', art: { kind: 'box', color: '#ff9f6a' } },
];

const generalProducts: Product[] = [1, 2, 3, 4, 5, 6].map((n) =>
  product({
    id: `producto-${n}`, name: `Producto de ejemplo ${n}`, price: 40000 + n * 15000,
    categoryId: n % 2 ? 'novedades' : 'ofertas', art: { kind: 'box', color: n % 2 ? '#6aa7ff' : '#ff9f6a' },
    featured: n <= 4, stock: 30, description: 'Descripción del producto. Edítala desde el panel de administración.',
    options: [{ name: 'Talla', values: ['S', 'M', 'L'].map((l) => ({ label: l, priceDelta: 0 })) }],
  }),
);

export const TEMPLATES: Record<string, { label: string; data: CatalogData }> = {
  joyeria: { label: 'Joyería (demo completa)', data: { settings: jewelrySettings, categories: jewelryCategories, products: jewelryProducts } },
  general: { label: 'Tienda general (ropa, accesorios, belleza…)', data: { settings: generalSettings, categories: generalCategories, products: generalProducts } },
};

export const DEFAULT_CATALOG: CatalogData = TEMPLATES.joyeria.data;

