import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { ROUTES } from '../constants/routeConstants';
import { retroAudio } from '../utils/retroSound';
import {
  PacmanSprite,
  GhostSprite,
  SpaceShipSprite,
  SpaceInvaderSprite,
  CartridgeSprite,
} from '../components/RetroSprites';

// Títulos y catálogo destacado
const PROMO_GAMES = [
  {
    id: 1,
    title: 'Super Mario 16-Bit Quest',
    console: 'SNES / Super Nintendo',
    badge: 'ESTRENO DESTACADO',
    badgeColor: 'warning',
    headline: 'La mayor aventura clásica en alta definición',
    description: 'Mundos secretos, capa voladora y recorridos clásicos. La cumbre de la época dorada de los 16-bits.',
    rating: '★ 9.9 / 10',
    salePrice: '$29.99',
    rentPrice: '$2.00 / día',
    promoDeal: '✨ PROMO 3x2: Renta 3 días y paga solo 2',
    cartridgeColor: '#0284c7',
    iconType: 'mario',
  },
  {
    id: 2,
    title: 'Zelda: A Link to the Past',
    console: 'SNES / 16-Bit Masterpiece',
    badge: 'OBRA MAESTRA',
    badgeColor: 'success',
    headline: 'Una aventura épica y atemporal',
    description: 'Viaja entre dimensiones para restaurar la paz en Hyrule con la Espada Maestra y objetos legendarios.',
    rating: '★ 10.0 / 10',
    salePrice: '$34.99',
    rentPrice: '$2.50 / día',
    promoDeal: '⚡ FIN DE SEMANA RPG: Renta de viernes a lunes por $5.00',
    cartridgeColor: '#10b981',
    iconType: 'zelda',
  },
  {
    id: 3,
    title: 'Space Invaders & Galaga Deluxe',
    console: 'Arcade Classics / NES',
    badge: 'CLÁSICO INMORTAL',
    badgeColor: 'info',
    headline: 'Defensa planetaria y reflejos puros',
    description: 'La experiencia definitiva de batallas en el espacio sideral. Oleadas infinitas y puntuaciones récord.',
    rating: '★ 9.8 / 10',
    salePrice: '$19.99',
    rentPrice: '$1.50 / día',
    promoDeal: '💎 DESCUENTO ESPECIAL: -20% en compra directa',
    cartridgeColor: '#06b6d4',
    iconType: 'ship',
  },
  {
    id: 4,
    title: 'Pac-Mania: Laberinto Cristalino',
    console: 'Arcade Classic / SEGA',
    badge: 'MÁS ALQUILADO',
    badgeColor: 'warning',
    headline: 'Esquiva fantasmas y consigue gemas de récord',
    description: 'El legendario arcade con perspectiva isométrica y modos de velocidad mejorada para toda la familia.',
    rating: '★ 9.7 / 10',
    salePrice: '$21.99',
    rentPrice: '$1.50 / día',
    promoDeal: '🌟 ALQUILER EXPRESS: Solo $1.00 por 24 horas',
    cartridgeColor: '#f59e0b',
    iconType: 'pacman',
  },
  {
    id: 5,
    title: 'Street Fighter II: Turbo',
    console: 'Capcom / 16-Bit Edition',
    badge: 'TORNEO VERSUS',
    badgeColor: 'danger',
    headline: 'El rey absoluto de las artes marciales',
    description: '12 luchadores mundiales, velocidad de torneo y combos legendarios listos para retar a tus amigos.',
    rating: '★ 9.9 / 10',
    salePrice: '$27.99',
    rentPrice: '$2.00 / día',
    promoDeal: '🥊 COMBO DÚO: Renta el título y llévate mando extra',
    cartridgeColor: '#ef4444',
    iconType: 'fighter',
  },
  {
    id: 6,
    title: 'Sonic the Hedgehog 2',
    console: 'Sega Genesis / Mega Drive',
    badge: 'VELOCIDAD PURA',
    badgeColor: 'info',
    headline: 'Velocidad ultrasónica en mundos cristalinos',
    description: 'Corre a velocidad relámpago con Sonic y Tails para salvar animales y recolectar las gemas del caos.',
    rating: '★ 9.9 / 10',
    salePrice: '$24.99',
    rentPrice: '$1.80 / día',
    promoDeal: '🌀 EDICIÓN COMPLETA: Cartucho original probado',
    cartridgeColor: '#0ea5e9',
    iconType: 'sonic',
  },
];

