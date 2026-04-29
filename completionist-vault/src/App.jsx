import { useState } from 'react'
import './App.css'
import Home from './Pages/Home';
import Formulario from './Pages/Formulario';
import Games from './Pages/Games';


function App() {
  const [tela, setTela] = useState()
  return(
      <div className='prog-content'>
          <nav className={"nav-content"}>
              <h2 className={"nav-header"}>Completionist Vault</h2>
              <div className={"buttons-div"}>
                  <button onClick={() => setTela(<Home />)}>About</button>
                  <button onClick={() => setTela(<Games />)}>Games</button>
                  <button onClick={() => setTela(<Formulario />)}>Login</button>
                  
              </div>
          </nav>
          {tela}
      </div>
  )
}

export default App
