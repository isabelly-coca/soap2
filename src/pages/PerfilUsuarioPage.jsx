import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Camera, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MenuInferior from '../components/MenuInferior';
import '../styles/PerfilUsuarioPage.css';

export default function PerfilUsuarioPage() {

    const navigate = useNavigate();

    const [usuario, setUsuario] = useState({
        id: "",
        nome: "",
        email: "",
        senha: "",
        fotoUrl: "https://via.placeholder.com/150/007bff/ffffff?text=USER"
    });

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const fileInputRef = useRef(null);

    // 🔹 Carrega os dados quando a página abre
    useEffect(() => {
        const dadosSalvos = localStorage.getItem("usuario");

        if (dadosSalvos) {
            try {
                const user = JSON.parse(dadosSalvos);

                // garante que tudo será carregado corretamente
                setUsuario({
                    id: user.id || "",
                    nome: user.nome || "",
                    email: user.email || "",
                    senha: "",
                    fotoUrl: user.fotoUrl || "https://via.placeholder.com/150/007bff/ffffff?text=USER"
                });

            } catch (error) {
                console.error("Erro ao ler usuário do localStorage:", error);
            }
        }
    }, []);

    // 🔹 Selecionar arquivo
    const abrirSeletorDeImagem = () => {
        fileInputRef.current.click();
    };

    // 🔹 Atualizar foto e salvar imediatamente
    const handleFotoChange = (event) => {
        const arquivo = event.target.files[0];
        if (!arquivo) return;

        const leitor = new FileReader();

        leitor.onload = () => {
            const imagemBase64 = leitor.result;

            const usuarioAtualizado = {
                ...usuario,
                fotoUrl: imagemBase64
            };

            // Atualiza estado
            setUsuario(usuarioAtualizado);

            // Salva localStorage
            localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
        };

        leitor.readAsDataURL(arquivo);
    };

    // 🔹 Salvar nome, email e senha
    const handleSalvar = () => {
        const usuarioAtualizado = {
            ...usuario
        };

        // Senha só será salva se o usuário digitar algo
        if (usuario.senha.trim() === "") {
            delete usuarioAtualizado.senha; // mantém a mesma
        }

        localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));

        alert("Dados atualizados com sucesso!");
    };

    // 🔹 Botão de Sair
    const handleSair = () => {
        localStorage.removeItem("usuario");
        navigate("/login");
    };

    return (
        <div className="perfil-container">
            <h1 className="titulo">
                <User size={24} style={{ marginRight: '10px' }} />
                Meu Perfil
            </h1>

            {/* Foto */}
            <div className="perfil-foto-secao">
                <div className="foto-wrapper">
                    <img
                        src={usuario.fotoUrl}
                        alt="Foto de Perfil"
                        className="foto-perfil"
                    />

                    <button
                        className="btn-mudar-foto"
                        onClick={abrirSeletorDeImagem}
                        title="Mudar foto"
                    >
                        <Camera size={20} />
                    </button>

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFotoChange}
                    />
                </div>
            </div>

            {/* Campos */}
            <div className="info-campos">

                <div className="campo-item">
                    <label htmlFor="nome">
                        <User size={20} /> Nome
                    </label>
                    <input
                        id="nome"
                        type="text"
                        value={usuario.nome}
                        onChange={(e) => setUsuario({ ...usuario, nome: e.target.value })}
                    />
                </div>

                <div className="campo-item">
                    <label htmlFor="email">
                        <Mail size={20} /> E-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={usuario.email}
                        onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                    />
                </div>

                <div className="campo-item">
                    <label htmlFor="senha">
                        <Lock size={20} /> Senha
                    </label>

                    <div className="input-senha-wrapper">
                        <input
                            id="senha"
                            type={mostrarSenha ? "text" : "password"}
                            value={usuario.senha}
                            onChange={(e) => setUsuario({ ...usuario, senha: e.target.value })}
                        />

                        <button
                            className="btn-mostrar-senha"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                        >
                            {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Botões */}
            <button className="btn-salvar" onClick={handleSalvar}>
                Salvar Alterações
            </button>

            <button className="btn-salvar btn-sair" onClick={handleSair}>
                <LogOut size={18} style={{ marginRight: "8px" }} />
                Sair
            </button>

            <MenuInferior />
        </div>
    );
}


