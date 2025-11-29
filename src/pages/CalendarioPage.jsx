import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import MenuInferior from "../components/MenuInferior";
import "../styles/CalendarioPage.css";

/* NORMALIZA AS TAREFAS DO LOCALSTORAGE PARA UM MAPA POR DATA */
function normalizarTarefas(raw) {
  const mapa = {};

  if (!raw) return mapa;

  if (Array.isArray(raw)) {
    raw.forEach((t) => {
      if (!t) return;
      const data = t.data || t.date || null;
      const titulo = t.titulo || t.title || "Tarefa";
      if (!data) return;
      if (!mapa[data]) mapa[data] = [];
      mapa[data].push(titulo);
    });
    return mapa;
  }

  if (typeof raw === "object") {
    Object.keys(raw).forEach((dataKey) => {
      const arr = raw[dataKey] || [];
      mapa[dataKey] = arr.map((it) => (typeof it === "string" ? it : it?.titulo || "Tarefa"));
    });
    return mapa;
  }

  return mapa;
}

export default function CalendarioPage() {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [tarefasPorData, setTarefasPorData] = useState({});

const carregarTarefasDoStorage = useCallback(() => {
  let tarefasArray = [];
  try {
    tarefasArray = JSON.parse(localStorage.getItem("tarefas"))?.tarefas || [];
  } catch (e) {
    tarefasArray = [];
  }

  const mapa = {};
  tarefasArray.forEach((t) => {
    if (!mapa[t.data]) mapa[t.data] = [];
    mapa[t.data].push(t.titulo); // só o título vai pro calendário
  });

  setTarefasPorData(mapa);
}, []);


  /* Carregar ao montar e escutar atualizações */
  useEffect(() => {
    carregarTarefasDoStorage();

    const onAtualizar = () => carregarTarefasDoStorage();
    window.addEventListener("tarefas-atualizadas", onAtualizar);

    return () => {
      window.removeEventListener("tarefas-atualizadas", onAtualizar);
    };
  }, [carregarTarefasDoStorage]);

  const nomesMeses = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ];
  const nomesDiasSemana = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

  const mesAnterior = () => {
    if (mes === 0) { setMes(11); setAno(a => a - 1); } 
    else setMes(m => m - 1);
  };
  const proximoMes = () => {
    if (mes === 11) { setMes(0); setAno(a => a + 1); } 
    else setMes(m => m + 1);
  };

  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const diaSemanaPrimeiro = new Date(ano, mes, 1).getDay();

  /* RENDERIZAÇÃO DOS DIAS */
  const diasRender = [];
  for (let i = 1; i <= diasNoMes; i++) {
    const dataStr = `${ano}-${String(mes + 1).padStart(2,"0")}-${String(i).padStart(2,"0")}`;
    const tarefasDia = tarefasPorData[dataStr] || [];

    const style = i === 1 ? { gridColumnStart: diaSemanaPrimeiro + 1 } : {};

    diasRender.push(
      <div key={i} className={`dia-celula ${tarefasDia.length > 0 ? "dia-com-tarefa" : ""}`} style={style}>
        <div className="dia-numero">{i}</div>
        <div className="tarefas-dia">
          {tarefasDia.length > 0 ? (
            tarefasDia.map((t, idx) => <div key={idx} className="tarefa">{t}</div>)
          ) : (
            <div className="sem-tarefa"></div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="calendario-container">
      <h1 className="titulo">📅 Calendário de Tarefas</h1>

      <div className="cabecalho-calendario">
        <button onClick={mesAnterior} className="btn-navegacao">{"<"}</button>
        <h2 className="mes-atual">{nomesMeses[mes]} {ano}</h2>
        <button onClick={proximoMes} className="btn-navegacao">{">"}</button>
      </div>

      <div className="dias-semana-header">
        {nomesDiasSemana.map(dia => <div key={dia} className="dia-nome">{dia}</div>)}
      </div>

      <div className="grid-calendario">{diasRender}</div>

      <div className="rodape-acoes">
        <Link to="/cadastrar-tarefa" className="btn-add">+</Link>
      </div>

      <MenuInferior />
    </div>
  );
}

