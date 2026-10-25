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

export const CATALOG_VERSION = 5;

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
    name: 'MIRA',
    tagline: 'Maison de Haute Joaillerie · Bogotá',
    logoUrl: '',
    description:
      'Joyas arquitectónicas creadas a mano en oro 18k reciclado, diamantes certificados GIA y esmeraldas colombianas de origen ético. Siluetas atemporales concebidas para trascender generaciones.',
  },
  theme: { mode: 'dark', accent: '#c5a880', fontStyle: 'serif' },
  locale: { currency: 'COP', locale: 'es-CO' },
  announcement: { enabled: true, text: 'Envío blindado de cortesía desde $500.000 · Certificado GIA y Garantía vitalicia del Atelier' },
  nav: [
    { label: 'Colecciones', href: '/tienda' },
    { label: 'Anillos', href: '/tienda?cat=anillos' },
    { label: 'Collares', href: '/tienda?cat=collares' },
    { label: 'Aretes', href: '/tienda?cat=aretes' },
  ],
  hero: {
    eyebrow: 'Haute Joaillerie Contemporaine · Edición 2026',
    title: 'Esculpida en luz eterna.',
    subtitle:
      'Cada pieza nace del diálogo entre la geometría pura del oro de 18 quilates y la refracción viva de piedras preciosas talladas a mano. Descubre nuestras colecciones, esculpe anillos, collares, aretes o pulseras, o convierte cualquier boceto 2D en una joya 3D.',
    ctaLabel: 'Explorar archivo',
    ctaHref: '/tienda',
    secondaryLabel: 'Atelier 3D + IA Studio',
    secondaryHref: '/personalizador',
    imageUrl: '',
    show3D: true,
  },
  sections: {
    categoriesTitle: 'Colecciones',
    featuredTitle: 'Archivo de Piezas',
    featuredSubtitle: 'Curaduría permanente del atelier',
    benefits: [
      { title: 'Certificación GIA & IGI', text: 'Trazabilidad completa de origen y certificado gemológico numerado.' },
      { title: 'Transporte Blindado', text: 'Envío asegurado puerta a puerta sin costo en órdenes superiores a $500.000.' },
      { title: 'Mantenimiento Vitalicio', text: 'Baño de rodio, limpieza ultrasónica y revisión de engastes de por vida.' },
      { title: 'Atelier 3D + IA 2D→3D', text: '12 siluetas, 10 tallas de gema, 8 aros, collares, aretes, brazaletes y escultura 3D desde imagen.' },
    ],
    newsletterTitle: 'Círculo Privado',
    newsletterText: 'Recibe acceso anticipado a piezas únicas, ventas de archivo e invitaciones al salón privado.',
  },
  contact: {
    email: 'concierge@mirajewels.co',
    phone: '+57 300 000 0000',
    whatsapp: '573000000000',
    address: 'Calle 81 # 11–08 · Zona T, Bogotá',
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    tiktok: '',
  },
  shipping: { flatRate: 18000, freeFrom: 500000, note: 'Despacho asegurado con entrega en 2 a 5 días hábiles.' },
  payments: { wompi: true, whatsappOrders: true, orderPrefix: 'MIRA' },
  customizer: {
    enabled: true,
    navLabel: 'Atelier 3D + IA',
    title: 'Atelier Bespoke & IA 360°',
    subtitle: 'Forja paramétrica & generador 2D → 3D',
    basePrice: 3200000,
    minCarats: 0.4,
    maxCarats: 4.5,
    engraving: true,
    meshyApiKey: '',
    settings: [
      { id: 'solitaire', name: 'Solitario Imperial', subtitle: '6 garras clásicas de alta precisión', priceDelta: 0 },
      { id: 'halo', name: 'Halo Céleste', subtitle: 'Corona pavé de 16 diamantes alrededor', priceDelta: 1450000 },
      { id: 'three-stone', name: 'Trilogía Pasado·Presente·Futuro', subtitle: 'Gema central escoltada por 2 gemas laterales', priceDelta: 1850000 },
      { id: 'toi-et-moi', name: 'Toi et Moi (Tú y Yo)', subtitle: 'Dúo asimétrico de dos gemas encontradas', priceDelta: 2150000 },
      { id: 'cathedral', name: 'Catedral Vendôme', subtitle: 'Arcos elevados con galería arquitectónica', priceDelta: 680000 },
      { id: 'bezel', name: 'Bisel Modernista', subtitle: 'Engaste continuo de oro que abraza la gema', priceDelta: 490000 },
      { id: 'vintage', name: 'Roseta Art Déco', subtitle: 'Marco octogonal con milgrain 1925', priceDelta: 1950000 },
      { id: 'cluster', name: 'Cluster Floral Marquise', subtitle: 'Roseta botánica de 8 pétalos de diamante', priceDelta: 1780000 },
      { id: 'tension', name: 'Suspensión Aérea (Tension)', subtitle: 'Aro abierto con gema suspendida en el aire', priceDelta: 890000 },
      { id: 'signet', name: 'Sello Real (Signet Chevalière)', subtitle: 'Meseta maciza señorial con gema empotrada', priceDelta: 1120000 },
      { id: 'bypass', name: 'Bypass Serpenti', subtitle: 'Brazos fluidos envolventes en espiral', priceDelta: 940000 },
      { id: 'tiara', name: 'Tiara Couronne Impériale', subtitle: 'Diadema de 7 gemas en arco real', priceDelta: 1650000 },
    ],
    cuts: [
      { id: 'round', name: 'Brillante Redondo', subtitle: '57 facetas de máximo fuego óptico', priceDelta: 0 },
      { id: 'emerald', name: 'Talla Esmeralda', subtitle: 'Mesa rectangular escalonada de espejo', priceDelta: 350000 },
      { id: 'oval', name: 'Óvalo Lumière', subtitle: 'Silueta elongada que estiliza la mano', priceDelta: 280000 },
      { id: 'princess', name: 'Princesa Cuadrada', subtitle: 'Geometría piramidal contemporánea', priceDelta: 220000 },
      { id: 'pear', name: 'Gota Imperial (Pera)', subtitle: 'Lágrima asimétrica de alta costura', priceDelta: 420000 },
      { id: 'marquise', name: 'Marquesa Real', subtitle: 'Navette afilada de inspiración cortesana', priceDelta: 480000 },
      { id: 'cushion', name: 'Cojín Antiguo (Cushion)', subtitle: 'Cuadrado de esquinas suaves románticas', priceDelta: 310000 },
      { id: 'heart', name: 'Corazón Haute Couture', subtitle: 'Talla simbólica de simetría compleja', priceDelta: 560000 },
      { id: 'asscher', name: 'Asscher Octogonal', subtitle: 'Pabellón profundo de espejos concéntricos', priceDelta: 390000 },
      { id: 'baguette', name: 'Baguette Arquitectónico', subtitle: 'Prisma alargado de líneas puras Art Déco', priceDelta: 260000 },
    ],
    bands: [
      { id: 'plain', name: 'Media Caña Confort', subtitle: 'Banda maciza pulida a espejo', priceDelta: 0 },
      { id: 'pave', name: 'Pavé Éternité', subtitle: '24 diamantes micro-engastados en el aro', priceDelta: 1350000 },
      { id: 'twisted', name: 'Torsade Infinito', subtitle: 'Doble hebra de oro entrelazada', priceDelta: 720000 },
      { id: 'split', name: 'Doble Brazo (Split Shank)', subtitle: 'Banda bifurcada hacia la corona', priceDelta: 840000 },
      { id: 'knife', name: 'Filo de Cuchillo (Knife-Edge)', subtitle: 'Arista central arquitectónica de alto brillo', priceDelta: 320000 },
      { id: 'beaded', name: 'Perlé Alhambra', subtitle: 'Esferas de oro macizo esculpidas una a una', priceDelta: 960000 },
      { id: 'channel', name: 'Carré Channel Set', subtitle: 'Rieles paralelos con baguettes empotrados', priceDelta: 1420000 },
      { id: 'chevron', name: 'Chevron V-Crown', subtitle: 'Silueta en V pensada para anidar alianzas', priceDelta: 540000 },
    ],
    metals: [
      { id: 'oro-amarillo', name: 'Oro Amarillo 18k', color: '#ffd24a', priceDelta: 0 },
      { id: 'oro-rosado', name: 'Oro Rosado Imperial 18k', color: '#e8a598', priceDelta: 180000 },
      { id: 'platino', name: 'Platino Puro 950', color: '#e5e8ec', priceDelta: 750000 },
      { id: 'oro-champagne', name: 'Oro Champagne 18k', color: '#dec49a', priceDelta: 240000 },
      { id: 'oro-blanco', name: 'Oro Blanco Paladio 18k', color: '#d8dde6', priceDelta: 290000 },
      { id: 'plata-925', name: 'Plata de Ley 925 Baño Rodio', color: '#eef2f7', priceDelta: -1400000 },
      { id: 'bronce', name: 'Oro Negro Rodizado', color: '#3b3734', priceDelta: 290000 },
      { id: 'titanio', name: 'Titanio Grado Aeroespacial', color: '#7b828c', priceDelta: -600000 },
    ],
    gems: [
      { id: 'diamante', name: 'Diamante D-Flawless', color: '#f4fbff', pricePerCt: 8500000 },
      { id: 'esmeralda', name: 'Esmeralda de Muzo', color: '#0eb854', pricePerCt: 6800000 },
      { id: 'zafiro', name: 'Zafiro Real de Ceilán', color: '#1e5fd9', pricePerCt: 5400000 },
      { id: 'rubi', name: 'Rubí Sangre de Paloma', color: '#d9112b', pricePerCt: 7800000 },
      { id: 'morganita', name: 'Diamante Rosa Argyle', color: '#f4a9bc', pricePerCt: 7200000 },
      { id: 'canary', name: 'Diamante Fancy Intense Yellow', color: '#ffcf40', pricePerCt: 6900000 },
      { id: 'aguamarina', name: 'Paraíba Turmalina', color: '#39e5d8', pricePerCt: 6400000 },
      { id: 'amatista', name: 'Tanzanita Imperial Violeta', color: '#7a49e8', pricePerCt: 4300000 },
      { id: 'citambi', name: 'Zafiro Padparadscha Salmón', color: '#ff7d5e', pricePerCt: 5900000 },
      { id: 'onix', name: 'Diamante Negro Orlov', color: '#18181d', pricePerCt: 3400000 },
    ],
  },
};

