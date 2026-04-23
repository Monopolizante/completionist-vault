import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Lógica do CRUD (Read) futuramente
        console.log("Logando...");
        navigate('/'); // Navegação programática após ação
    };

    return (
        <div className="page-content">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default Login;