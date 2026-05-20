import { useState, useEffect } from 'react'
import './App.css'

const imageModules = import.meta.glob('./assets/people/*.png', {
  eager: true,
  import: 'default',
})

const allImages = Object.entries(imageModules)
  .sort(([a], [b]) => {
    const numA = parseInt(a.match(/person(\d+)/)?.[1] ?? '0', 10)
    const numB = parseInt(b.match(/person(\d+)/)?.[1] ?? '0', 10)
    return numA - numB
  })
  .map(([path, src], index) => ({ id: index, src, path }))

const shuffle = (arr) => {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function App() {
  const [deck, setDeck] = useState([])
  const [champion, setChampion] = useState(null)
  const [challenger, setChallenger] = useState(null)
  const [winner, setWinner] = useState(null)
  const [pickedSide, setPickedSide] = useState(null)
  const [progress, setProgress] = useState(0)

  const totalRounds = allImages.length - 1

  const startGame = () => {
    const shuffled = shuffle(allImages)
    setChampion(shuffled[0])
    setChallenger(shuffled[1])
    setDeck(shuffled.slice(2))
    setWinner(null)
    setPickedSide(null)
    setProgress(0)
  }

  useEffect(() => {
    startGame()
  }, [])

  const pick = (side) => {
    if (pickedSide) return
    setPickedSide(side)

    const winnerCard = side === 'left' ? champion : challenger
    const newProgress = progress + 1

    setTimeout(() => {
      if (deck.length === 0) {
        setWinner(winnerCard)
      } else {
        const [next, ...rest] = deck
        setChampion(winnerCard)
        setChallenger(next)
        setDeck(rest)
        setPickedSide(null)
        setProgress(newProgress)
      }
    }, 600)
  }

  if (allImages.length < 2) {
    return (
      <div className="empty-state">
        <h1>Inga bilder hittades</h1>
        <p>Lägg PNG-filer i <code>src/assets/people/</code></p>
      </div>
    )
  }

  if (winner) {
    return (
      <div className="app">
        <div className="match-screen">
          <div className="hearts">
            <span>💖</span><span>💕</span><span>💖</span>
          </div>
          <h1>Det blev en match!</h1>
          <div className="winner-card">
            <img src={winner.src} alt="Vinnaren" />
          </div>
          <p className="match-text">Du valde din perfekta match ur {allImages.length} kandidater</p>
          <button className="restart-btn" onClick={startGame}>
            Spela igen 💘
          </button>
        </div>
      </div>
    )
  }

  if (!champion || !challenger) return null

  const progressPercent = (progress / totalRounds) * 100

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="logo">Vem väljer du</h1>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <p className="progress-text">{progress} / {totalRounds}</p>
      </header>

      <div className="cards-container">
        <div
          className={`card ${pickedSide === 'left' ? 'picked' : ''} ${pickedSide === 'right' ? 'rejected' : ''}`}
          onClick={() => pick('left')}
        >
          <img src={champion.src} alt="Kandidat 1" />
          <div className="card-overlay">
            <span className="pick-label">Välj 💖</span>
          </div>
        </div>

        <div className="vs-badge">VS</div>

        <div
          className={`card ${pickedSide === 'right' ? 'picked' : ''} ${pickedSide === 'left' ? 'rejected' : ''}`}
          onClick={() => pick('right')}
        >
          <img src={challenger.src} alt="Kandidat 2" />
          <div className="card-overlay">
            <span className="pick-label">Välj 💖</span>
          </div>
        </div>
      </div>

      <p className="hint">Tryck på den du vill behålla</p>
    </div>
  )
}

export default App
