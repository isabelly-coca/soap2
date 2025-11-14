import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import TarefasPage from "../pages/TarefasPage";
import NotificacaoPage from "../pages/NotificacaoPage";
import CadastrarTarefaPage from "../pages/CadastrarTarefaPage";
import CadastroPage from "../pages/CadastroPage";
import CalendarioPage from "../pages/CalendarioPage";
import PerfilUsuarioPage from "../pages/PerfilUsuarioPage"
import ConfirmacaoEmail from "../pages/ConfirmacaoEmail";
import LinkEnviadoPage from "../pages/LinkEnviadoPage";
import RedefinirSenhaPage from "../pages/RedefinirSenhaPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redireciona a raiz para /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rota de login */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastrar-tarefa" element={<CadastrarTarefaPage />} />

        {/* Tela principal (após login) */}
        <Route path="/notificacao" element={<NotificacaoPage/>}/>
        <Route path="/tarefas" element={<TarefasPage />} />
        <Route path="/calendario-page" element={<CalendarioPage />} />
        <Route path="/perfil-page" element={<PerfilUsuarioPage />} />

        {/* Rotas de cadastro e recuperação */}
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/confirmacao-email" element={<ConfirmacaoEmail />} />
        <Route path="/link-enviado" element={<LinkEnviadoPage />} />
        <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
      </Routes>
    </Router>
  );
}

export default App;

