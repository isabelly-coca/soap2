import React, { useState, useEffect, useRef } from "react";
import { Filter, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/MenuSuperior.css";
import { verificarVencimentos } from "../logic/verificarVencimentos";

export default function MenuSuperior() {
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [qtdNotificacao, setQtdNotificacao] = useState(0);
  const filtroRef = useRef(null);

  const handleFiltroClick = () => setMostrarFiltro(prev => !prev);

  // Carrega quantidade de notificações
  useEffect(() => {
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

    const { vencidas, proximas } = verificarVencimentos(tarefas);

    setQtdNotificacao(vencidas.length + proximas.length);
  }, []);

  // Fechar filtro ao clicar fora
  useEffect(() => {
    const handleClickFora = (e) => {
      if (filtroRef.current && !filtroRef.current.contains(e.target)) {
        setMostrarFiltro(false);
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  return (
    <header className="menu-superior-container">
      
      {/* BOTÃO DO FILTRO */}
      <div style={{ position: "relative" }}>
        <button className="menu-icon-btn filtro-btn" onClick={handleFiltroClick}>
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

      {/* BOTÃO DO SINO + BADGE */}
      <Link to="/notificacao" className="menu-icon-btn notificacao-btn">
        <Bell size={24} />

        {qtdNotificacao > 0 && (
          <span className="notificacao-badge pulse">
            {qtdNotificacao}
          </span>
        )}
      </Link>
    </header>
  );
}