export const DashboardPage = () => {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const navigate = useNavigate();

  const handleAction = (route) => {
    retroAudio.playCoin();
    navigate(route);
  };

  return (
    <div className="flex flex-column gap-4">
      {/* 🚀 BANNER HERO AERO GLASSMORPHISM */}
      <div
        className="surface-card border-round-3xl p-4 md:p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(224, 242, 254, 0.75) 50%, rgba(186, 230, 253, 0.6) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 20px 45px -10px rgba(2, 132, 199, 0.2), inset 0 1px 2px #fff',
        }}
      >
        <div className="grid align-items-center">
          <div className="col-12 lg:col-8 z-2">
            <div className="flex align-items-center gap-2 mb-3">
              <span className="arcade-blink-text" style={{ fontSize: '1.25rem' }}>✨</span>
              <span
                className="text-xs px-3 py-1 border-round-3xl font-bold"
                style={{
                  background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
                  color: '#FFF',
                  letterSpacing: '0.04em',
                  boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)',
                }}
              >
                TERMINAL POS PROFESIONAL
              </span>
              <span style={{ fontSize: '0.85rem', color: '#0369a1', fontWeight: 600 }}>
                Edición Frutiger Aero
              </span>
            </div>

            <h1
              className="text-3xl md:text-4xl m-0 mb-3"
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: '1.2',
                letterSpacing: '-0.03em',
              }}
            >
              Gestión Integral de Cartuchos, Ventas y Rentas
            </h1>

            <p
              className="m-0 mb-4"
              style={{
                fontSize: '1.05rem',
                color: '#334155',
                lineHeight: '1.6',
                maxWidth: '650px',
              }}
            >
              Controla inventarios con precisión cristalina. Renta títulos clásicos desde{' '}
              <strong style={{ color: '#0284c7' }}>$1.50/día</strong> o realiza ventas directas con
              facturación instantánea y promociones automáticas.
            </p>

            <div className="flex flex-wrap gap-3 align-items-center">
              <Button
                label="Comprar Cartuchos"
                icon="pi pi-shopping-cart"
                size="large"
                onClick={() => handleAction(ROUTES.COMPRAR)}
              />
              <Button
                label="Rentar por Día"
                icon="pi pi-clock"
                size="large"
                outlined
                onClick={() => handleAction(ROUTES.RENTAR)}
              />
              <Button
                label="Ver Catálogo Completo"
                icon="pi pi-box"
                size="large"
                text
                onClick={() => handleAction(ROUTES.PRODUCTOS)}
              />
            </div>
          </div>

          {/* Ilustración de cristal Aero */}
          <div className="col-12 lg:col-4 text-center z-2 mt-4 lg:mt-0">
            <div
              className="p-4 border-round-3xl inline-block"
              style={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 12px 30px rgba(2, 132, 199, 0.15)',
              }}
            >
              <div className="flex justify-content-center align-items-center gap-3 mb-2">
                <SpaceShipSprite size={46} />
                <CartridgeSprite size={60} color="#0284c7" />
                <PacmanSprite size={46} />
              </div>

              <div
                className="font-bold text-sm mt-2"
                style={{ color: '#0369a1', letterSpacing: '0.04em' }}
              >
                100% FUNCIONALES Y PROBADOS
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>
                NES • SNES • SEGA • N64 • GAME BOY
              </div>

              <div className="flex justify-content-center gap-2 mt-3">
                <GhostSprite size={24} color="#10b981" />
                <GhostSprite size={24} color="#06b6d4" />
                <SpaceInvaderSprite size={24} color="#0ea5e9" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 💥 TARJETAS DE PROMOCIONES ESPECIALES */}
      <div className="grid">
        <div className="col-12 md:col-4">
          <Card
            className="h-full border-round-2xl"
            style={{
              background: 'linear-gradient(180deg, rgba(240, 253, 244, 0.8) 0%, rgba(255, 255, 255, 0.8) 100%)',
              border: '1px solid rgba(187, 247, 208, 0.8)',
            }}
          >
            <div className="flex align-items-center gap-2 mb-2">
              <span style={{ fontSize: '1.4rem' }}>🎁</span>
              <span className="text-xs font-bold" style={{ color: '#15803d' }}>
                PROMOCIÓN DE FIN DE SEMANA
              </span>
            </div>
            <h3 className="text-base font-bold mb-2" style={{ color: '#0f172a' }}>
              Rentas 3x2 Viernes a Domingo
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
              Elige 3 cartuchos de cualquier consola para el fin de semana y paga solo 2. Válido en todo el catálogo.
            </p>
            <Button
              label="Aprovechar 3x2"
              icon="pi pi-arrow-right"
              size="small"
              className="w-full p-button-success"
              onClick={() => handleAction(ROUTES.RENTAR)}
            />
          </Card>
        </div>

        <div className="col-12 md:col-4">
          <Card
            className="h-full border-round-2xl"
            style={{
              background: 'linear-gradient(180deg, rgba(240, 249, 255, 0.8) 0%, rgba(255, 255, 255, 0.8) 100%)',
              border: '1px solid rgba(186, 230, 253, 0.8)',
            }}
          >
            <div className="flex align-items-center gap-2 mb-2">
              <span style={{ fontSize: '1.4rem' }}>⭐</span>
              <span className="text-xs font-bold" style={{ color: '#0284c7' }}>
                CLUB SOCIO VIP
              </span>
            </div>
            <h3 className="text-base font-bold mb-2" style={{ color: '#0f172a' }}>
              Pase Mensual Ilimitado
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
              Por solo $14.99/mes, renta hasta 4 cartuchos simultáneos sin límite de días ni penalizaciones por demora.
            </p>
            <Button
              label="Registrar Socio"
              icon="pi pi-user-plus"
              size="small"
              outlined
              className="w-full"
              onClick={() => handleAction(ROUTES.CLIENTES)}
            />
          </Card>
        </div>

        <div className="col-12 md:col-4">
          <Card
            className="h-full border-round-2xl"
            style={{
              background: 'linear-gradient(180deg, rgba(254, 243, 199, 0.7) 0%, rgba(255, 255, 255, 0.8) 100%)',
              border: '1px solid rgba(253, 230, 138, 0.8)',
            }}
          >
            <div className="flex align-items-center gap-2 mb-2">
              <span style={{ fontSize: '1.4rem' }}>💎</span>
              <span className="text-xs font-bold" style={{ color: '#b45309' }}>
                VENTA POR LIQUIDACIÓN
              </span>
            </div>
            <h3 className="text-base font-bold mb-2" style={{ color: '#0f172a' }}>
              Hasta -40% en Compras
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
              Adquiere cartuchos retro clásicos listos para jugar desde $9.99 con garantía total de funcionamiento.
            </p>
            <Button
              label="Ver Ofertas de Compra"
              icon="pi pi-shopping-bag"
              size="small"
              className="w-full"
              onClick={() => handleAction(ROUTES.COMPRAR)}
            />
          </Card>
        </div>
      </div>

      {/* 🎮 FILTRO Y CABECERA DEL CATÁLOGO DESTACADO */}
      <div className="surface-card border-round-2xl p-3 flex justify-content-between align-items-center flex-wrap gap-2">
        <div className="flex align-items-center gap-2">
          <span style={{ fontSize: '1.3rem' }}>🎮</span>
          <span className="font-bold text-sm md:text-base" style={{ color: '#0369a1' }}>
            TÍTULOS Y CARTUCHOS DESTACADOS
          </span>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            label="Todos"
            size="small"
            outlined={filterCategory !== 'ALL'}
            onClick={() => setFilterCategory('ALL')}
          />
          <Button
            label="SNES 16-Bit"
            size="small"
            outlined={filterCategory !== 'SNES'}
            onClick={() => setFilterCategory('SNES')}
          />
          <Button
            label="Arcade"
            size="small"
            outlined={filterCategory !== 'ARCADE'}
            onClick={() => setFilterCategory('ARCADE')}
          />
          <Button
            label="Sega"
            size="small"
            outlined={filterCategory !== 'SEGA'}
            onClick={() => setFilterCategory('SEGA')}
          />
        </div>
      </div>

      {/* Grid de Cartuchos en Estilo Aero Glass */}
      <div className="grid">
        {PROMO_GAMES.filter((g) => {
          if (filterCategory === 'ALL') return true;
          return g.console.includes(filterCategory);
        }).map((game) => (
          <div key={game.id} className="col-12 lg:col-6">
            <Card className="h-full border-round-2xl transition-transform transition-duration-150 hover:scale-101">
              <div className="flex flex-column sm:flex-row gap-4 align-items-start">
                {/* Ilustración cristalina del cartucho */}
                <div
                  className="flex flex-column align-items-center justify-content-center p-3 border-round-2xl w-full sm:w-10rem"
                  style={{
                    background: 'linear-gradient(135deg, rgba(224, 242, 254, 0.7) 0%, rgba(240, 249, 255, 0.7) 100%)',
                    border: '1px solid rgba(186, 230, 253, 0.9)',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.1)',
                  }}
                >
                  <CartridgeSprite size={65} color={game.cartridgeColor} />

                  <div className="mt-2 flex align-items-center gap-1">
                    {game.iconType === 'ship' && <SpaceShipSprite size={22} />}
                    {game.iconType === 'pacman' && <PacmanSprite size={22} />}
                    {game.iconType === 'mario' && <span style={{ fontSize: '1.25rem' }}>🍄</span>}
                    {game.iconType === 'zelda' && <span style={{ fontSize: '1.25rem' }}>⚔️</span>}
                    {game.iconType === 'fighter' && <span style={{ fontSize: '1.25rem' }}>🥊</span>}
                    {game.iconType === 'sonic' && <span style={{ fontSize: '1.25rem' }}>🌀</span>}
                  </div>

                  <span
                    className="mt-2 text-center text-xs font-semibold"
                    style={{ color: '#0369a1' }}
                  >
                    {game.console}
                  </span>
                </div>

                {/* Contenido comercial */}
                <div className="flex-1 flex flex-column justify-content-between h-full">
                  <div>
                    <div className="flex justify-content-between align-items-center gap-2 mb-2">
                      <Tag severity={game.badgeColor} value={game.badge} />
                      <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>
                        {game.rating}
                      </span>
                    </div>

                    <h3
                      className="text-lg font-bold m-0 mb-1"
                      style={{ color: '#0f172a' }}
                    >
                      {game.title}
                    </h3>

                    <h4
                      className="m-0 mb-2 font-semibold text-sm"
                      style={{ color: '#0284c7' }}
                    >
                      {game.headline}
                    </h4>

                    <p
                      className="m-0 mb-3 text-sm"
                      style={{ color: '#64748b', lineHeight: '1.4' }}
                    >
                      {game.description}
                    </p>
                  </div>

                  {/* Banner de oferta y precios */}
                  <div className="border-top-1 surface-border pt-2 mt-auto">
                    <div
                      className="p-2 border-round-xl mb-3 text-xs font-semibold"
                      style={{
                        background: 'rgba(240, 249, 255, 0.8)',
                        border: '1px solid rgba(186, 230, 253, 0.8)',
                        color: '#0369a1',
                      }}
                    >
                      {game.promoDeal}
                    </div>

                    <div className="flex justify-content-between align-items-center mb-3">
                      <div>
                        <span className="text-xs block text-500 font-semibold">
                          PRECIO VENTA
                        </span>
                        <strong
                          style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: '1.25rem',
                            color: '#15803d',
                          }}
                        >
                          {game.salePrice}
                        </strong>
                      </div>

                      <div className="text-right">
                        <span className="text-xs block text-500 font-semibold">
                          ALQUILER DIARIO
                        </span>
                        <strong
                          style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: '1.25rem',
                            color: '#0284c7',
                          }}
                        >
                          {game.rentPrice}
                        </strong>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        label="Comprar"
                        icon="pi pi-shopping-cart"
                        size="small"
                        className="flex-1"
                        onClick={() => handleAction(ROUTES.COMPRAR)}
                      />
                      <Button
                        label="Rentar"
                        icon="pi pi-clock"
                        size="small"
                        outlined
                        className="flex-1"
                        onClick={() => handleAction(ROUTES.RENTAR)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
