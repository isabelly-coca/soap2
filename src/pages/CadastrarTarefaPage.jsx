import React, { useState, useEffect } from "react";
import "../styles/CadastrarTarefaPage.css";
import MenuSuperior from "../components/MenuSuperior";
import MenuInferior from "../components/MenuInferior";

export default function CadastrarTarefaPage() {
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [form, setForm] = useState({
    categoria: "",
    titulo: "",
    descricao: "",
    data: "",
    prioridade: "",
  });

  // 🔹 Carrega categorias salvas ao iniciar
  useEffect(() => {
    const categoriasSalvas = JSON.parse(localStorage.getItem("categorias")) || [
      "Trabalho",
      "Pessoal",
      "Finanças",
      "Estudos",
    ];
    setCategorias(categoriasSalvas);
  }, []);

  // 🔹 Salva uma nova categoria no localStorage
  const cadastrarNovaCategoria = () => {
    if (novaCategoria.trim() && !categorias.includes(novaCategoria)) {
      const novas = [...categorias, novaCategoria];
      setCategorias(novas);
      localStorage.setItem("categorias", JSON.stringify(novas));
      setNovaCategoria("");
      alert("Categoria cadastrada com sucesso!");
    }
  };

  // 🔹 Atualiza os campos do formulário
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCadastrar = () => {
    if (!form.titulo || !form.categoria) {
      alert("Preencha pelo menos o título e a categoria!");
      return;
    }

    const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas")) || [];
    const novaTarefa = { ...form, id: Date.now(), concluida: false };
    localStorage.setItem("tarefas", JSON.stringify([...tarefasSalvas, novaTarefa]));

    alert("Tarefa cadastrada com sucesso!");
    window.location.href = "/tarefas";
  };

  return (
    <div className="cadastro-container">
      <MenuSuperior />
      <h1 className="titulo">CADASTRAR TAREFA</h1>

      <form className="form-tarefa" onSubmit={(e) => e.preventDefault()}>
        <div className="input-group">
          <label>CATEGORIA EXISTENTE</label>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
          >
            <option value="">Selecione...</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="input-group nova-categoria-group">
          <label>NOVA CATEGORIA</label>
          <div className="nova-categoria-input">
            <input
              type="text"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              placeholder="Digite o nome da nova categoria"
            />
            <button
              type="button"
              onClick={cadastrarNovaCategoria}
              className="btn-nova-categoria"
            >
              +
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>TÍTULO</label>
          <input
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            placeholder="Título da tarefa"
          />
        </div>

        <div className="input-group">
          <label>DESCRIÇÃO</label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            placeholder="Detalhes da tarefa"
            rows="3"
          ></textarea>
        </div>

        <div className="input-group">
          <label>DATA</label>
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>PRIORIDADE</label>
          <select
            name="prioridade"
            value={form.prioridade}
            onChange={handleChange}
          >
            <option value="">Selecione...</option>
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>
        </div>

        <div className="botao-centralizado">
          <button
            type="button"
            className="btn-cadastrar"
            onClick={handleCadastrar}
          >
            CADASTRAR
          </button>
        </div>
      </form>

      <MenuInferior />
    </div>
  );
}
