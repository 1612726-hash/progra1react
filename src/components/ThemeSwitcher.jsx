import { InputSwitch } from 'primereact/inputswitch';
import { useTheme } from '../hooks/useTheme';

export const ThemeSwitcher = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`flex align-items-center gap-2 ${className}`}>
      <i
        className={`pi pi-sun ${!isDarkMode ? 'text-yellow-500 font-bold' : 'text-color-secondary'}`}
        style={{ fontSize: '1.1rem' }}
        title="Modo Claro"
      />
      <InputSwitch
        checked={isDarkMode}
        onChange={toggleTheme}
        aria-label="Alternar tema claro y oscuro"
      />
      <i
        className={`pi pi-moon ${isDarkMode ? 'text-primary font-bold' : 'text-color-secondary'}`}
        style={{ fontSize: '1.1rem' }}
        title="Modo Oscuro"
      />
    </div>
  );
};
