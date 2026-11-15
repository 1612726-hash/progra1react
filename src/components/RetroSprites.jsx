// ✨ ICONOGRAFÍA E ILUSTRACIONES VECTORIALES ESTILO FRUTIGER AERO
// Orbes translúcidos, reflejos de cristal, esferas de luz y acabados glossy Aqua

export const PacmanSprite = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: 'drop-shadow(0 4px 10px rgba(2, 132, 199, 0.35))' }}
  >
    <defs>
      <linearGradient id="aeroOrbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="aeroOrbShine" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
      </linearGradient>
    </defs>
    {/* Esfera base translúcida */}
    <circle cx="16" cy="16" r="14" fill="url(#aeroOrbGrad)" stroke="#bae6fd" strokeWidth="1" />
    {/* Reflejo curvado superior de cristal */}
    <ellipse cx="16" cy="10" rx="9" ry="5" fill="url(#aeroOrbShine)" />
    {/* Destello de luz */}
    <circle cx="11" cy="9" r="2" fill="#ffffff" opacity="0.9" />
  </svg>
);

export const GhostSprite = ({ size = 32, color = '#10b981', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: 'drop-shadow(0 4px 10px rgba(16, 185, 129, 0.35))' }}
  >
    <defs>
      <linearGradient id="emeraldAero" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6ee7b7" />
        <stop offset="50%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    {/* Gota de agua esmeralda Aero */}
    <path
      d="M16 4C16 4 7 15 7 21C7 26 11 30 16 30C21 30 25 26 25 21C25 15 16 4 16 4Z"
      fill="url(#emeraldAero)"
      stroke="#a7f3d0"
      strokeWidth="1"
    />
    {/* Reflejo de cristal curvado */}
    <path
      d="M16 7C14 11 10 17 10 21C10 22 10.5 23 11.5 23C13 23 15 17 16 7Z"
      fill="#ffffff"
      opacity="0.65"
    />
  </svg>
);

export const SpaceShipSprite = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: 'drop-shadow(0 4px 12px rgba(14, 165, 233, 0.45))' }}
  >
    <defs>
      <linearGradient id="shipAeroGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
    </defs>
    {/* Disco óptico holográfico / CD Aero */}
    <circle cx="16" cy="16" r="13" fill="url(#shipAeroGrad)" stroke="#e0f2fe" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="5" fill="#f0f9ff" stroke="#38bdf8" strokeWidth="1" />
    <circle cx="16" cy="16" r="2.5" fill="#ffffff" />
    {/* Reflejo diagonal irisado */}
    <path d="M7 16A9 9 0 0 1 25 16" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
  </svg>
);

export const SpaceInvaderSprite = ({ size = 32, color = '#06b6d4', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: 'drop-shadow(0 4px 10px rgba(6, 182, 212, 0.35))' }}
  >
    <defs>
      <linearGradient id="cyanAeroSparkle" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a5f3fc" />
        <stop offset="50%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#0891b2" />
      </linearGradient>
    </defs>
    {/* Estrella cristalina / Destello de brillo Aero */}
    <path
      d="M16 2L18.5 12L28.5 14.5L18.5 17L16 27L13.5 17L3.5 14.5L13.5 12L16 2Z"
      fill="url(#cyanAeroSparkle)"
      stroke="#ffffff"
      strokeWidth="1"
    />
    <circle cx="16" cy="14.5" r="2.5" fill="#ffffff" />
  </svg>
);

export const CartridgeSprite = ({ size = 36, color = '#0284c7', label = 'AERO', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: 'drop-shadow(0 6px 14px rgba(2, 132, 199, 0.25))' }}
  >
    <defs>
      <linearGradient id="cartAeroBody" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#e0f2fe" />
        <stop offset="100%" stopColor="#bae6fd" />
      </linearGradient>
      <linearGradient id="cartAeroLabel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
    </defs>
    {/* Carcasa de cristal pulcro redondeado */}
    <rect x="5" y="4" width="30" height="31" rx="6" fill="url(#cartAeroBody)" stroke="#bae6fd" strokeWidth="1.5" />
    {/* Reflejo curvado */}
    <path d="M7 10C7 7.5 9 6 12 6H28C31 6 33 7.5 33 10V16C23 14 15 17 7 20V10Z" fill="#ffffff" opacity="0.6" />
    {/* Etiqueta central aqua glossy */}
    <rect x="8" y="16" width="24" height="13" rx="4" fill="url(#cartAeroLabel)" />
    <circle cx="13" cy="22.5" r="2" fill="#ffffff" opacity="0.85" />
    {/* Conector dorado inferior */}
    <rect x="10" y="35" width="20" height="3" rx="1.5" fill="#f59e0b" />
  </svg>
);
