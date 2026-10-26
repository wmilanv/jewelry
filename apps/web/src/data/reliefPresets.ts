export interface ReliefPreset {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  svgDataUri: string;
  defaultDepth: number;
  recommendedBorder: 'milgrain' | 'guilloche' | 'smooth';
  recommendedStyle: 'relief' | 'intaglio' | 'engraving';
}

/* ======================================================================= */
/*  VECTORES SVG DE ALTA DEFINICIÓN (HAUTE JOAILLERIE ATELIER VENDÔME)     */
/*  Diseñados en escala de grises para mapa de alturas milimétrico 2D → 3D */
/* ======================================================================= */

const SVG_VENDOME_MONOGRAM = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="sunburst" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="65%" stop-color="#ffffff" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldRib" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#d4d4d4"/>
      <stop offset="100%" stop-color="#808080"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="#000000"/>
  <!-- Halo de resplandor suave de fondo -->
  <circle cx="256" cy="256" r="236" fill="url(#sunburst)"/>
  <!-- Rayos guilloché concéntricos -->
  <g stroke="#ffffff" stroke-opacity="0.22" stroke-width="1.2">
    <circle cx="256" cy="256" r="230"/>
    <circle cx="256" cy="256" r="222" stroke-dasharray="2 4"/>
    <circle cx="256" cy="256" r="210"/>
    <circle cx="256" cy="256" r="192" stroke-dasharray="1 3"/>
  </g>
  <!-- Corona Imperial Superior con 5 puntas y perlas -->
  <g fill="#ffffff">
    <path d="M 196,150 L 210,105 L 232,132 L 256,92 L 280,132 L 302,105 L 316,150 C 296,158 216,158 196,150 Z"/>
    <circle cx="210" cy="100" r="5.5"/>
    <circle cx="256" cy="86" r="7"/>
    <circle cx="302" cy="100" r="5.5"/>
    <rect x="206" y="152" width="100" height="9" rx="3"/>
    <circle cx="226" cy="156.5" r="2.5" fill="#000000"/>
    <circle cx="256" cy="156.5" r="3" fill="#000000"/>
    <circle cx="286" cy="156.5" r="2.5" fill="#000000"/>
  </g>
  <!-- Corona de Laureles Flanqueando el Monograma -->
  <g fill="#ffffff" fill-opacity="0.85">
    <!-- Laurel Izquierdo -->
    <path d="M 160,200 C 146,230 146,280 168,324 C 172,316 170,300 164,288 C 158,260 162,230 174,212 Z"/>
    <ellipse cx="146" cy="235" rx="8" ry="16" transform="rotate(-30 146 235)"/>
    <ellipse cx="140" cy="270" rx="8" ry="16" transform="rotate(-15 140 270)"/>
    <ellipse cx="148" cy="305" rx="8" ry="16" transform="rotate(10 148 305)"/>
    <ellipse cx="168" cy="336" rx="8" ry="16" transform="rotate(35 168 336)"/>
    <!-- Laurel Derecho -->
    <path d="M 352,200 C 366,230 366,280 344,324 C 340,316 342,300 348,288 C 354,260 350,230 338,212 Z"/>
    <ellipse cx="366" cy="235" rx="8" ry="16" transform="rotate(30 366 235)"/>
    <ellipse cx="372" cy="270" rx="8" ry="16" transform="rotate(15 372 270)"/>
    <ellipse cx="364" cy="305" rx="8" ry="16" transform="rotate(-10 364 305)"/>
    <ellipse cx="344" cy="336" rx="8" ry="16" transform="rotate(-35 344 336)"/>
  </g>
  <!-- Gran Letra 'V' Romana Biselada Caligráfica -->
  <g fill="#ffffff">
    <!-- Brazo Izquierdo (Grueso y Biselado) -->
    <polygon points="178,190 232,190 262,372 244,372 178,190"/>
    <!-- Remate Superior Izquierdo (Serif) -->
    <rect x="170" y="184" width="68" height="10" rx="2"/>
    <!-- Brazo Derecho (Fino y Elegante) -->
    <polygon points="328,190 310,190 248,372 262,372 328,190"/>
    <!-- Remate Superior Derecho (Serif de gota) -->
    <circle cx="324" cy="188" r="10"/>
    <!-- Vértice inferior de unión con fleurón -->
    <polygon points="244,370 266,370 255,394"/>
    <circle cx="255" cy="400" r="4"/>
  </g>
  <!-- Barra Central Simbólica de la Plaza Vendôme (Columna octogonal) -->
  <polygon points="252,216 260,216 258,340 254,340" fill="#a0a0a0"/>
