# Tienda online configurable (joyería y cualquier otro rubro)

E-commerce en Next.js listo para vender: catálogo, carrito, checkout (Wompi / WhatsApp), panel de administración y, opcionalmente, un visor 3D para personalizar anillos.
Todo el contenido (marca, colores, textos, productos, categorías, envíos) se edita desde **/admin**; no hay que tocar código.

## Inicio rápido

```bash
cd apps/web
npm install      # o pnpm install
npm run dev      # http://localhost:3000
```

| Ruta | Descripción |
|---|---|
| `/` | Portada (hero, categorías, destacados, beneficios) |
| `/tienda` | Catálogo con búsqueda, filtros y orden |
| `/producto/[slug]` | Detalle con opciones (talla, material…) |
| `/personalizador` | Visor 3D de anillos (se puede desactivar) |
| `/checkout` | Datos de envío y pago |
| `/admin` | Panel de administración (contraseña por defecto: `admin123`) |

## Configurar para un cliente nuevo

1. Entra a `/admin` → **Datos y plantillas** y carga una plantilla (*Joyería* o *Tienda general*).
2. **Ajustes de tienda**: nombre, logo, color, tema claro/oscuro, moneda, WhatsApp, envíos, textos de portada.
3. **Categorías** y **Productos**: precios, fotos, stock, opciones (`Talla: S, M, L`, `Metal: Oro, Plata +50000`) y especificaciones.
4. Si no vendes anillos, desactiva el **Personalizador 3D**.

## Cómo se guardan los datos (importante)

- `apps/web/src/data/catalog.ts` es el catálogo **publicado** con la web.
- Lo que edites en `/admin` se guarda en el `localStorage` del navegador (sirve para preparar y previsualizar).
- Para **publicar**: `/admin` → *Datos y plantillas* → exportar JSON → pegarlo en `DEFAULT_CATALOG` de `catalog.ts` → subir `CATALOG_VERSION` → desplegar.
- Para un panel multiusuario con base de datos central (Supabase/Postgres + `apps/api`), el siguiente paso es sustituir `useStoreData` por llamadas a la API.

## Variables de entorno (`apps/web`)

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Contraseña del panel. **Cámbiala.** Es una protección básica del lado del cliente. |
| `NEXT_PUBLIC_API_URL` | URL del backend (`apps/api`) para pagos Wompi. Sin ella, el checkout usa pedidos por WhatsApp. |

El backend (`apps/api`) usa las variables de `.env.example` (Wompi y base de datos).

## Despliegue en Vercel

Importa el repositorio, **Root Directory = `apps/web`**, define las variables y despliega.

## Estructura

- `apps/web`: tienda Next.js 14 + Tailwind + Zustand + React Three Fiber.
- `apps/api`: NestJS (firma de integridad y webhooks de Wompi, órdenes).
- `packages/database`: modelos Prisma (PostgreSQL/Supabase).
