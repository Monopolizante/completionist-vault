import React, { useState } from 'react';
import Navbar from '../Components/Navbar';

function Cadastro() {
    

    return (
        <div className="page-container">
            <Navbar />
            <a href='http://localhost:3000/auth/steam'>Login</a>
        </div>
    );
}

export default Cadastro;