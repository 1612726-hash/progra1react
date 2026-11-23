import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routeConstants';
import { retroAudio } from '../utils/retroSound';
import { PacmanSprite, SpaceInvaderSprite } from '../components/RetroSprites';
import '../styles/retroLogin.css';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const toastRef = useRef(null);

  const toggleSound = () => {
    if (!soundEnabled) {
      retroAudio.playCoin();
    }
    setSoundEnabled((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (soundEnabled) retroAudio.playCoin();

    const result = await login(username, password);

    if (result.success) {
      if (soundEnabled) retroAudio.playVictory();
      toastRef.current?.show({
        severity: 'success',
        summary: 'Acceso Autorizado',
        detail: 'Bienvenido a Video Club Aero Professional.',
        life: 2000,
      });
      setTimeout(() => {
        navigate(ROUTES.DASHBOARD);
      }, 700);
    } else {
      if (soundEnabled) retroAudio.playError();
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error de Acceso',
        detail: result.message || 'Credenciales de usuario no válidas',
        life: 4000,
      });
    }
  };

  return (
    <div className="retro-wrapper">
      <Toast ref={toastRef} position="top-right" />

      {/* Burbujas y Destellos Frutiger Aero en el fondo */}
      <div className="aero-bokeh-container">
        <div className="aero-bubble" />
        <div className="aero-bubble" />
        <div className="aero-bubble" />
        <div className="aero-bubble" />
        <div className="aero-bubble" />
      </div>

      {/* Botón Flotante de Audio Cristalino */}
      <div className="absolute top-0 right-0 p-3 z-5">
        <button
          type="button"
          onClick={toggleSound}
          title={soundEnabled ? 'Silenciar Efectos de Sonido' : 'Activar Sonidos Aero'}
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            color: soundEnabled ? '#0284c7' : '#94a3b8',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: '0.85rem',
            padding: '8px 16px',
            borderRadius: '999px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.15)',
            transition: 'all 0.2s ease',
          }}
        >
          {soundEnabled ? '🔔 Sonido: Activado' : '🔕 Sonido: Desactivado'}
        </button>
      </div>

      {/* Contenedor Aero Glassmorphism */}
      <div className="arcade-box">
        {/* HUD Superior / Badge de Estado */}
        <div className="arcade-hud">
          <div className="arcade-hud-item">
            <span>POS PRO</span>
            <span>v2.5</span>
          </div>
          <div className="arcade-hud-item">
            <span style={{ color: '#10b981' }}>●</span>
            <span>SISTEMA ACTIVO</span>
          </div>
          <div className="arcade-hud-item">
            <SpaceInvaderSprite size={16} />
            <span>AERO EDITION</span>
          </div>
        </div>

        {/* Logo y Encabezado Principal */}
        <div className="text-center mb-4">
          <div className="inline-block mb-2">
            <PacmanSprite size={52} />
          </div>
          <h1 className="arcade-title">VIDEO CLUB</h1>
          <p
            className="m-0 mt-1 text-xs"
            style={{ color: '#64748b', fontWeight: 500 }}
          >
            Gestión inteligente de ventas, rentas y catálogo comercial
          </p>
        </div>

        {/* Formulario de Login */}
        <form onSubmit={handleSubmit} className="mt-2">
          {/* Campo Usuario */}
          <div className="arcade-input-group">
            <label className="arcade-label" htmlFor="arcadeUser">
              Usuario de Acceso
            </label>
            <InputText
              id="arcadeUser"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej. admin"
              className="arcade-input"
              autoComplete="username"
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div className="arcade-input-group">
            <label className="arcade-label" htmlFor="arcadePass">
              Contraseña
            </label>
            <Password
              inputId="arcadePass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              toggleMask
              feedback={false}
              className="w-full"
              inputClassName="arcade-input"
              autoComplete="current-password"
            />
            {/* Indicador de seguridad */}
            <div className="arcade-badge-dummy">
              <span>🔒</span>
              <span>Conexión cifrada y segura con el servidor POS</span>
            </div>
          </div>

          {/* Botón Iniciar Sesión Glossy Aqua */}
          <button
            type="submit"
            disabled={isLoading}
            className="arcade-btn-start"
            onMouseEnter={() => soundEnabled && retroAudio.playCoin()}
          >
            {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Footer */}
        <div className="arcade-footer">
          <div>
            <span>SERVIDOR: </span>
            <strong>SPRING-BOOT : 8080</strong>
          </div>
          <div>
            <span style={{ color: '#0284c7' }}>ESTADO: ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
