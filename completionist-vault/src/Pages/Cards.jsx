import './cards.css'

function Cards() {
  return (
    <div>
    <section className='games-list'>

      <div className='game-card'>

        <img 
          src="src/Images/balatro-pc-game-steam-cover.webp" 
          alt="Balatro" 
        />

        <div className='game-info'>
          <h3>Balatro</h3>
          <p>Achievements</p>

          <div className='achievements-total'>
            <span>5 / 31</span>
          </div>
        </div>

      </div>

    </section>
    </div>
  )
}

export default Cards