</svg>`;

const SVG_FLEUR_DE_LIS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="fleurGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2"/>
      <stop offset="70%" stop-color="#ffffff" stop-opacity="0.03"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" fill="#000000"/>
  <circle cx="256" cy="256" r="236" fill="url(#fleurGlow)"/>
  <!-- Anillo exterior de micro-graneado -->
  <circle cx="256" cy="256" r="226" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-opacity="0.3"/>
  <circle cx="256" cy="256" r="218" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="3 5" stroke-opacity="0.45"/>
  <!-- Pétalo Central Superior (Lanza Imperial con Nervio) -->
  <path d="M 256,64 C 270,116 304,180 304,228 C 304,272 278,284 256,284 C 234,284 208,272 208,228 C 208,180 242,116 256,64 Z" fill="#ffffff"/>
  <!-- Nervio Central Biselado -->
  <polygon points="254,74 258,74 259,280 253,280" fill="#888888"/>
  <!-- Pétalo Izquierdo Curvo con Voluta de Acanto -->
  <path d="M 224,270 C 196,268 128,252 110,210 C 94,174 108,138 136,138 C 158,138 174,160 178,180 C 182,196 176,212 168,220 C 188,222 216,236 230,266 Z" fill="#ffffff"/>
  <circle cx="136" cy="148" r="8" fill="#444444"/>
  <!-- Pétalo Derecho Curvo con Voluta de Acanto -->
  <path d="M 288,270 C 316,268 384,252 402,210 C 418,174 404,138 376,138 C 354,138 338,160 334,180 C 330,196 336,212 344,220 C 324,222 296,236 282,266 Z" fill="#ffffff"/>
  <circle cx="376" cy="148" r="8" fill="#444444"/>
  <!-- Anillo / Fíbula Horizontal con 3 Cabujones de Oro -->
  <g fill="#ffffff">
    <rect x="178" y="278" width="156" height="26" rx="8"/>
    <circle cx="212" cy="291" r="5" fill="#222222"/>
    <circle cx="256" cy="291" r="6.5" fill="#222222"/>
    <circle cx="300" cy="291" r="5" fill="#222222"/>
  </g>
  <!-- Base Inferior en Abanico de Acanto -->
  <path d="M 230,312 C 220,350 186,392 166,412 C 196,412 238,390 256,362 C 274,390 316,412 346,412 C 326,392 292,350 282,312 Z" fill="#ffffff"/>
  <polygon points="254,320 258,320 258,380 254,380" fill="#777777"/>
  <circle cx="256" cy="426" r="6" fill="#ffffff"/>
</svg>`;

