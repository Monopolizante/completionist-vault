import { useState } from 'react'
import './App.css'
import Home from './pages/Home';
import Formulario from './pages/Formulario';

function App() {
  const [tela, setTela] = useState()
  return(
      <div>
          <nav>
              <h2 className={"nav-header"}>Completionist Vault</h2>
              <div className={"buttons-div"}>
                  <button onClick={() => setTela(<Home />)}>Home</button>
                  <button onClick={() => setTela(<Formulario />)}>Formulário</button>
              </div>
          </nav>
          {tela}
      </div>
  )
}

export default App