const jewelryCategories: Category[] = [
  {
    id: 'anillos',
    slug: 'anillos',
    name: 'Anillos',
    description: 'Solitarios arquitectónicos, alianzas pavé y anillos de compromiso',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
    art: { kind: 'ring', color: '#d9b36c' },
  },
  {
    id: 'collares',
    slug: 'collares',
    name: 'Collares',
    description: 'Cadenas esculturales y pendentifs en oro macizo 18k',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
    art: { kind: 'necklace', color: '#e6c78f' },
  },
  {
    id: 'aretes',
    slug: 'aretes',
    name: 'Aretes',
    description: 'Dormilonas de diamante, argollas orgánicas y pendientes de gala',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
    art: { kind: 'earrings', color: '#cfa9c7' },
  },
  {
    id: 'pulseras',
    slug: 'pulseras',
    name: 'Pulseras',
    description: 'Rivières continuas de diamantes, manchettes y eslabones',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1000&q=85',
    art: { kind: 'bracelet', color: '#9fc3d6' },
  },
];

const jewelryProducts: Product[] = [
  product({
    id: 'solitario-aurora',
    name: 'Solitario Aurora No. I',
    price: 4850000,
    compareAtPrice: 5400000,
    categoryId: 'anillos',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
    ],
    art: { kind: 'ring', color: '#e8c97a' },
    featured: true,
    badge: 'Ícono de la Maison',
    stock: 6,
    description: 'Clásico solitario con diamante central de talla brillante de 0.5 ct engastado en seis garras sobre una banda de oro 18k pulida a espejo.',
    options: [{ name: 'Talla', values: RING_SIZES }, { name: 'Metal', values: METALS }],
    specs: [{ label: 'Piedra', value: 'Diamante natural 0.50 ct' }, { label: 'Pureza', value: 'VS1 · Color F' }, { label: 'Metal', value: 'Oro macizo 18k' }],
  }),
  product({
    id: 'alianza-eterna',
    name: 'Alianza Pavé Éternité',
    price: 2890000,
    categoryId: 'anillos',
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
    ],
    art: { kind: 'ring', color: '#d9a45a' },
    featured: true,
    stock: 12,
    description: 'Alianza con pavé continuo de diamantes sobre perfil interior anatómico y grabado láser interior sin costo.',
    options: [{ name: 'Talla', values: RING_SIZES }, { name: 'Metal', values: METALS }],
    specs: [{ label: 'Ancho', value: '3.2 mm' }, { label: 'Diamantes', value: '24 × 0.02 ct' }, { label: 'Metal', value: 'Oro 18k' }],
  }),
  product({
    id: 'anillo-esmeralda-muzo',
    name: 'Trilogía Esmeralda de Muzo',
    price: 6900000,
    categoryId: 'anillos',
    images: [
      'https://images.unsplash.com/photo-1589674781759-c21c37956a44?auto=format&fit=crop&w=1000&q=85',
    ],
    art: { kind: 'ring', color: '#3fbf7f' },
    featured: true,
    badge: 'Pieza numerada',
    stock: 3,
    description: 'Esmeralda colombiana de Muzo en talla esmeralda custodiada por dos diamantes baguette laterales. Pieza única numerada.',
    options: [{ name: 'Talla', values: RING_SIZES }, { name: 'Metal', values: METALS }],
    specs: [{ label: 'Piedra central', value: 'Esmeralda 1.25 ct' }, { label: 'Origen', value: 'Muzo, Colombia' }],
  }),
  product({
    id: 'collar-luna',
    name: 'Collar Lumière Astral',
    price: 1480000,
    compareAtPrice: 1750000,
    categoryId: 'collares',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
    ],
    art: { kind: 'necklace', color: '#e6c78f' },
    featured: true,
    stock: 20,
    description: 'Cadena veneciana en oro 18k con pendentif geométrico y diamante flotante en bisel.',
    options: [{ name: 'Largo', values: [{ label: '40 cm', priceDelta: 0 }, { label: '45 cm', priceDelta: 60000 }, { label: '50 cm', priceDelta: 120000 }] }, { name: 'Metal', values: METALS }],
    specs: [{ label: 'Metal', value: 'Oro 18k' }, { label: 'Cierre', value: 'Mosquetón de seguridad' }],
  }),
  product({
    id: 'gargantilla-perla',
    name: 'Gargantilla Akoya Imperial',
    price: 1850000,
    categoryId: 'collares',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85',
    ],
    art: { kind: 'necklace', color: '#f1e8da' },
    stock: 8,
    description: 'Perlas Akoya seleccionadas por su lustre espejo con broche invisible en oro amarillo 18k.',
    specs: [{ label: 'Perlas', value: '7.5–8 mm AAA' }, { label: 'Largo', value: '42 cm' }],
  }),
  product({
    id: 'dije-corazon',
    name: 'Medallón Solsticio d’Or',
    price: 2300000,
    categoryId: 'collares',
    images: [
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1000&q=85',
    ],
    art: { kind: 'necklace', color: '#e9b4b4' },
    badge: 'Edición 2026',
    stock: 10,
    description: 'Medallón satinado a mano con estrella polar grabada y diamante central de 0.12 ct.',
    specs: [{ label: 'Piedra', value: 'Diamante 0.12 ct' }, { label: 'Diámetro', value: '18 mm' }],
  }),
  product({
    id: 'topos-brillante',
    name: 'Dormilonas Éclat Pur',
    price: 2250000,
    categoryId: 'aretes',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
    ],
    art: { kind: 'earrings', color: '#cfd8e6' },
    featured: true,
    badge: 'Más vendido',
    stock: 15,
    description: 'Par de dormilonas con diamantes en talla brillante redonda engastados en canasta baja de cuatro garras.',
    options: [{ name: 'Metal', values: METALS }, { name: 'Quilataje total', values: [{ label: '0.30 ct', priceDelta: 0 }, { label: '0.60 ct', priceDelta: 1400000 }, { label: '1.00 ct', priceDelta: 3200000 }] }],
    specs: [{ label: 'Corte', value: 'Excelente · Triple Ideal' }, { label: 'Cierre', value: 'Presión de seguridad Alpa' }],
  }),
  product({
    id: 'argollas-clasicas',
    name: 'Argollas Esculturales Aura',
    price: 1460000,
    categoryId: 'aretes',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85',
    ],
    art: { kind: 'earrings', color: '#e3bb78' },
    featured: true,
    stock: 25,
    description: 'Argollas de sección orgánica vaciadas en oro 18k, ligeras para uso continuo y pulidas a alto brillo.',
    options: [{ name: 'Diámetro', values: [{ label: '16 mm', priceDelta: 0 }, { label: '22 mm', priceDelta: 220000 }, { label: '28 mm', priceDelta: 440000 }] }, { name: 'Metal', values: METALS }],
  }),
  product({
    id: 'pendientes-zafiro',
    name: 'Pendientes Gota de Ceilán',
    price: 3800000,
    categoryId: 'aretes',
    images: [
      'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=1000&q=85',
    ],
    art: { kind: 'earrings', color: '#4a74d9' },
    stock: 4,
    description: 'Zafiros azules naturales en talla pera suspendidos de una línea articulada de diamantes.',
    specs: [{ label: 'Piedra', value: 'Zafiros 2 × 0.85 ct' }],
  }),
  product({
    id: 'pulsera-tennis',
    name: 'Pulsera Rivière Tennis',
    price: 5600000,
    compareAtPrice: 6200000,
    categoryId: 'pulseras',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1000&q=85',
    ],
    art: { kind: 'bracelet', color: '#dcdfe6' },
    featured: true,
    badge: 'Alta joyería',
    stock: 5,
    description: 'Línea articulada continua de diamantes en engaste de cuatro garras con doble cierre oculto de seguridad.',
    options: [{ name: 'Largo', values: [{ label: '16 cm', priceDelta: 0 }, { label: '17 cm', priceDelta: 0 }, { label: '18 cm', priceDelta: 250000 }] }, { name: 'Metal', values: METALS }],
    specs: [{ label: 'Diamantes', value: '2.00 ct total · VS' }],
  }),
  product({
    id: 'esclava-oro',
    name: 'Brazalete Rígido Manchette',
    price: 2350000,
    categoryId: 'pulseras',
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1000&q=85',
    ],
    art: { kind: 'bracelet', color: '#e8c97a' },
    featured: true,
    stock: 14,
    description: 'Brazalete ovalado rígido con bisagra invisible y cierre de pulsador integrado.',
    options: [{ name: 'Metal', values: METALS }],
  }),
  product({
    id: 'brazalete-trenzado',
    name: 'Pulsera Eslabón Imperial',
    price: 1580000,
    categoryId: 'pulseras',
    images: [
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1000&q=85',
    ],
    art: { kind: 'bracelet', color: '#c9a28c' },
    stock: 18,
    description: 'Eslabones facetados ensamblados a mano con caída fluida sobre la muñeca.',
  }),
];

