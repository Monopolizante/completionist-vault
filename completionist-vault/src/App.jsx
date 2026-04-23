import { useState } from 'react'
import './App.css'
import Formulario from './Components/Formulario';
import Home from './Pages/Home'


function App() {
  
  const [tela, setTela] = useState(<Home />)
    return (
      <div className={"div-app"}>
        <header>
          <nav>
          <span class="vaadin--medal"></span>
          <div className={"nav-bar"}>
            <button onClick={() => setTela(<Home />)}>Home</button>
            <button onClick={() => setTela(<Formulario />)}>Formulário</button>
          </div>
          </nav>
        </header>
        <main className={"main"}>
          {tela}
        </main>
      </div>

    )
}

export default App