const SVG_HERALDIC_LION = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="lionBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="70%" stop-color="#ffffff" stop-opacity="0.02"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" fill="#000000"/>
  <circle cx="256" cy="256" r="236" fill="url(#lionBg)"/>
  <!-- Orla heráldica octogonal con cuentas -->
  <polygon points="256,28 416,94 482,256 416,418 256,484 96,418 30,256 96,94" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-opacity="0.35"/>
  <circle cx="256" cy="256" r="218" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="2 6" stroke-opacity="0.4"/>
  <!-- León Rampante Real (Silueta Esculpida con Corona y Melena) -->
  <g fill="#ffffff">
    <!-- Corona Ducal en Cabeza -->
    <path d="M 194,116 L 202,96 L 214,108 L 228,92 L 240,108 L 250,96 L 256,116 Z"/>
    <circle cx="202" cy="92" r="3"/>
    <circle cx="228" cy="88" r="4"/>
    <circle cx="250" cy="92" r="3"/>
    <!-- Cabeza y Fauces Abiertas con Lengua -->
    <path d="M 200,122 C 220,118 244,120 252,136 C 258,146 250,154 268,154 C 274,154 278,160 270,166 C 258,172 248,166 244,174 C 240,182 248,190 236,190 C 224,190 216,176 210,166 Z"/>
    <!-- Ojo Heráldico Inciso -->
    <ellipse cx="232" cy="138" rx="4" ry="2.5" fill="#000000"/>
    <!-- Melena Esculpida en Mechas Flamígeras -->
    <path d="M 210,160 C 190,172 176,198 178,226 C 166,220 158,206 160,190 C 150,198 146,218 152,234 C 140,230 134,216 138,202 C 132,216 130,240 148,258 C 158,266 172,272 186,276 Z"/>
    <path d="M 204,188 C 192,204 186,230 196,252 C 182,248 176,234 180,220 Z"/>
    <!-- Garra Delantera Superior en Ataque -->
    <path d="M 230,186 C 252,176 288,168 316,146 C 322,142 328,148 322,154 C 314,162 298,176 284,186 C 298,184 314,180 324,176 C 328,176 330,182 324,186 C 310,194 286,202 268,206 Z"/>
    <!-- Garra Delantera Inferior -->
    <path d="M 232,216 C 256,222 284,228 310,222 C 316,220 320,226 314,230 C 300,238 274,242 254,240 Z"/>
    <!-- Tronco / Cuerpo Robusto -->
    <path d="M 208,240 C 218,252 230,274 230,302 C 230,332 216,358 198,378 C 212,374 232,360 240,344 C 248,326 248,290 238,264 C 234,252 224,244 216,236 Z"/>
    <!-- Pata Trasera Superior Musculada y Garra de Apoyo -->
    <path d="M 226,324 C 254,332 288,360 292,392 C 294,402 284,406 276,400 C 268,392 260,378 248,370 C 252,382 258,396 254,406 C 248,414 238,410 236,400 C 230,380 230,354 220,336 Z"/>
    <!-- Pata Trasera Inferior de Base -->
    <path d="M 198,378 C 190,396 176,420 156,436 C 148,442 142,434 148,428 C 158,416 168,400 174,384 Z"/>
    <!-- Cola Flamígera Enrollada en Doble Bucle y Borla -->
    <path d="M 202,364 C 180,358 162,336 162,306 C 162,272 186,252 204,232 C 196,248 184,268 184,296 C 184,316 196,334 212,342 Z"/>
    <!-- Borla Florida de la Cola -->
    <path d="M 204,232 C 212,216 226,196 230,178 C 220,188 214,204 206,216 Z"/>
    <circle cx="230" cy="176" r="6"/>
  </g>
