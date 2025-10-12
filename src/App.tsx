// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Clubs } from "./pages/Clubs";
import { ClubDetail } from "./pages/ClubDetail";
import { Races } from "./pages/Races";
import { RaceDetail } from "./pages/RaceDetail";

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
      </Routes>
    </Router>
  );
}

export default App;


