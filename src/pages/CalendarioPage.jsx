import React, { useState } from "react";
import { Link } from "react-router-dom";
import MenuInferior from "../components/MenuInferior";
import MenuSuperior from "../components/MenuSuperior";
import "../styles/CalendarioPage.css"; 

export default function CalendarioPage() {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());

  const nomesMeses = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ];

  // Nomes abreviados dos dias da semana (Começando no Domingo: 0)
  const nomesDiasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Dados de exemplo das tarefas (mantido)
  const tarefas = {
    "2025-11-02": ["Revisar e responder e-mails pendentes"],
    "2025-11-03": ["Atualizar planilha de controle financeiro"],
    "2025-11-14": ["Organizar documentos", "Separar roupas para doação"],
    "2025-11-15": ["Desconectar do celular antes de dormir", "Ler 10 páginas do livro"],
  };

  // Funções de navegação (mantidas)
  const mesAnterior = () => {
    if (mes === 0) {
      setMes(11);
      setAno(ano - 1);
    } else {
      setMes(mes - 1);
    }
  };

  const proximoMes = () => {
    if (mes === 11) {
      setMes(0);
      setAno(ano + 1);
    } else {
      setMes(mes + 1);
    }
  };

  // --- LÓGICA DE GERAÇÃO DOS DIAS ---
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  
  // 🌟 NOVO: Calcula o dia da semana do primeiro dia do mês (0=Dom, 6=Sáb)
  const diaSemanaPrimeiroDia = new Date(ano, mes, 1).getDay(); 

  const diasRenderizados = [];

  for (let i = 1; i <= diasNoMes; i++) {
    const dataStr = `${ano}-${String(mes + 1).padStart(2,"0")}-${String(i).padStart(2,"0")}`;
    const tarefasDoDia = tarefas[dataStr] || [];

    const diaClassName = `dia-celula ${tarefasDoDia.length > 0 ? 'dia-com-tarefa' : ''}`;
    
    // 🌟 NOVO: Define o estilo para o primeiro dia do mês
    // 'gridColumnStart' define em qual coluna o dia 1 deve começar.
    const style = i === 1 
      ? { gridColumnStart: diaSemanaPrimeiroDia + 1 } // +1 porque CSS Grid começa em 1, JS .getDay() começa em 0
      : {};

    diasRenderizados.push(
      <div key={i} className={diaClassName} style={style}>
        <div className="dia-numero">{i}</div>
        <div className="tarefas-dia">
          {tarefasDoDia.map((t, j) => (
            <div key={j} className="tarefa">{t}</div>
          ))}
        </div>
      </div>
    );
  }
  // -----------------------------------

  return (
    <div className="calendario-container">
      {/* Menu superior fixo */}
      <MenuSuperior />
      <h1 className="titulo">📅 Calendário de Tarefas</h1>

      <div className="cabecalho-calendario">
        <button onClick={mesAnterior} className="btn-navegacao">{"<"}</button>
        <h2 className="mes-atual">{nomesMeses[mes]} {ano}</h2>
        <button onClick={proximoMes} className="btn-navegacao">{">"}</button>
      </div>

      {/* 🌟 NOVO: Cabeçalho com os nomes dos dias da semana */}
      <div className="dias-semana-header">
        {nomesDiasSemana.map(dia => (
          <div key={dia} className="dia-nome">{dia}</div>
        ))}
      </div>

      {/* Container principal do Grid */}
      <div className="grid-calendario"> 
        {diasRenderizados}
      </div>

      <Link to="/cadastrar-tarefa" className="btn-add">
        +
      </Link>
      <MenuInferior />
    </div>
  );
}