</svg>`;

const SVG_MYSTIC_ROSE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="roseCore" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="45%" stop-color="#cccccc"/>
      <stop offset="80%" stop-color="#777777"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" fill="#000000"/>
  <!-- Marco circular perlé -->
  <circle cx="256" cy="256" r="236" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-opacity="0.3"/>
  <circle cx="256" cy="256" r="226" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-dasharray="4 6" stroke-opacity="0.5"/>
  <!-- Hojas de Rosal Botánico Talladas en Fondo -->
  <g fill="#ffffff" fill-opacity="0.55">
    <!-- Hoja Superior Derecha -->
    <path d="M 310,180 C 350,140 400,146 420,166 C 420,196 394,236 340,240 C 354,210 336,192 310,180 Z"/>
    <line x1="324" y1="210" x2="410" y2="170" stroke="#000000" stroke-width="2"/>
    <!-- Hoja Inferior Izquierda -->
    <path d="M 202,332 C 162,372 112,366 92,346 C 92,316 118,276 172,272 C 158,302 176,320 202,332 Z"/>
    <line x1="188" y1="302" x2="102" y2="342" stroke="#000000" stroke-width="2"/>
  </g>
  <!-- Capa 1 Exterior de Pétalos de Rosa (Mayor Diámetro) -->
  <g fill="#ffffff">
    <path d="M 256,120 C 310,120 358,150 366,196 C 342,192 312,196 280,208 C 248,196 218,192 194,196 C 202,150 250,120 256,120 Z"/>
    <path d="M 374,212 C 400,250 392,306 354,342 C 340,320 324,302 296,288 C 318,262 334,234 374,212 Z"/>
    <path d="M 346,350 C 310,388 250,396 206,378 C 218,354 238,336 264,328 C 290,336 320,344 346,350 Z"/>
    <path d="M 194,374 C 150,348 132,298 144,248 C 172,260 196,278 214,306 C 196,330 194,354 194,374 Z"/>
    <path d="M 148,236 C 146,186 182,148 226,136 C 220,164 228,194 246,216 C 206,218 174,224 148,236 Z"/>
  </g>
  <!-- Capa 2 Intermedia de Pétalos Abiertos -->
  <g fill="#e2e2e2">
    <path d="M 256,172 C 292,172 322,192 326,224 C 296,230 274,240 256,252 C 238,240 216,230 186,224 C 190,192 220,172 256,172 Z"/>
    <path d="M 328,234 C 344,260 338,296 314,318 C 296,298 284,284 266,274 C 286,258 306,246 328,234 Z"/>
    <path d="M 306,324 C 280,346 236,350 208,336 C 220,318 238,306 256,300 C 274,306 292,316 306,324 Z"/>
    <path d="M 200,330 C 178,310 172,274 186,246 C 204,258 220,270 236,282 C 218,298 208,314 200,330 Z"/>
  </g>
  <!-- Capa 3 Corazón Espiralado de la Rosa (Broche Central Alta Joaillerie) -->
  <g fill="#ffffff">
    <ellipse cx="256" cy="260" rx="36" ry="32"/>
    <path d="M 242,246 C 254,238 270,240 276,252 C 282,266 268,278 254,276 C 244,274 240,264 246,258 C 252,252 260,256 258,262" fill="none" stroke="#000000" stroke-width="4.5" stroke-linecap="round"/>
    <!-- Grano de diamante central -->
    <circle cx="256" cy="260" r="3.5" fill="#000000"/>
  </g>
</svg>`;

