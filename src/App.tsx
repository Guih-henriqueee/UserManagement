import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import UsuariosPage from '@/pages/usuarios/UsuariosPage';
import DepartamentosPage from '@/pages/departamentos/DepartamentosPage';
import SistemasPage from '@/pages/sistemas/SistemasPage';
import ContratosPage from '@/pages/contratos/ContratosPage';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="saas-theme">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/departamentos" element={<DepartamentosPage />} />
            <Route path="/sistemas" element={<SistemasPage />} />
            <Route path="/contratos" element={<ContratosPage />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
