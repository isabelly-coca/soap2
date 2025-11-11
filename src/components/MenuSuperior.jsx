import React, { useState, useRef, useEffect } from "react";
import { Filter, Bell } from "lucide-react";
import "../styles/MenuSuperior.css";

export default function MenuSuperior() {
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const filtroRef = useRef(null);

  const handleFiltroClick = () => setMostrarFiltro((prev) => !prev);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickFora = (e) => {
      if (filtroRef.current && !filtroRef.current.contains(e.target)) {
        setMostrarFiltro(false);
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const handleNotificacaoClick = () => {
    console.log("Sino clicado!");
  };

  return (
    <header className="menu-superior-container">
      {/* Botão de filtro */}
      <div style={{ position: "relative" }}>
        <button
          className="menu-icon-btn filtro-btn"
          onClick={handleFiltroClick}
          aria-label="Filtro"
        >
          <Filter size={24} />
        </button>

        {mostrarFiltro && (
          <div className="filtro-painel" ref={filtroRef}>
            <span className="filtro-titulo">Filtrar tarefas</span>

            <select>
              <option value="">Todas as categorias</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Estudos">Estudos</option>
              <option value="Pessoal">Pessoal</option>
            </select>

            <select>
              <option value="">Todas as prioridades</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>

            <input type="date" />

            <button className="btn-aplicar-filtro">Aplicar</button>
          </div>
        )}
      </div>

      {/* Botão de notificações */}
      <button
        className="menu-icon-btn notificacao-btn"
        onClick={handleNotificacaoClick}
        aria-label="Notificações"
      >
        <Bell size={24} />
      </button>
    </header>
  );
}

