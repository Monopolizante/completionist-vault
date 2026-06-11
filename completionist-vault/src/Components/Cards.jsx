//import './cards.css'

function Cards() {
    return (
        <div>
            {/*Card Balatro*/}
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

            {/*Card Resident Evil 9 Requiem */}
            <section className='games-list'>

                <div className='game-card'>

                    <img
                        src="src/Images/resident-evil-requiem-pc-steam-cover.webp"
                        alt="Resident 9"
                    />

                    <div className='game-info'>
                        <h3>Resident Evil Requiem</h3>
                        <p>Achievements</p>

                        <div className='achievements-total'>
                            <span>49 / 49</span>
                        </div>
                    </div>

                </div>

            </section>
            {/* Card Pragmata */}
                        {/*Card Resident Evil 9 Requiem */}
            <section className='games-list'>

                <div className='game-card'>

                    <img
                        src="src/Images/pragmata-pc-steam-cover.webp"
                        alt="Pragmata"
                    />

                    <div className='game-info'>
                        <h3>Pragmata</h3>
                        <p>Achievements</p>

                        <div className='achievements-total'>
                            <span>0 / 35</span>
                        </div>
                    </div>

                </div>

            </section>

        </div>
    )
}

export default Cards