import React from 'react'
import { useState } from 'react'
import Games from './Pages/Games';
import Home from './Pages/Home'
import Cadastro from './Pages/Cadastro';
import './App.css';

function App() {
  
  const [tela, setTela] = useState(<Home />)
    return (
      <div className={"div-app"}>
        <header>
          <nav>
          <div className={"nav-bar"}>
            <h1>Completionist Vault</h1>
            <div className='nav-buttons'>
              <button onClick={() => setTela(<Home />)}>Home</button>
              <button onClick={() => setTela(<Cadastro />)}>Sign Up</button>
              <button onClick={() => setTela(<Games />)}>Games</button>
            </div>
          </div>
          </nav>
        </header>
        <main className={"main"}>
          {tela}
        </main>

        <footer>
          © 2026 DogTeam
        </footer>
      </div>

    )
}

export default App;