import React from 'react'
import { useState } from 'react'
import MainPage from './Pages/MainPage';
import Games from './Pages/Games';
import Login from './Pages/Login';
import Home from './pages/Home'
import Cadastro from './Pages/Cadastro';
import './App.css';

function App() {
  
  const [tela, setTela] = useState(<Home />)
    return (
      <div className={"div-app"}>
        <header>
          <nav>
          <span className="vaadin--medal"></span>
          <div className={"nav-bar"}>
            <button onClick={() => setTela(<MainPage />)}>Página Inicial</button>
            <button onClick={() => setTela(<Cadastro />)}>Cadastro</button>
          </div>
          </nav>
        </header>
        <main className={"main"}>
          {tela}
        </main>
      </div>

    )
}

export default App;