const SVG_SUNBURST_GUILLOCHE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#d0d0d0"/>
      <stop offset="75%" stop-color="#555555"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" fill="#000000"/>
  <!-- Rayos Guilloché Facetados Alternados (32 Rayos de Sol) -->
  <g fill="#ffffff" fill-opacity="0.88">
    <!-- Rayo 0° -->
    <polygon points="256,40 262,210 250,210"/>
    <polygon points="256,40 256,210 250,210" fill="#666666"/>
    <!-- Rayo 45° -->
    <polygon points="408,104 288,224 280,216"/>
    <!-- Rayo 90° -->
    <polygon points="472,256 302,262 302,250"/>
    <!-- Rayo 135° -->
    <polygon points="408,408 288,288 296,280"/>
    <!-- Rayo 180° -->
    <polygon points="256,472 250,302 262,302"/>
    <!-- Rayo 225° -->
    <polygon points="104,408 224,288 216,296"/>
    <!-- Rayo 270° -->
    <polygon points="40,256 210,250 210,262"/>
    <!-- Rayo 315° -->
    <polygon points="104,104 224,224 232,216"/>
    
    <!-- Rayos Intermedios Flamígeros Ondulados (22.5°, 67.5°, etc.) -->
    <polygon points="338,62 268,214 260,210" fill-opacity="0.65"/>
    <polygon points="450,174 298,240 294,232" fill-opacity="0.65"/>
    <polygon points="450,338 298,272 302,280" fill-opacity="0.65"/>
    <polygon points="338,450 268,298 274,302" fill-opacity="0.65"/>
    <polygon points="174,450 244,298 238,302" fill-opacity="0.65"/>
    <polygon points="62,338 214,272 210,280" fill-opacity="0.65"/>
    <polygon points="62,174 214,240 218,232" fill-opacity="0.65"/>
    <polygon points="174,62 244,214 250,210" fill-opacity="0.65"/>
  </g>
  <!-- Anillo de Guilloché Ondulado Concéntrico -->
  <circle cx="256" cy="256" r="236" fill="none" stroke="#ffffff" stroke-width="2"/>
  <circle cx="256" cy="256" r="226" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="3 5"/>
  <circle cx="256" cy="256" r="148" fill="none" stroke="#ffffff" stroke-width="2.5"/>
  <!-- Roseta Central de Horología Suiza -->
  <circle cx="256" cy="256" r="88" fill="url(#sunGlow)"/>
  <!-- Estrella Central de 12 Puntas en Alto Relieve -->
  <g fill="#ffffff">
    <polygon points="256,176 266,236 296,216 276,246 336,256 276,266 296,296 266,276 256,336 246,276 216,296 236,266 176,256 236,246 216,216 246,236"/>
    <!-- Cabujón Pulido en Centro Absoluto -->
    <circle cx="256" cy="256" r="18" fill="#ffffff"/>
    <circle cx="256" cy="256" r="12" fill="#333333"/>
    <circle cx="256" cy="256" r="5" fill="#ffffff"/>
  </g>
</svg>`;

export const RELIEF_PRESETS: ReliefPreset[] = [
  {
    id: 'vendome-monogram',
    name: 'Monograma Real Vendôme',
    subtitle: 'Corona imperial, laureles y serifas romanas entrelazadas',
    tag: 'Haute Joaillerie',
    svgDataUri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SVG_VENDOME_MONOGRAM)}`,
    defaultDepth: 1.25,
    recommendedBorder: 'milgrain',
    recommendedStyle: 'relief',
  },
  {
    id: 'fleur-de-lis',
    name: 'Fleur-de-Lis Borbónica',
    subtitle: 'Lirio real de Francia con volutas de acanto y cabujones',
    tag: 'Patrimoine Paris',
    svgDataUri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SVG_FLEUR_DE_LIS)}`,
    defaultDepth: 1.35,
    recommendedBorder: 'milgrain',
    recommendedStyle: 'relief',
  },
  {
    id: 'heraldic-lion',
    name: 'León Rampante de San Marcos',
    subtitle: 'Escudo noble con corona ducal, melena flamígera y garras',
    tag: 'Héraldique',
    svgDataUri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SVG_HERALDIC_LION)}`,
    defaultDepth: 1.45,
    recommendedBorder: 'guilloche',
    recommendedStyle: 'intaglio',
  },
  {
    id: 'mystic-rose',
    name: 'Rosa Mística de Grasse',
    subtitle: 'Pétalos botánicos concéntricos con hojas y broche central',
    tag: 'Botanique',
    svgDataUri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SVG_MYSTIC_ROSE)}`,
    defaultDepth: 1.15,
    recommendedBorder: 'milgrain',
    recommendedStyle: 'relief',
  },
  {
    id: 'sunburst-guilloche',
    name: 'Sol Radiante Guilloché',
    subtitle: 'Rayos facetados y roseta astronómica de alta relojería',
    tag: 'Horlogerie',
    svgDataUri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SVG_SUNBURST_GUILLOCHE)}`,
    defaultDepth: 1.1,
    recommendedBorder: 'guilloche',
    recommendedStyle: 'engraving',
  },
];

