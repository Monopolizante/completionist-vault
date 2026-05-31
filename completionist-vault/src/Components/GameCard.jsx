import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './Navbar';

axios.defaults.withCredentials = true;
function GameCard({game, imagemJogo}) {
    
  return (
    <div>
        <section className='games-list'>
                <div className='game-card'>

                    <img
                        src={imagemJogo}
                        alt={game.name}
                    />

                    <div className='game-info' key={game.appid}>
                        <h3>{game.name}</h3>
                    </div>

                </div>
        </section>
    </div>
  )
}

export default GameCard

