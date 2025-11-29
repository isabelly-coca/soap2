// src/pages/NotificacaoPage.jsx
import React, { useEffect, useState } from "react";
import verificarVencimentos from "../utils/verificarVencimentos";
import "../styles/NotificacaoPage.css";

export default function NotificacaoPage() {
  const [vencidas, setVencidas] = useState([]);
  const [proximas, setProximas] = useState([]);

  useEffect(() => {
    // Lê as tarefas do localStorage
    const tarefasRaw = localStorage.getItem("tarefas");
    let tarefas = [];

    try {
      tarefas = JSON.parse(tarefasRaw);
      // Se estiver no formato { tarefas: [...] }, pega o array
      if (!Array.isArray(tarefas) && tarefas.tarefas) {
        tarefas = tarefas.tarefas;
      }
      if (!Array.isArray(tarefas)) tarefas = [];
    } catch {
      tarefas = [];
    }

    const { vencidas, proximas } = verificarVencimentos(tarefas);
    setVencidas(vencidas);
    setProximas(proximas);
  }, []);

  // Função para formatar datas DD/MM/YYYY
  const formatarDataBR = (dataStr) => {
    if (!dataStr) return "";
    const partes = dataStr.includes("/") ? dataStr.split("/") : dataStr.split("-");
    if (partes.length !== 3) return dataStr;
    // Detecta se é DD/MM/YYYY ou YYYY-MM-DD
    if (dataStr.includes("/")) {
      return dataStr; // já está no formato correto
    } else {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
  };

  return (
    <div className="notificacao-container">
      <h1 className="notificacao-titulo">Notificação</h1>

      <div className="notificacao-section">
        <h2>Tarefas Vencidas</h2>
        {vencidas.length === 0 ? (
          <p>Nenhuma tarefa vencida.</p>
        ) : (
          <ul className="notificacao-lista">
            {vencidas.map((t) => (
              <li className="notificacao-item vencida" key={t.id}>
                <div className="notificacao-info">
                  <span className="titulo">{t.titulo}</span>
                  <span className="data">{formatarDataBR(t.data)}</span>
                </div>
                <span className="alerta-icone">⚠️</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="notificacao-section">
        <h2>Próximas do Vencimento</h2>
        {proximas.length === 0 ? (
          <p>Nenhuma tarefa próxima.</p>
        ) : (
          <ul className="notificacao-lista">
            {proximas.map((t) => (
              <li className="notificacao-item proxima" key={t.id}>
                <div className="notificacao-info">
                  <span className="titulo">{t.titulo}</span>
                  <span className="data">{formatarDataBR(t.data)}</span>
                </div>
                <span className="alerta-icone">⏳</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}