/* ------------------------------------------------------------------ */
/*  PLANTILLA 2: TIENDA GENERAL (ropa, accesorios, belleza, etc.)      */
/* ------------------------------------------------------------------ */

const generalSettings: StoreSettings = {
  ...jewelrySettings,
  brand: { name: 'KOVA STUDIO', tagline: 'Objetos & Esenciales Contemporáneos', logoUrl: '', description: 'Objetos cotidianos diseñados con materiales nobles, líneas limpias y producción responsable. Edita todos los textos y productos desde el panel de administración.' },
  theme: { mode: 'light', accent: '#18181b', fontStyle: 'sans' },
  announcement: { enabled: true, text: 'Envíos a todo el país · Cambios sin costo durante 30 días' },
  nav: [
    { label: 'Tienda', href: '/tienda' },
    { label: 'Novedades', href: '/tienda?cat=novedades' },
    { label: 'Contacto', href: '/#contacto' },
  ],
  hero: {
    ...jewelrySettings.hero,
    eyebrow: 'Edición 01 · 2026',
    title: 'Diseño esencial para todos los días.',
    subtitle: 'Descubre nuestra colección cápsula y compra de forma rápida con pago en línea o por WhatsApp.',
    ctaLabel: 'Explorar catálogo',
    secondaryLabel: '',
    show3D: false,
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85',
  },
  sections: {
    ...jewelrySettings.sections,
    featuredSubtitle: 'Los favoritos de la temporada',
    benefits: [
      { title: 'Envío ágil', text: 'Despachamos en 24–48 horas a todo el país.' },
      { title: 'Pago seguro', text: 'Tarjetas, PSE, Nequi o contra pedido por WhatsApp.' },
      { title: 'Cambios fáciles', text: '30 días para cambios o devoluciones.' },
      { title: 'Atención directa', text: 'Asesoría personalizada por WhatsApp.' },
    ],
    newsletterTitle: 'Newsletter',
    newsletterText: 'Recibe lanzamientos y descuentos exclusivos.',
  },
  shipping: { flatRate: 12000, freeFrom: 180000, note: 'Entrega en 2 a 5 días hábiles.' },
  payments: { wompi: true, whatsappOrders: true, orderPrefix: 'KV' },
  customizer: { ...jewelrySettings.customizer, enabled: false },
};

