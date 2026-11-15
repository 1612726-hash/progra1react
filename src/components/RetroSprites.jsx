// 👾 COMPONENTES SVG PIXEL-ART: PACMAN, NAVES ESPACIALES Y CARTUCHOS RETRO

export const PacmanSprite = ({ size = 32, animated = true, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: 'drop-shadow(0 0 6px #ffe600)' }}
  >
    {/* Pacman shape */}
    <path
      d="M12 2H20V4H24V8H26V10H28V14H24V16H20V18H24V22H28V24H26V26H24V28H20V30H12V28H8V26H6V24H4V20H2V12H4V8H6V6H8V4H12V2Z"
      fill="#FFE600"
    />
    {/* Ojo pixel */}
    <rect x="14" y="6" width="3" height="3" fill="#090214" />
  </svg>
);

export const GhostSprite = ({ size = 32, color = '#FF007F', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: `drop-shadow(0 0 6px ${color})` }}
  >
    {/* Cuerpo del fantasma */}
    <path
      d="M10 2H22V4H26V8H28V26H26V30H24V26H20V30H18V26H14V30H12V26H8V30H6V26H4V8H6V4H10V2Z"
      fill={color}
    />
    {/* Ojos blancos */}
    <rect x="8" y="10" width="6" height="8" fill="#FFFFFF" />
    <rect x="18" y="10" width="6" height="8" fill="#FFFFFF" />
    {/* Pupilas azules */}
    <rect x="12" y="14" width="3" height="4" fill="#002288" />
    <rect x="22" y="14" width="3" height="4" fill="#002288" />
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
    style={{ filter: 'drop-shadow(0 0 8px #00ffcc)' }}
  >
    {/* Galaga / Defender Starfighter */}
    <rect x="15" y="2" width="2" height="6" fill="#00FFCC" />
    <rect x="14" y="8" width="4" height="4" fill="#FFFFFF" />
    <rect x="13" y="12" width="6" height="6" fill="#00FFCC" />
    <rect x="11" y="14" width="2" height="6" fill="#FF007F" />
    <rect x="19" y="14" width="2" height="6" fill="#FF007F" />
    <rect x="8" y="18" width="3" height="8" fill="#FFFFFF" />
    <rect x="21" y="18" width="3" height="8" fill="#FFFFFF" />
    <rect x="5" y="22" width="3" height="6" fill="#00FFCC" />
    <rect x="24" y="22" width="3" height="6" fill="#00FFCC" />
    <rect x="2" y="26" width="3" height="4" fill="#FF007F" />
    <rect x="27" y="26" width="3" height="4" fill="#FF007F" />
    {/* Propulsor fuego */}
    <rect x="14" y="24" width="4" height="4" fill="#FFE600" />
    <rect x="15" y="28" width="2" height="3" fill="#FF4400" />
  </svg>
);

export const SpaceInvaderSprite = ({ size = 32, color = '#39FF14', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: `drop-shadow(0 0 6px ${color})` }}
  >
    {/* Space Invader Crab */}
    <path
      d="M6 8H10V10H6V8ZM22 8H26V10H22V8ZM8 10H12V12H8V10ZM20 10H24V12H20V10ZM6 12H26V18H24V20H20V18H12V20H8V18H6V12ZM4 14H6V22H4V14ZM26 14H28V22H26V14ZM2 18H4V24H2V18ZM28 18H30V24H28V18ZM6 22H10V26H8V28H6V22ZM22 22H26V26H24V28H22V22Z"
      fill={color}
    />
    {/* Ojos */}
    <rect x="10" y="14" width="3" height="3" fill="#090214" />
    <rect x="19" y="14" width="3" height="3" fill="#090214" />
  </svg>
);

export const CartridgeSprite = ({ size = 36, color = '#A855F7', label = 'RETRO', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: `drop-shadow(0 0 8px ${color})` }}
  >
    {/* Carcasa plástica del cartucho */}
    <rect x="4" y="4" width="32" height="30" rx="3" fill="#2A1B4E" stroke={color} strokeWidth="2" />
    {/* Ranuras de ventilación superiores */}
    <line x1="10" y1="8" x2="30" y2="8" stroke="#13082B" strokeWidth="2" />
    <line x1="10" y1="12" x2="30" y2="12" stroke="#13082B" strokeWidth="2" />
    {/* Etiqueta central del juego */}
    <rect x="8" y="15" width="24" height="14" rx="1" fill="#FFE600" />
    <rect x="10" y="17" width="20" height="10" fill="#FF007F" />
    {/* Conectores dorados inferiores */}
    <rect x="10" y="34" width="20" height="3" fill="#EAB308" />
  </svg>
);
