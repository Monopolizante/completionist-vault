import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Componente fixo
import MainPage from './Pages/MainPage';
import Games from './Pages/Games';
import Login from './Pages/Login';
import Cadastro from './Pages/Cadastro';
import './App.css';

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

export default App;