// src/components/MenuSuperior.jsx
import React, { useState, useEffect, useRef } from "react";
import { Filter, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/MenuSuperior.css";
import verificarVencimentos from "../utils/verificarVencimentos";

export default function MenuSuperior({ setFiltro, categorias }) {
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [qtdNotificacao, setQtdNotificacao] = useState(0);

  // Estados dos filtros
  const [categoria, setCategoria] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [data, setData] = useState("");

  const filtroRef = useRef(null);

  const handleFiltroClick = () => setMostrarFiltro((prev) => !prev);

  // -----------------------------
  // 1. CARREGAR NOTIFICAÇÕES
  // -----------------------------
  useEffect(() => {
    const atualizarNotificacoes = () => {
      let tarefas = [];
      try {
        const dados = JSON.parse(localStorage.getItem("tarefas"));
        tarefas = Array.isArray(dados?.tarefas) ? dados.tarefas : [];
      } catch {
        tarefas = [];
      }

      const { vencidas, proximas } = verificarVencimentos(tarefas);
      setQtdNotificacao(vencidas.length + proximas.length);
    };

    atualizarNotificacoes();
    window.addEventListener("tarefas-atualizadas", atualizarNotificacoes);

    return () =>
      window.removeEventListener("tarefas-atualizadas", atualizarNotificacoes);
  }, []);

  // -----------------------------
  // 2. FECHAR FILTRO AO CLICAR FORA
  // -----------------------------
  useEffect(() => {
    const handleClickFora = (e) => {
      if (filtroRef.current && !filtroRef.current.contains(e.target)) {
        setMostrarFiltro(false);
      }
    };

    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  // -----------------------------
  // 3. APLICAR FILTRO
  // -----------------------------
  const aplicarFiltro = () => {
    const filtros = { categoria, prioridade, data };

    localStorage.setItem("filtros", JSON.stringify(filtros));

    if (setFiltro) setFiltro(filtros);

    setMostrarFiltro(false);

    window.dispatchEvent(new Event("filtros-atualizados"));
  };

  // -----------------------------
  // 4. LIMPAR FILTRO
  // -----------------------------
  const limparFiltro = () => {
    setCategoria("");
    setPrioridade("");
    setData("");

    localStorage.removeItem("filtros");

    if (setFiltro) {
      setFiltro({ categoria: "", prioridade: "", data: "" });
    }

    window.dispatchEvent(new Event("filtros-atualizados"));
    setMostrarFiltro(false);
  };

  return (
    <header className="menu-superior-container">

      {/* ================= BOTÃO DO FILTRO ================= */}
      <div style={{ position: "relative" }}>
        <button className="menu-icon-btn filtro-btn" onClick={handleFiltroClick}>
          <Filter size={24} />
        </button>

        {mostrarFiltro && (
          <div className="filtro-painel" ref={filtroRef}>
            <span className="filtro-titulo">Filtrar tarefas</span>

            {/* CATEGORIA */}
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* PRIORIDADE */}
            <select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
            >
              <option value="">Todas as prioridades</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>

            {/* DATA */}
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />

            {/* APLICAR */}
            <button className="btn-aplicar-filtro" onClick={aplicarFiltro}>
              Aplicar
            </button>

            {/* LIMPAR */}
            <button className="btn-cancelar-filtro" onClick={limparFiltro}>
              Limpar Filtro
            </button>
          </div>
        )}
      </div>

      {/* ================= BOTÃO DO SINO ================= */}
      <Link to="/notificacao" className="menu-icon-btn notificacao-btn">
        <Bell size={24} />
        {qtdNotificacao > 0 && (
          <span className="notificacao-badge pulse">{qtdNotificacao}</span>
        )}
      </Link>
    </header>
  );
}







