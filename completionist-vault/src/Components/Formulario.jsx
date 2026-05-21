import React from 'react'

function Formulario (){
    return (
        <div>
            <div className={"main-header"}>
                <h2>Faça Login</h2>
                <h3>Use sua conta da Steam</h3>
            </div>
            <div className={"input-login"}>
                <input type="text" placeholder="Conta da Steam"></input>
            </div>
        </div>
    )
}
export default Formulario