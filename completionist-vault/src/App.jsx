import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Componente fixo
import MainPage from './Pages/MainPage';
import Games from './Pages/Games';
import Login from './Pages/Login';
import Cadastro from './Pages/Cadastro';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar /> {/* Fica fora das Routes para aparecer em todas as páginas */}
      <main className="container">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/games" element={<Games />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;