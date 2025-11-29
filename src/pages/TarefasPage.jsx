import React, { useState, useEffect } from "react";
import "../styles/TarefasPage.css";
import { Link } from "react-router-dom";
import MenuInferior from "../components/MenuInferior";
import MenuSuperior from "../components/MenuSuperior";

const PRIORIDADES = ["Baixa", "Média", "Alta"];

// 🔹 Função para formatar datas no formato brasileiro (DD/MM/YYYY)
function formatarDataBR(dataISO) {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// 🔹 Formulário de edição de tarefa
function EdicaoForm({ edicaoAtual, handleEdicaoChange, salvarEdicao, cancelarEdicao, categorias }) {
  return (
    <form onSubmit={salvarEdicao} className="edicao-form">
      <input
        type="text"
        name="titulo"
        value={edicaoAtual.titulo}
        onChange={handleEdicaoChange}
        placeholder="Título"
        required
      />
      <textarea
        name="descricao"
        value={edicaoAtual.descricao || ""}
        onChange={handleEdicaoChange}
        placeholder="Descrição da tarefa"
      />
      <div className="edicao-row">
        <select
          name="categoria"
          value={edicaoAtual.categoria}
          onChange={handleEdicaoChange}
        >
          <option value="">Selecione...</option>
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          name="prioridade"
          value={edicaoAtual.prioridade}
          onChange={handleEdicaoChange}
        >
          <option value="">Selecione...</option>
          {PRIORIDADES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <label>Data:</label>
      <input type="date" name="data" value={edicaoAtual.data} onChange={handleEdicaoChange} />
      <div className="botoes-salvar-cancelar">
        <button type="submit" className="btn-salvar">Salvar</button>
        <button type="button" onClick={cancelarEdicao} className="btn-cancelar">Cancelar</button>
      </div>
    </form>
  );
}

export default function TarefasPage() {
  const [tarefas, setTarefas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [edicaoAtual, setEdicaoAtual] = useState(null);
  const [filtro, setFiltro] = useState({ categoria: "", prioridade: "" });



  useEffect(() => {
  const novasCategorias = [...new Set(tarefas.map(t => t.categoria).filter(Boolean))];
  setCategorias(novasCategorias);
}, [tarefas]);

  // 🔹 Carregar tarefas e categorias do localStorage
  const carregarTarefas = () => {
    const tarefasRaw = localStorage.getItem("tarefas");
    let armazenamento = { tarefas: [] };

    try {
      const parsed = JSON.parse(tarefasRaw);
      if (Array.isArray(parsed)) {
        armazenamento.tarefas = parsed;
      } else if (parsed && parsed.tarefas) {
        armazenamento = parsed;
      }
    } catch {
      armazenamento = { tarefas: [] };
    }

    setTarefas(armazenamento.tarefas);

    const categoriasSalvas = JSON.parse(localStorage.getItem("categorias")) || [];
    setCategorias(categoriasSalvas);
  };

useEffect(() => {
  carregarTarefas();

  // Listener correto para tarefas
  const listenerTarefas = () => carregarTarefas();
  window.addEventListener("tarefas-atualizadas", listenerTarefas);

  // Listener correto para filtros
  const listenerFiltros = () => {
    const filtrosSalvos = JSON.parse(localStorage.getItem("filtros")) || {};
    setFiltro({
      categoria: filtrosSalvos.categoria || "",
      prioridade: filtrosSalvos.prioridade || "",
      data: filtrosSalvos.data || "",
    });
  };
  window.addEventListener("filtros-atualizados", listenerFiltros);

  // Carrega os filtros ao abrir
  const filtrosSalvos = JSON.parse(localStorage.getItem("filtros")) || {};
  setFiltro({
    categoria: filtrosSalvos.categoria || "",
    prioridade: filtrosSalvos.prioridade || "",
    data: filtrosSalvos.data || "",
  });

  return () => {
    window.removeEventListener("tarefas-atualizadas", listenerTarefas);
    window.removeEventListener("filtros-atualizados", listenerFiltros);
  };
}, []);



  // 🔹 Garantir que tarefas sempre seja um array
  const tarefasFiltradas = (tarefas || []).filter((t) => {
    const catOk = !filtro.categoria || t.categoria === filtro.categoria;
    const prioOk = !filtro.prioridade || t.prioridade === filtro.prioridade;
    const dataOk = !filtro.data || t.data === filtro.data;
    return catOk && prioOk && dataOk;
  });

  const alternarConclusao = (id) => {
    const novas = tarefas.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t));
    setTarefas(novas);
    localStorage.setItem("tarefas", JSON.stringify({ tarefas: novas }));
  };

  const excluirTarefa = (id, e) => {
    e.stopPropagation();
    const novas = tarefas.filter((t) => t.id !== id);
    setTarefas(novas);
    localStorage.setItem("tarefas", JSON.stringify({ tarefas: novas }));
  };

  const iniciarEdicao = (tarefa, e) => {
    e.stopPropagation();
    setEdicaoAtual({ ...tarefa });
  };

  const handleEdicaoChange = (e) => {
    setEdicaoAtual({ ...edicaoAtual, [e.target.name]: e.target.value });
  };

  const salvarEdicao = (e) => {
    e.preventDefault();
    const novas = tarefas.map((t) => (t.id === edicaoAtual.id ? edicaoAtual : t));
    setTarefas(novas);
    localStorage.setItem("tarefas", JSON.stringify({ tarefas: novas }));
    setEdicaoAtual(null);
  };

  const cancelarEdicao = () => setEdicaoAtual(null);

  return (
    <div className="tarefas-container">
      <MenuSuperior setFiltro={setFiltro} categorias={categorias} />

      <h1 className="titulo-tarefas">TAREFAS</h1>

      <div className="lista-tarefas">
        {tarefasFiltradas.length > 0 ? (
          tarefasFiltradas.map((tarefa) => {
            const isEditing = edicaoAtual && edicaoAtual.id === tarefa.id;
            return (
              <div key={tarefa.id} className={`tarefa-item ${tarefa.concluida ? "concluida" : ""}`}>
                {isEditing ? (
                  <EdicaoForm
                    edicaoAtual={edicaoAtual}
                    handleEdicaoChange={handleEdicaoChange}
                    salvarEdicao={salvarEdicao}
                    cancelarEdicao={cancelarEdicao}
                    categorias={categorias}
                  />
                ) : (
                  <>
                    <div className="tarefa-conteudo">
                      <input
                        type="checkbox"
                        checked={tarefa.concluida}
                        onChange={() => alternarConclusao(tarefa.id)}
                      />
                      <div>
                        <span className="tarefa-titulo">{tarefa.titulo}</span>
                        {tarefa.descricao && <p className="tarefa-descricao">{tarefa.descricao}</p>}
                        <div className="tarefa-meta-info">
                          <span className="tarefa-categoria">{tarefa.categoria}</span>
                          <span className="tarefa-prioridade">{tarefa.prioridade}</span>
                          <span className="tarefa-data">{formatarDataBR(tarefa.data)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="botoes-acao">
                      <button className="btn-editar" onClick={(e) => iniciarEdicao(tarefa, e)}>✏️</button>
                      <button className="btn-excluir" onClick={(e) => excluirTarefa(tarefa.id, e)}>🗑️</button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <p className="sem-tarefas">Nenhuma tarefa encontrada.</p>
        )}
      </div>

      <Link to="/cadastrar-tarefa" className="btn-add">+</Link>

      <MenuInferior />
    </div>
  );
}