const generalCategories: Category[] = [
  {
    id: 'novedades',
    slug: 'novedades',
    name: 'Novedades',
    description: 'Lo último en llegar a la tienda',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    art: { kind: 'box', color: '#6aa7ff' },
  },
  {
    id: 'accesorios',
    slug: 'accesorios',
    name: 'Accesorios',
    description: 'Marroquinería, relojes y objetos personales',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
    art: { kind: 'watch', color: '#ff9f6a' },
  },
];

const generalImgs = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=900&q=80',
];

const generalProducts: Product[] = [1, 2, 3, 4, 5, 6].map((n, i) =>
  product({
    id: `producto-${n}`,
    name: `Esencial No. 0${n}`,
    price: 85000 + n * 25000,
    categoryId: n % 2 ? 'novedades' : 'accesorios',
    images: [generalImgs[i]],
    art: { kind: 'box', color: n % 2 ? '#6aa7ff' : '#ff9f6a' },
    featured: n <= 4,
    stock: 30,
    description: 'Descripción del producto. Puedes cambiar nombre, fotos, variantes y precios desde el panel /admin.',
    options: [{ name: 'Talla', values: ['S', 'M', 'L'].map((l) => ({ label: l, priceDelta: 0 })) }],
  }),
);

export const TEMPLATES: Record<string, { label: string; data: CatalogData }> = {
  joyeria: { label: 'Joyería de autor (MIRA)', data: { settings: jewelrySettings, categories: jewelryCategories, products: jewelryProducts } },
  general: { label: 'Tienda general / Moda & Objetos (KOVA)', data: { settings: generalSettings, categories: generalCategories, products: generalProducts } },
};

export const DEFAULT_CATALOG: CatalogData = TEMPLATES.joyeria.data;
