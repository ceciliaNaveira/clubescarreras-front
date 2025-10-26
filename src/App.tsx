// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer"
import { HomePage } from "./pages/HomePage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Clubs } from "./pages/Clubs";
import { ClubDetail } from "./pages/ClubDetail";
import { Races } from "./pages/Races";
import { RaceDetail } from "./pages/RaceDetail";
import { AdminClubs } from "./pages/Admin/AdminClubs";
import { AdminEditClubForm } from "./pages/Admin/AdminEditClubForm";
import { AdminNuevoClubForm } from "./pages/Admin/AdminNuevoClubForm";
import { AdminCarreras } from "./pages/Admin/AdminCarreras";
import { AdminCarrerasForm } from "./pages/Admin/AdminCarrerasForm";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/clubs/:id" element={<ClubDetail />} />
        <Route path="/races" element={<Races />} />
        <Route path="/races/:id" element={<RaceDetail />} />
        
        {/* Admin clubes */}
        <Route path="/admin/clubs" element={<AdminClubs />} />
        <Route path="/admin/clubs/nuevo" element={<AdminNuevoClubForm />} /> {/* Formulario de creación */}
        <Route path="/admin/clubs/editar/:idClub" element={<AdminEditClubForm />} /> {/* Formulario de edición */}

        {/* Admin carreras */}
        <Route path="/admin/carreras" element={<AdminCarreras />} />
        <Route path="/admin/carreras/nueva" element={<AdminCarrerasForm />} />
        <Route path="/admin/carreras/editar/:idCarrera" element={<AdminCarrerasForm />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
