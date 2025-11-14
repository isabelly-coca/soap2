import React, { useEffect, useState } from "react";
import { verificarVencimentos } from "../logic/verificarVencimentos";
import "../styles/NotificacaoPage.css";

export default function NotificacaoPage() {
  const [vencidas, setVencidas] = useState([]);
  const [proximas, setProximas] = useState([]);

  useEffect(() => {
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    const { vencidas, proximas } = verificarVencimentos(tarefas);
    setVencidas(vencidas);
    setProximas(proximas);
  }, []);

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
                  <span className="data">
                    {new Date(t.data).toLocaleDateString("pt-BR")}
                  </span>
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
                  <span className="data">
                    {new Date(t.data).toLocaleDateString("pt-BR")}
                  </span>
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


