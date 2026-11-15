import { BrowserRouter } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <PrimeReactProvider value={{ ripple: true }}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </PrimeReactProvider>
  );
}

export default App;
