import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Ripple } from 'primereact/ripple';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routeConstants';
import { retroAudio } from '../utils/retroSound';
import { PacmanSprite, GhostSprite, SpaceShipSprite, SpaceInvaderSprite } from '../components/RetroSprites';

export const AppLayout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    retroAudio.playError();
    logout();
    navigate(ROUTES.LOGIN);
  };

  const navItems = [
    { label: 'DASHBOARD', icon: 'pi pi-home', path: ROUTES.DASHBOARD, code: '01' },
    { label: 'COMPRAR CARTUCHOS', icon: 'pi pi-shopping-cart', path: ROUTES.COMPRAR, code: '02' },
    { label: 'RENTAR CARTUCHOS', icon: 'pi pi-clock', path: ROUTES.RENTAR, code: '03' },
    { label: 'CATÁLOGO CARTUCHOS', icon: 'pi pi-box', path: ROUTES.PRODUCTOS, code: '04' },
    { label: 'CONSOLAS / CATEGORÍAS', icon: 'pi pi-tags', path: ROUTES.CATEGORIAS, code: '05' },
    { label: 'SOCIOS / CLIENTES', icon: 'pi pi-id-card', path: ROUTES.CLIENTES, code: '06' },
    { label: 'FACTURAS & USUARIOS (API)', icon: 'pi pi-receipt', path: ROUTES.USERS, code: '07' },
  ];

  const handleNavClick = (path) => {
    retroAudio.playCoin();
    navigate(path);
    setSidebarVisible(false);
  };

  const customHeader = (
    <div className="flex align-items-center gap-3">
      <PacmanSprite size={38} />
      <div>
        <span
          className="block font-bold text-sm"
          style={{ fontFamily: "'Press Start 2P', monospace", color: '#ffe600', letterSpacing: '1px' }}
        >
          VIDEO CLUB
        </span>
        <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.2rem', color: '#00ffcc' }}>
          &gt; COMPRA & RENTA DE CARTUCHOS
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-column surface-ground">
      {/* Barra superior estilo Marquesina Retro */}
      <header className="retro-topbar px-3 md:px-4 py-2 sticky top-0 z-5 flex justify-content-between align-items-center">
        <div className="flex align-items-center gap-3">
          <Button
            icon="pi pi-bars"
            text
            rounded
            aria-label="Menú Arcade"
            onClick={() => {
              retroAudio.playCoin();
              setSidebarVisible((prev) => !prev);
            }}
            tooltip="Menú del Video Club"
            tooltipOptions={{ position: 'bottom' }}
            style={{ color: '#00ffcc' }}
          />

          <div
            className="flex align-items-center gap-2 cursor-pointer"
            onClick={() => handleNavClick(ROUTES.DASHBOARD)}
          >
            <SpaceShipSprite size={28} />
            <div className="flex flex-column">
              <span
                className="hidden sm:inline"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '0.82rem',
                  color: '#ffe600',
                  textShadow: '2px 2px 0 #ff007f',
                  letterSpacing: '1px',
                }}
              >
                VIDEO CLUB
              </span>
              <span
                className="hidden sm:inline"
                style={{ fontFamily: "'VT323', monospace", fontSize: '0.95rem', color: '#00ffcc' }}
              >
                RETRO CARTUCHOS
              </span>
            </div>
          </div>

          {/* Botones directos principales de COMPRA y RENTA */}
          <div className="hidden lg:flex align-items-center gap-2 ml-3">
            <Button
              label="COMPRAR"
              icon="pi pi-shopping-cart"
              size="small"
              outlined={location.pathname !== ROUTES.COMPRAR}
              onClick={() => handleNavClick(ROUTES.COMPRAR)}
            />
            <Button
              label="RENTAR"
              icon="pi pi-clock"
              size="small"
              outlined={location.pathname !== ROUTES.RENTAR}
              onClick={() => handleNavClick(ROUTES.RENTAR)}
            />
            <Button
              label="CATÁLOGO"
              icon="pi pi-box"
              size="small"
              outlined={location.pathname !== ROUTES.PRODUCTOS}
              onClick={() => handleNavClick(ROUTES.PRODUCTOS)}
            />
            <Button
              label="CONSOLAS"
              icon="pi pi-tags"
              size="small"
              outlined={location.pathname !== ROUTES.CATEGORIAS}
              onClick={() => handleNavClick(ROUTES.CATEGORIAS)}
            />
            <Button
              label="SOCIOS"
              icon="pi pi-id-card"
              size="small"
              outlined={location.pathname !== ROUTES.CLIENTES}
              onClick={() => handleNavClick(ROUTES.CLIENTES)}
            />
            <Button
              label="FACTURAS"
              icon="pi pi-receipt"
              size="small"
              outlined={location.pathname !== ROUTES.USERS}
              onClick={() => handleNavClick(ROUTES.USERS)}
            />
          </div>
        </div>

        {/* Sprites Pacman y Nave en la marquesina superior */}
        <div className="hidden xl:flex align-items-center gap-3">
          <div className="flex align-items-center gap-1">
            <PacmanSprite size={24} />
            <span style={{ color: '#ffe600', fontSize: '0.9rem', letterSpacing: '3px' }}>●●●</span>
            <GhostSprite size={22} color="#FF0000" />
            <GhostSprite size={22} color="#00FFCC" />
          </div>
          <SpaceInvaderSprite size={22} color="#39FF14" />
        </div>

        {/* Perfil del jugador y botón de salida */}
        <div className="flex align-items-center gap-2 md:gap-3">
          <div
            className="hidden sm:flex align-items-center gap-2 px-3 py-1 border-round"
            style={{
              background: 'rgba(0, 255, 204, 0.1)',
              border: '1px dashed #00ffcc',
              fontFamily: "'VT323', monospace",
              fontSize: '1.25rem',
              color: '#00ffcc',
            }}
          >
            <span style={{ color: '#ffe600' }}>★ P1:</span>
            <span>{user?.name || user?.username || 'ADMIN'}</span>
            <span className="arcade-blink-text" style={{ color: '#39ff14' }}>● LIVE</span>
          </div>

          <Divider layout="vertical" className="hidden sm:inline-flex my-0" />

          <Button
            icon="pi pi-power-off"
            label="EXIT"
            severity="danger"
            size="small"
            onClick={handleLogout}
            tooltip="Cerrar Sesión / Game Over"
            tooltipOptions={{ position: 'bottom' }}
          />
        </div>
      </header>

      {/* Menú lateral Arcade Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        header={customHeader}
        className="w-full md:w-22rem"
      >
        <div className="flex flex-column justify-content-between h-full pt-2">
          <div className="flex flex-column gap-2">
            {/* Animación Pac-Man en Sidebar */}
            <div
              className="px-3 py-2 border-round mb-2 flex justify-content-between align-items-center"
              style={{
                background: 'rgba(255, 0, 127, 0.12)',
                border: '1px solid #ff007f',
                fontFamily: "'VT323', monospace",
                fontSize: '1.25rem',
                color: '#ff007f',
              }}
            >
              <div className="flex align-items-center gap-2">
                <PacmanSprite size={22} />
                <span>CREDITS: 99</span>
              </div>
              <span className="arcade-blink-text" style={{ color: '#ffe600' }}>INSERT COIN</span>
            </div>

            <ul className="list-none p-0 m-0">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.label} className="mb-2">
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.path)}
                      className="p-ripple flex align-items-center w-full p-3 border-round border-none text-left cursor-pointer transition-all transition-duration-150"
                      style={{
                        background: isActive
                          ? 'linear-gradient(90deg, #ff007f 0%, #aa0055 100%)'
                          : 'rgba(16, 6, 36, 0.7)',
                        border: isActive ? '2px solid #ffe600' : '1px solid rgba(0, 255, 204, 0.3)',
                        boxShadow: isActive ? '0 0 12px rgba(255, 0, 127, 0.6)' : 'none',
                        color: isActive ? '#ffe600' : '#00ffcc',
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: '0.65rem',
                        letterSpacing: '1px',
                      }}
                    >
                      <span className="mr-2" style={{ color: '#ff007f', fontSize: '0.75rem' }}>
                        [{item.code}]
                      </span>
                      <i className={`${item.icon} mr-3 text-base`} />
                      <span className="flex-1">{item.label}</span>
                      {isActive && <span className="arcade-blink-text">◀</span>}
                      <Ripple />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border-top-1 surface-border pt-3">
            <div
              className="p-3 border-round mb-3"
              style={{
                background: 'rgba(0, 255, 204, 0.08)',
                border: '1px solid #00ffcc',
                fontFamily: "'VT323', monospace",
              }}
            >
              <div className="flex align-items-center gap-2 mb-1" style={{ color: '#ffe600', fontSize: '1.2rem' }}>
                <SpaceShipSprite size={20} />
                <span>VIDEO CLUB RETRO</span>
              </div>
              <p className="m-0" style={{ fontSize: '1.1rem', color: '#a89bc9' }}>
                Cartuchos NES, SNES, Sega, N64 y Game Boy listos para compra y renta.
              </p>
            </div>
            <Button
              label="GAME OVER (SALIR)"
              icon="pi pi-power-off"
              severity="danger"
              className="w-full"
              onClick={handleLogout}
            />
          </div>
        </div>
      </Sidebar>

      {/* Área de contenido central */}
      <main className="flex-1 p-3 md:p-4 surface-ground">
        <Outlet />
      </main>
    </div>
  );
};
