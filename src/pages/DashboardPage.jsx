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

// Promociones publicitarias destacadas de cartuchos retro
const PROMO_GAMES = [
  {
    id: 1,
    title: 'SUPER MARIO 16-BIT QUEST',
    console: 'SNES / SUPER NINTENDO',
    badge: 'ESTRENO DEL MES',
    badgeColor: 'warning',
    headline: '¡LA MAYOR AVENTURA DEL FONTANERO EN TU TELEVISOR!',
    description: 'Nuevos mundos secretos, capa voladora, y por primera vez monta al dinosaurio Yoshi. ¡Revive la magia de los 16-bits!',
    rating: '★★★★★ 10/10',
    salePrice: '$29.99',
    rentPrice: '$2.00 / día',
    promoDeal: '🔥 PROMO 3x2: Renta 3 días y paga solo 2',
    cartridgeColor: '#FF007F',
    iconType: 'mario',
  },
  {
    id: 2,
    title: 'ZELDA: A LINK TO THE PAST',
    console: 'SNES / 16-BIT CLASSIC',
    badge: 'OBRA MAESTRA',
    badgeColor: 'success',
    headline: 'UNA AVENTURA ÉPICA QUE DEFINIÓ A UNA GENERACIÓN',
    description: 'Viaja entre el Mundo de la Luz y el Mundo de la Oscuridad con la Espada Maestra para rescatar a las 7 doncellas.',
    rating: '★★★★★ 10/10',
    salePrice: '$34.99',
    rentPrice: '$2.50 / día',
    promoDeal: '⚡ FIN DE SEMANA RPG: Renta de viernes a lunes por $5.00',
    cartridgeColor: '#FFE600',
    iconType: 'zelda',
  },
  {
    id: 3,
    title: 'SPACE INVADERS & GALAGA DELUXE',
    console: 'ARCADE VAULT / NES',
    badge: 'CLÁSICO INMORTAL',
    badgeColor: 'info',
    headline: '¡DEFIENDE LA TIERRA CONTRA LAS HORDAS ALIENÍGENAS!',
    description: 'La experiencia definitiva de disparos espaciales. Reflejos rápidos, oleadas infinitas y puntuaciones de récord.',
    rating: '★★★★★ 9.8/10',
    salePrice: '$19.99',
    rentPrice: '$1.50 / día',
    promoDeal: '👾 DESCUENTO FLASH: -25% en compra de cartucho',
    cartridgeColor: '#00FFCC',
    iconType: 'ship',
  },
  {
    id: 4,
    title: 'PAC-MANIA: LABERINTO CYBER',
    console: 'ARCADE CLASSIC / SEGA',
    badge: 'TOP 1 RENTAS',
    badgeColor: 'warning',
    headline: '¡COME PUNTOS, ESQUIVA FANTASMAS Y GANA PREMIOS!',
    description: 'El clásico devorador de laberintos con perspectiva isométrica. ¡No dejes que Blinky y Clyde te alcancen!',
    rating: '★★★★★ 9.9/10',
    salePrice: '$21.99',
    rentPrice: '$1.50 / día',
    promoDeal: '🟡 PROMO 24 HORAS: Renta por solo $1.00 hoy',
    cartridgeColor: '#FFE600',
    iconType: 'pacman',
  },
  {
    id: 5,
    title: 'STREET FIGHTER II: TURBO',
    console: 'CAPCOM / SNES 16-BIT',
    badge: 'TORNEO 2 PLAYERS',
    badgeColor: 'danger',
    headline: '¡HADOUKEN! EL REY DE LOS COMBATES LLEGA AL SALÓN',
    description: '12 guerreros mundiales, velocidad turbo x4 y combos legendarios. Renta dos controles y reta a tus amigos.',
    rating: '★★★★★ 10/10',
    salePrice: '$27.99',
    rentPrice: '$2.00 / día',
    promoDeal: '🥊 COMBO VERSUS: Renta el juego + control extra gratis',
    cartridgeColor: '#FF007F',
    iconType: 'fighter',
  },
  {
    id: 6,
    title: 'SONIC THE HEDGEHOG 2',
    console: 'SEGA GENESIS / MEGA DRIVE',
    badge: 'VELOCIDAD PURA',
    badgeColor: 'info',
    headline: '¡SEGA HACE LO QUE NINTENDON\'T! VELOCIDAD TOTAL',
    description: 'Corre a la velocidad de la luz junto a Tails para detener los planes del malvado Dr. Robotnik en las zonas secretas.',
    rating: '★★★★★ 9.9/10',
    salePrice: '$24.99',
    rentPrice: '$1.80 / día',
    promoDeal: '🌀 EDICIÓN COMPLETA: Cartucho original + póster retro',
    cartridgeColor: '#00FFCC',
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
      {/* 🚀 GRAN MARQUESINA PUBLICITARIA HERO ESTILO REVISTA NINTENDO POWER / SEGA */}
      <div
        className="surface-card border-round p-4 md:p-5 relative overflow-hidden"
        style={{
          border: '3px solid #FFE600',
          boxShadow: '0 0 25px rgba(255, 230, 0, 0.4), inset 0 0 20px rgba(255, 0, 127, 0.25)',
          background: 'radial-gradient(ellipse at 80% 20%, #3d0d5e 0%, #170533 50%, #090217 100%)',
        }}
      >
        <div className="grid align-items-center">
          <div className="col-12 lg:col-8 z-2">
            <div className="flex align-items-center gap-2 mb-2">
              <span className="arcade-blink-text" style={{ fontSize: '1.2rem' }}>🔥</span>
              <span
                className="arcade-font-pixel text-xs px-2 py-1 border-round"
                style={{ background: '#FF007F', color: '#FFF', letterSpacing: '1px' }}
              >
                PROMO ESTRELLA DEL VIDEO CLUB
              </span>
              <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.3rem', color: '#00FFCC' }}>
                EDICIÓN LIMITADA 16-BITS
              </span>
            </div>

            <h1
              className="arcade-font-pixel text-2xl md:text-3xl m-0 mb-3"
              style={{
                color: '#FFE600',
                textShadow: '3px 3px 0 #FF007F, -1px -1px 0 #00FFCC',
                lineHeight: '1.3',
              }}
            >
              ¡REVIVE LA GLORIA DE LOS CARTUCHOS CLÁSICOS!
            </h1>

            <p
              className="m-0 mb-4"
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: '1.45rem',
                color: '#E0D5FF',
                lineHeight: '1.4',
                maxWidth: '650px',
              }}
            >
              Renta tus títulos favoritos desde <strong style={{ color: '#00FFCC' }}>$1.50/día</strong> o cómpralos para tu colección personal.
              ¡Disfruta los fines de semana con la promo <strong>3x2 en alquiler de juegos</strong>!
            </p>

            <div className="flex flex-wrap gap-3 align-items-center">
              <Button
                label="🛒 COMPRAR CARTUCHOS"
                icon="pi pi-shopping-cart"
                size="large"
                onClick={() => handleAction(ROUTES.COMPRAR)}
              />
              <Button
                label="🕹️ RENTAR POR DÍA"
                icon="pi pi-clock"
                size="large"
                outlined
                onClick={() => handleAction(ROUTES.RENTAR)}
              />
              <Button
                label="📦 VER TODO EL CATÁLOGO"
                icon="pi pi-box"
                size="large"
                text
                onClick={() => handleAction(ROUTES.PRODUCTOS)}
              />
            </div>
          </div>

          {/* Ilustraciones gigantes de videojuegos y naves */}
          <div className="col-12 lg:col-4 text-center z-2 mt-4 lg:mt-0">
            <div
              className="p-4 border-round inline-block"
              style={{
                background: 'rgba(10, 3, 25, 0.85)',
                border: '2px dashed #00FFCC',
                boxShadow: '0 0 20px rgba(0, 255, 204, 0.4)',
              }}
            >
              <div className="flex justify-content-center align-items-center gap-3 mb-2">
                <SpaceShipSprite size={48} />
                <CartridgeSprite size={60} color="#FFE600" />
                <PacmanSprite size={48} />
              </div>

              <div
                className="arcade-font-pixel text-xs mt-2"
                style={{ color: '#FFE600', letterSpacing: '1px' }}
              >
                100% ORIGINALES
              </div>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: '1.25rem', color: '#00FFCC' }}>
                NES • SNES • SEGA • N64 • GAME BOY
              </div>

              <div className="flex justify-content-center gap-2 mt-2">
                <GhostSprite size={26} color="#FF0000" />
                <GhostSprite size={26} color="#00FFCC" />
                <GhostSprite size={26} color="#FF007F" />
                <SpaceInvaderSprite size={26} color="#39FF14" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 💥 BANNERS DE PROMOCIONES ESPECIALES (TICKETS DE OFERTA) */}
      <div className="grid">
        <div className="col-12 md:col-4">
          <Card
            className="h-full"
            style={{
              border: '2px solid #39FF14',
              boxShadow: '0 0 15px rgba(57, 255, 20, 0.3)',
            }}
          >
            <div className="flex align-items-center gap-2 mb-2">
              <span style={{ fontSize: '1.5rem' }}>🎁</span>
              <span className="arcade-font-pixel text-xs" style={{ color: '#39FF14' }}>
                PROMO FIN DE SEMANA
              </span>
            </div>
            <h3 className="arcade-font-pixel text-sm mb-2" style={{ color: '#FFE600' }}>
              RENTAS 3x2 VIERNES A DOMINGO
            </h3>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: '1.25rem', color: '#E0D5FF', margin: '0 0 1rem 0' }}>
              Elige 3 cartuchos cualesquiera para todo el fin de semana y paga solo 2. ¡Válido en todo el catálogo!
            </p>
            <Button
              label="APROVECHAR 3x2"
              icon="pi pi-arrow-right"
              size="small"
              className="w-full"
              onClick={() => handleAction(ROUTES.RENTAR)}
            />
          </Card>
        </div>

        <div className="col-12 md:col-4">
          <Card
            className="h-full"
            style={{
              border: '2px solid #FF007F',
              boxShadow: '0 0 15px rgba(255, 0, 127, 0.3)',
            }}
          >
            <div className="flex align-items-center gap-2 mb-2">
              <span style={{ fontSize: '1.5rem' }}>⭐</span>
              <span className="arcade-font-pixel text-xs" style={{ color: '#FF007F' }}>
                CLUB SOCIO VIP
              </span>
            </div>
            <h3 className="arcade-font-pixel text-sm mb-2" style={{ color: '#FFE600' }}>
              PASE MENSUAL ILIMITADO
            </h3>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: '1.25rem', color: '#E0D5FF', margin: '0 0 1rem 0' }}>
              Por solo $14.99/mes, renta hasta 4 cartuchos simultáneos sin límite de días ni recargos por demora.
            </p>
            <Button
              label="REGISTRAR SOCIO"
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
            className="h-full"
            style={{
              border: '2px solid #00FFCC',
              boxShadow: '0 0 15px rgba(0, 255, 204, 0.3)',
            }}
          >
            <div className="flex align-items-center gap-2 mb-2">
              <span style={{ fontSize: '1.5rem' }}>🪙</span>
              <span className="arcade-font-pixel text-xs" style={{ color: '#00FFCC' }}>
                VENTA LIQUIDACIÓN
              </span>
            </div>
            <h3 className="arcade-font-pixel text-sm mb-2" style={{ color: '#FFE600' }}>
              HASTA -40% EN COMPRAS
            </h3>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: '1.25rem', color: '#E0D5FF', margin: '0 0 1rem 0' }}>
              Llévate cartuchos retro clásicos listos para jugar desde $9.99 con garantía de funcionamiento total.
            </p>
            <Button
              label="VER OFERTAS"
              icon="pi pi-shopping-bag"
              size="small"
              className="w-full"
              onClick={() => handleAction(ROUTES.COMPRAR)}
            />
          </Card>
        </div>
      </div>

      {/* 🎮 CATÁLOGO DE PUBLICIDADES Y CARTUCHOS DESTACADOS */}
      <div className="surface-card border-round p-3 flex justify-content-between align-items-center flex-wrap gap-2">
        <div className="flex align-items-center gap-2">
          <span style={{ fontSize: '1.5rem' }}>📺</span>
          <span className="arcade-font-pixel text-sm" style={{ color: '#FFE600' }}>
            PUBLICIDADES Y CARTUCHOS DESTACADOS
          </span>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            label="TODOS"
            size="small"
            outlined={filterCategory !== 'ALL'}
            onClick={() => setFilterCategory('ALL')}
          />
          <Button
            label="SNES 16-BIT"
            size="small"
            outlined={filterCategory !== 'SNES'}
            onClick={() => setFilterCategory('SNES')}
          />
          <Button
            label="ARCADE"
            size="small"
            outlined={filterCategory !== 'ARCADE'}
            onClick={() => setFilterCategory('ARCADE')}
          />
          <Button
            label="SEGA"
            size="small"
            outlined={filterCategory !== 'SEGA'}
            onClick={() => setFilterCategory('SEGA')}
          />
        </div>
      </div>

      {/* Grid de Posters y Anuncios de Cartuchos */}
      <div className="grid">
        {PROMO_GAMES.filter((g) => {
          if (filterCategory === 'ALL') return true;
          return g.console.includes(filterCategory);
        }).map((game) => (
          <div key={game.id} className="col-12 lg:col-6">
            <Card
              className="h-full transition-transform transition-duration-150 hover:scale-101"
              style={{
                border: '2px solid rgba(0, 255, 204, 0.5)',
                background: 'linear-gradient(135deg, rgba(25, 8, 52, 0.95) 0%, rgba(10, 3, 24, 0.95) 100%)',
              }}
            >
              <div className="flex flex-column sm:flex-row gap-4 align-items-start">
                {/* Ilustración o sprite del cartucho */}
                <div
                  className="flex flex-column align-items-center justify-content-center p-3 border-round w-full sm:w-10rem"
                  style={{
                    background: 'rgba(8, 2, 20, 0.9)',
                    border: `2px solid ${game.cartridgeColor}`,
                    boxShadow: `0 0 15px ${game.cartridgeColor}44`,
                  }}
                >
                  <CartridgeSprite size={70} color={game.cartridgeColor} />

                  <div className="mt-2 flex align-items-center gap-1">
                    {game.iconType === 'ship' && <SpaceShipSprite size={24} />}
                    {game.iconType === 'pacman' && <PacmanSprite size={24} />}
                    {game.iconType === 'mario' && <span style={{ fontSize: '1.4rem' }}>🍄</span>}
                    {game.iconType === 'zelda' && <span style={{ fontSize: '1.4rem' }}>⚔️</span>}
                    {game.iconType === 'fighter' && <span style={{ fontSize: '1.4rem' }}>🥊</span>}
                    {game.iconType === 'sonic' && <span style={{ fontSize: '1.4rem' }}>🌀</span>}
                  </div>

                  <span
                    className="mt-2 text-center text-xs"
                    style={{ fontFamily: "'Press Start 2P', monospace", color: '#FFE600', fontSize: '0.52rem' }}
                  >
                    {game.console}
                  </span>
                </div>

                {/* Contenido publicitario del juego */}
                <div className="flex-1 flex flex-column justify-content-between h-full">
                  <div>
                    <div className="flex justify-content-between align-items-center gap-2 mb-2">
                      <Tag severity={game.badgeColor} value={game.badge} />
                      <span style={{ fontFamily: "'VT323', monospace", fontSize: '1.2rem', color: '#FFE600' }}>
                        {game.rating}
                      </span>
                    </div>

                    <h3
                      className="arcade-font-pixel text-base m-0 mb-1"
                      style={{ color: '#FFE600', textShadow: '1px 1px 0 #FF007F' }}
                    >
                      {game.title}
                    </h3>

                    <h4
                      className="m-0 mb-2"
                      style={{ fontFamily: "'VT323', monospace", fontSize: '1.3rem', color: '#00FFCC' }}
                    >
                      {game.headline}
                    </h4>

                    <p
                      className="m-0 mb-3"
                      style={{ fontFamily: "'VT323', monospace", fontSize: '1.2rem', color: '#D4C9F0', lineHeight: '1.3' }}
                    >
                      {game.description}
                    </p>
                  </div>

                  {/* Banner de oferta y botones */}
                  <div className="border-top-1 surface-border pt-2 mt-auto">
                    <div
                      className="p-2 border-round mb-3"
                      style={{
                        background: 'rgba(255, 230, 0, 0.1)',
                        border: '1px dashed #FFE600',
                        fontFamily: "'VT323', monospace",
                        fontSize: '1.15rem',
                        color: '#FFE600',
                      }}
                    >
                      {game.promoDeal}
                    </div>

                    <div className="flex justify-content-between align-items-center mb-3">
                      <div>
                        <span className="text-xs block" style={{ fontFamily: "'VT323', monospace", color: '#A89BC9' }}>
                          VENTA CARTUCHO
                        </span>
                        <strong
                          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.9rem', color: '#39FF14' }}
                        >
                          {game.salePrice}
                        </strong>
                      </div>

                      <div className="text-right">
                        <span className="text-xs block" style={{ fontFamily: "'VT323', monospace", color: '#A89BC9' }}>
                          ALQUILER
                        </span>
                        <strong
                          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.9rem', color: '#00FFCC' }}
                        >
                          {game.rentPrice}
                        </strong>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        label="🛒 COMPRAR"
                        icon="pi pi-shopping-cart"
                        size="small"
                        className="flex-1"
                        onClick={() => handleAction(ROUTES.COMPRAR)}
                      />
                      <Button
                        label="🕹️ RENTAR"
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
