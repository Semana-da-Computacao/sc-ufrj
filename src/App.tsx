import { ThemeProvider } from "./components/theme-provider";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/geral/HomePage";
import Edicao2025Page from "./pages/edicao-2025";
import Layout from "./components/layout/geral/Layout";
import Layout2025 from "./pages/edicao-2025/layout/Layout2025";
import LoginPage from "./pages/geral/LoginPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/fotos"
            element={<div>Galeria de Fotos - Em breve</div>}
          />
          <Route path="/parceiros" element={<div>Parceiros - Em breve</div>} />
          <Route path="/inscricao" element={<div>Inscrição - Em breve</div>} />
        </Route>

        <Route
          path="/2025"
          element={
            <Layout2025>
              <Edicao2025Page />
            </Layout2025>
          }
        />

        {/* ROTAS DE ADMINISTRAÇÃO */}
        <Route path="/admin" element={<LoginPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
