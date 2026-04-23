import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">SteamTracker</div>
      <div className="nav-links">
        <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Home</NavLink>
        <NavLink to="/games" className={({isActive}) => isActive ? "active" : ""}>Jogos</NavLink>
        <NavLink to="/login" className={({isActive}) => isActive ? "active" : ""}>Entrar</NavLink>
        <NavLink to="/cadastro" className={({isActive}) => isActive ? "active" : ""}>Criar Conta</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;