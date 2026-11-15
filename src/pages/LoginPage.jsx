import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routeConstants';
import { retroAudio } from '../utils/retroSound';
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
    setSoundEnabled(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (soundEnabled) retroAudio.playCoin();

    const result = await login(username, password);

    if (result.success) {
      if (soundEnabled) retroAudio.playVictory();
      toastRef.current?.show({
        severity: 'success',
        summary: '★ LEVEL 1 UNLOCKED ★',
        detail: 'Acceso autorizado. Cargando mapa de juego...',
        life: 1500,
      });
      setTimeout(() => {
        navigate(ROUTES.DASHBOARD);
      }, 700);
    } else {
      if (soundEnabled) retroAudio.playError();
      toastRef.current?.show({
        severity: 'error',
        summary: 'GAME OVER',
        detail: result.message || 'Credenciales no reconocidas',
        life: 4000,
      });
    }
  };

  return (
    <div className="retro-wrapper">
      <Toast ref={toastRef} position="top-right" />

      {/* CRT Scanline Filter & Ambient Elements */}
      <div className="retro-scanlines" />
      <div className="retro-sun" />
      <div className="retro-grid-floor" />

      {/* Sound Toggle Floating Button */}
      <div className="absolute top-0 right-0 p-3 z-5">
        <button
          type="button"
          onClick={toggleSound}
          title={soundEnabled ? 'Silenciar Efectos 8-Bit' : 'Activar Sonidos 8-Bit'}
          style={{
            background: 'rgba(14, 6, 31, 0.85)',
            border: '2px solid #00ffcc',
            color: soundEnabled ? '#ffe600' : '#888',
            fontFamily: "'VT323', monospace",
            fontSize: '1.2rem',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(0, 255, 204, 0.4)',
          }}
        >
          {soundEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF'}
        </button>
      </div>

      {/* Arcade Cabinet Screen */}
      <div className="arcade-box">
        {/* HUD Superior estilo Arcade */}
        <div className="arcade-hud">
          <div className="arcade-hud-item">
            1UP <span>009940</span>
          </div>
          <div className="arcade-hud-item">
            HIGH <span>999990</span>
          </div>
          <div className="arcade-hud-item">
            LIVES <span className="pixel-heart">♥♥♥</span>
          </div>
        </div>

        {/* Título Principal */}
        <div className="text-center mb-3">
          <div className="inline-block mb-1">
            <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 0 10px #ff007f)' }}>
              📼
            </span>
          </div>
          <h1 className="arcade-title">VIDEO CLUB</h1>
          <div className="arcade-subtitle">RETRO EDITION v1.0</div>
          <div
            className="retro-blink mt-2"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '0.65rem',
              color: '#00ffcc',
              letterSpacing: '1px',
            }}
          >
            ▶ PRESS START TO PLAY ◀
          </div>
        </div>

        {/* Formulario de Login */}
        <form onSubmit={handleSubmit} className="mt-3">
          {/* Campo Usuario */}
          <div className="arcade-input-group">
            <label className="arcade-label" htmlFor="arcadeUser">
              &gt; PLAYER NAME [USUARIO]
            </label>
            <InputText
              id="arcadeUser"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="PLAYER_1"
              className="arcade-input"
              autoComplete="username"
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div className="arcade-input-group">
            <label className="arcade-label" htmlFor="arcadePass">
              &gt; SECRET CODE [CONTRASEÑA]
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
            {/* Indicador de acceso restringido */}
            <div className="arcade-badge-dummy">
              <span>🔒</span>
              <span>ACCESO RESTRINGIDO: IDENTIFÍCATE PARA JUGAR</span>
            </div>
          </div>

          {/* Botón Arcade 3D */}
          <button
            type="submit"
            disabled={isLoading}
            className="arcade-btn-start"
            onMouseEnter={() => soundEnabled && retroAudio.playCoin()}
          >
            {isLoading ? 'LOADING LEVEL...' : '🎮 INSERT COIN / PUSH START'}
          </button>
        </form>

        {/* Footer del Arcade */}
        <div className="arcade-footer">
          <div>
            <span>STAGE: </span>
            <strong style={{ color: '#ffe600' }}>SPRING-BOOT:8080</strong>
          </div>
          <div>
            <span style={{ color: '#00ffcc' }}>CREDITS: 01</span>
          </div>
        </div>
      </div>
    </div>
  );
};
