import React, { useState } from 'react';

function Cadastro() {
    const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleCreate = (e) => {
        e.preventDefault();
        console.log("Dados para o CRUD (Create):", formData);
        alert("Conta criada com sucesso! (Simulação)");
    };

    return (
        <div className="page-container">
            <h2>Crie sua conta no Tracker</h2>
            <form onSubmit={handleCreate} className="steam-form">
                <input name="nome" placeholder="Nome de Usuário" onChange={handleChange} />
                <input name="email" type="email" placeholder="E-mail" onChange={handleChange} />
                <input name="senha" type="password" placeholder="Senha" onChange={handleChange} />
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
}

export default Cadastro;