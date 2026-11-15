import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Ripple } from 'primereact/ripple';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routeConstants';
import { retroAudio } from '../utils/retroSound';
import { PacmanSprite, SpaceShipSprite, SpaceInvaderSprite, GhostSprite } from '../components/RetroSprites';

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
    { label: 'Dashboard', icon: 'pi pi-home', path: ROUTES.DASHBOARD, code: '01' },
    { label: 'Comprar Cartuchos', icon: 'pi pi-shopping-cart', path: ROUTES.COMPRAR, code: '02' },
    { label: 'Rentar Cartuchos', icon: 'pi pi-clock', path: ROUTES.RENTAR, code: '03' },
    { label: 'Catálogo de Juegos', icon: 'pi pi-box', path: ROUTES.PRODUCTOS, code: '04' },
    { label: 'Consolas / Categorías', icon: 'pi pi-tags', path: ROUTES.CATEGORIAS, code: '05' },
    { label: 'Socios / Clientes', icon: 'pi pi-id-card', path: ROUTES.CLIENTES, code: '06' },
    { label: 'Facturas & API', icon: 'pi pi-receipt', path: ROUTES.USERS, code: '07' },
  ];

  const handleNavClick = (path) => {
    retroAudio.playCoin();
    navigate(path);
    setSidebarVisible(false);
  };

  const customHeader = (
    <div className="flex align-items-center gap-3">
      <PacmanSprite size={36} />
      <div>
        <span
          className="block font-bold text-base"
          style={{
            fontFamily: "'Outfit', sans-serif",
            color: '#0284c7',
            letterSpacing: '-0.02em',
          }}
        >
          VIDEO CLUB
        </span>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.8rem',
            color: '#64748b',
            fontWeight: 500,
          }}
        >
          Frutiger Aero Professional
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-column surface-ground">
      {/* Barra superior estilo Aero Glass Ribbon */}
      <header className="retro-topbar px-3 md:px-4 py-2 sticky top-0 z-5 flex justify-content-between align-items-center">
        <div className="flex align-items-center gap-3">
          <Button
            icon="pi pi-bars"
            text
            rounded
            aria-label="Menú Principal"
            onClick={() => {
              retroAudio.playCoin();
              setSidebarVisible((prev) => !prev);
            }}
            tooltip="Menú del Sistema"
            tooltipOptions={{ position: 'bottom' }}
            style={{ color: '#0284c7' }}
          />

          <div
            className="flex align-items-center gap-2 cursor-pointer"
            onClick={() => handleNavClick(ROUTES.DASHBOARD)}
          >
            <SpaceShipSprite size={32} />
            <div className="flex flex-column">
              <span
                className="font-bold"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.15rem',
                  color: '#0369a1',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.1',
                }}
              >
                VIDEO CLUB
              </span>
              <span
                className="text-xs"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  color: '#0ea5e9',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                AERO PROFESSIONAL
              </span>
            </div>
          </div>

          {/* Accesos rápidos superiores tipo Glass Tabs */}
          <div className="hidden lg:flex align-items-center gap-2 ml-3">
            <Button
              label="Comprar"
              icon="pi pi-shopping-cart"
              size="small"
              outlined={location.pathname !== ROUTES.COMPRAR}
              onClick={() => handleNavClick(ROUTES.COMPRAR)}
            />
            <Button
              label="Rentar"
              icon="pi pi-clock"
              size="small"
              outlined={location.pathname !== ROUTES.RENTAR}
              onClick={() => handleNavClick(ROUTES.RENTAR)}
            />
            <Button
              label="Catálogo"
              icon="pi pi-box"
              size="small"
              outlined={location.pathname !== ROUTES.PRODUCTOS}
              onClick={() => handleNavClick(ROUTES.PRODUCTOS)}
            />
            <Button
              label="Consolas"
              icon="pi pi-tags"
              size="small"
              outlined={location.pathname !== ROUTES.CATEGORIAS}
              onClick={() => handleNavClick(ROUTES.CATEGORIAS)}
            />
            <Button
              label="Socios"
              icon="pi pi-id-card"
              size="small"
              outlined={location.pathname !== ROUTES.CLIENTES}
              onClick={() => handleNavClick(ROUTES.CLIENTES)}
            />
            <Button
              label="Facturas"
              icon="pi pi-receipt"
              size="small"
              outlined={location.pathname !== ROUTES.USERS}
              onClick={() => handleNavClick(ROUTES.USERS)}
            />
          </div>
        </div>

        {/* Iconos Aero Decorativos */}
        <div className="hidden xl:flex align-items-center gap-2">
          <GhostSprite size={20} color="#10b981" />
          <SpaceInvaderSprite size={20} color="#06b6d4" />
        </div>

        {/* Perfil del operador y botón de salida */}
        <div className="flex align-items-center gap-2 md:gap-3">
          <div
            className="hidden sm:flex align-items-center gap-2 px-3 py-1 border-round-3xl"
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              border: '1px solid rgba(186, 230, 253, 0.8)',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.08), inset 0 1px 1px #fff',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#0369a1',
            }}
          >
            <span style={{ color: '#0ea5e9' }}>👤 Operador:</span>
            <span>{user?.name || user?.username || 'ADMIN'}</span>
            <span
              className="arcade-blink-text px-2 py-0 border-round-3xl text-xs"
              style={{
                background: '#dcfce7',
                color: '#15803d',
                border: '1px solid #86efac',
                fontWeight: 700,
              }}
            >
              ● ONLINE
            </span>
          </div>

          <Divider layout="vertical" className="hidden sm:inline-flex my-0" />

          <Button
            icon="pi pi-power-off"
            label="Salir"
            severity="danger"
            size="small"
            onClick={handleLogout}
            tooltip="Cerrar Sesión Segura"
            tooltipOptions={{ position: 'bottom' }}
          />
        </div>
      </header>

      {/* Menú lateral Sidebar estilo Aero Frosted Glass */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        header={customHeader}
        className="w-full md:w-22rem"
      >
        <div className="flex flex-column justify-content-between h-full pt-2">
          <div className="flex flex-column gap-2">
            {/* Indicador de Estado del Sistema */}
            <div
              className="px-3 py-2 border-round-xl mb-3 flex justify-content-between align-items-center"
              style={{
                background: 'linear-gradient(135deg, rgba(224, 242, 254, 0.7) 0%, rgba(240, 249, 255, 0.7) 100%)',
                border: '1px solid rgba(186, 230, 253, 0.9)',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.08)',
              }}
            >
              <div className="flex align-items-center gap-2">
                <PacmanSprite size={20} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0369a1' }}>
                  Terminal POS Activa
                </span>
              </div>
              <span
                className="px-2 py-0 border-round-3xl text-xs"
                style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  fontWeight: 700,
                }}
              >
                Conectado
              </span>
            </div>

            <ul className="list-none p-0 m-0">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.label} className="mb-2">
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.path)}
                      className="p-ripple flex align-items-center w-full p-3 border-round-xl border-none text-left cursor-pointer transition-all transition-duration-150"
                      style={{
                        background: isActive
                          ? 'linear-gradient(180deg, #38bdf8 0%, #0ea5e9 45%, #0284c7 100%)'
                          : 'rgba(255, 255, 255, 0.6)',
                        border: isActive
                          ? '1px solid #0284c7'
                          : '1px solid rgba(226, 232, 240, 0.8)',
                        boxShadow: isActive
                          ? '0 6px 16px rgba(2, 132, 199, 0.35), inset 0 1px 1px rgba(255,255,255,0.8)'
                          : '0 1px 3px rgba(0, 0, 0, 0.03)',
                        color: isActive ? '#ffffff' : '#334155',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: '0.9rem',
                      }}
                    >
                      <i
                        className={`${item.icon} mr-3 text-lg`}
                        style={{ color: isActive ? '#ffffff' : '#0284c7' }}
                      />
                      <span className="flex-1">{item.label}</span>
                      {isActive && <i className="pi pi-chevron-right text-xs" />}
                      <Ripple />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border-top-1 surface-border pt-3">
            <div
              className="p-3 border-round-xl mb-3"
              style={{
                background: 'rgba(240, 249, 255, 0.75)',
                border: '1px solid rgba(186, 230, 253, 0.8)',
              }}
            >
              <div
                className="flex align-items-center gap-2 mb-1"
                style={{ color: '#0369a1', fontWeight: 700, fontSize: '0.9rem' }}
              >
                <SpaceShipSprite size={18} />
                <span>VIDEO CLUB AERO</span>
              </div>
              <p className="m-0 text-xs" style={{ color: '#64748b', lineHeight: 1.4 }}>
                Gestión de inventario de cartuchos, ventas, cobros y devoluciones.
              </p>
            </div>
            <Button
              label="Cerrar Sesión"
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
