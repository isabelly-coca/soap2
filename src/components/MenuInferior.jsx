import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckSquare, Calendar } from "lucide-react";
import "../styles/MenuInferior.css";

export default function MenuInferior() {
  const location = useLocation();

  // Estado do usuário
  const [fotoPerfil, setFotoPerfil] = useState(
    "https://i.imgur.com/Z9bV8iB.png" // Foto padrão
  );

  // Buscar a foto do localStorage
  useEffect(() => {
    const dadosUsuario = localStorage.getItem("usuario");

    if (dadosUsuario) {
      try {
        const user = JSON.parse(dadosUsuario);

        if (user.fotoUrl) {
          setFotoPerfil(user.fotoUrl);
        }
      } catch (error) {
        console.error("Erro ao carregar foto do usuário:", error);
      }
    }
  }, []);

  return (
    <div className="footer-menu">
      
      {/* ITEM TAREFAS */}
      <div className={`footer-item ${location.pathname === "/tarefas" ? "ativo" : ""}`}>
        <Link to="/tarefas" className="footer-link">
          <CheckSquare className="footer-icon" size={24} />
          <span>TAREFAS</span>
        </Link>
      </div>

      {/* ITEM CALENDÁRIO */}
      <div className={`footer-item ${location.pathname === "/calendario-page" ? "ativo" : ""}`}>
        <Link to="/calendario-page" className="footer-link">
          <Calendar className="footer-icon" size={24} />
          <span>CALENDÁRIO</span>
        </Link>
      </div>

      {/* ITEM PERFIL */}
      <Link to="/perfil-page" className="footer-item">
        <img
          src={fotoPerfil}
          alt="Perfil"
          className="perfil-icon"
        />
      </Link>
    </div>
  );
}
