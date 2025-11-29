// src/pages/CadastrarTarefaPage.jsx
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

  // Carrega categorias salvas ao iniciar
  useEffect(() => {
    const categoriasSalvas = JSON.parse(localStorage.getItem("categorias")) || [
      "Trabalho",
      "Pessoal",
      "Finanças",
      "Estudos",
    ];
    setCategorias(categoriasSalvas);

    // Ouvir atualizações vindas do MenuSuperior
    const atualizarCategorias = () => {
      const novas = JSON.parse(localStorage.getItem("categorias")) || [];
      setCategorias(novas);
    };

    window.addEventListener("categorias-atualizadas", atualizarCategorias);

    return () =>
      window.removeEventListener("categorias-atualizadas", atualizarCategorias);
  }, []);

  // Salva uma nova categoria no localStorage
  const cadastrarNovaCategoria = () => {
    if (novaCategoria.trim() && !categorias.includes(novaCategoria)) {
      const novas = [...categorias, novaCategoria];
      setCategorias(novas);

      localStorage.setItem("categorias", JSON.stringify(novas));

      // 🔔 Atualiza menus e filtros em outras telas
      window.dispatchEvent(new Event("categorias-atualizadas"));

      setNovaCategoria("");
      alert("Categoria cadastrada com sucesso!");
    }
  };

  // Atualiza campos do formulário
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCadastrar = () => {
    // VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS
    if (!form.titulo || !form.categoria || !form.data) {
      alert("Preencha os campos obrigatórios marcados com *");
      return;
    }

    // 🔥 NOVA VALIDAÇÃO OBRIGATÓRIA DA PRIORIDADE
    if (!form.prioridade) {
      alert("Selecione a prioridade da tarefa! (*)");
      return;
    }

    let armazenamento = JSON.parse(localStorage.getItem("tarefas"));
    if (!armazenamento || !Array.isArray(armazenamento.tarefas)) {
      armazenamento = { tarefas: [] };
    }

    const novaTarefa = {
      id: Date.now(),
      titulo: form.titulo,
      descricao: form.descricao,
      categoria: form.categoria,
      prioridade: form.prioridade,
      data: form.data,
      concluida: false
    };

    armazenamento.tarefas.push(novaTarefa);
    localStorage.setItem("tarefas", JSON.stringify(armazenamento));

    alert("Tarefa cadastrada com sucesso!");

    setForm({
      categoria: "",
      titulo: "",
      descricao: "",
      data: "",
      prioridade: "",
    });
  };

  return (
    <div className="pagina-cadastro">

      <MenuSuperior categorias={categorias} setFiltro={() => {}} />

      <div className="titulo-container">
        <h1 className="titulo">CADASTRAR TAREFA</h1>
      </div>

      <div className="cadastro-container">
        <form className="form-tarefa" onSubmit={(e) => e.preventDefault()}>

          <div className="input-group">
            <label>CATEGORIA EXISTENTE *</label>
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
            <label>TÍTULO *</label>
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
            <label>DATA *</label>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
            />
          </div>

          <div class="input-group">
            <label>PRIORIDADE *</label>
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
      </div>

      <MenuInferior />
    </div>
  );
}


