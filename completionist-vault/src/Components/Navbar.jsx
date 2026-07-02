import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Importando os ícones necessários do Tabler Icons
import { 
  IconChevronDown, 
  IconLink, 
  IconLogout 
} from '@tabler/icons-react';

import "../Styles/CompStyle.css";

const SteamIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: "20px", height: "20px" }}>
    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.455 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.662 0 3.015-1.35 3.015-3.015zm-5.273.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.252 0-2.265-1.014-2.265-2.265z" />
  </svg>
);

const NAV_LINKS = [
  { label: "GAMES", to: "/Games" },
  { label: "STATS", to: "/Stats" },
  { label: "ABOUT", to: "/About" },

];

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); //Checar login do usuario
  const [dropdownOpen, setDropdownOpen] = useState(false); //Menu DropDown...pega no meu ***
  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/user", { withCredentials: true });
        if (response.data) {
          setUser(response.data);
        }
      } catch (err) {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  // Desativa o Dropdown se clicar fora (As vezes funciona)
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSteamClick = () => {
    navigate("/loginVault");
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  // Adicionar rota Logout(Robzon) aqui!
  const handleLogout = () => {
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <Link to="/" className="brand" aria-label="Completionist Vault home">
          COMPLETIONIST<span>-VAULT</span>
        </Link>

        <div className="nav-links" role="menubar">
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              role="menuitem"
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="steam-actions">
          {user ? (
            <div className="user-menu-container" ref={dropdownRef}>
              <button
                className="user-profile-nav"
                onClick={toggleDropdown}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span className="user-name">{user.displayName}</span>
                <img
                  src={user.photos?.[0]?.value || "https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg"}
                  alt="User Avatar"
                  className="user-avatar-nav"
                />
                <IconChevronDown 
                  size={12} 
                  className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} 
                />
              </button>

              {dropdownOpen && (
                <div className="user-dropdown-menu">
                  <button className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate("/cadastroVault"); }}>
                    <IconLink size={16} /> Conectar Vault-Account
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <IconLogout size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="steam-btn"
              aria-label="Sign in with Steam"
              onClick={handleSteamClick}
            >
              <SteamIcon />
              <span>Sign in with Steam</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
}