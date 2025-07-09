/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */


function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const root = ReactDOM.createRoot(document.getElementById('root'));


const wordsList = [
  'banana', 'orange', 'lemon', 'peach', 'tomato',
  'apple', 'berry', 'cherry', 'grape', 'kiwi'
]

const App = () => {
  const [words, setWords] = React.useState(shuffle(wordsList))
  const [currentWord, setCurrentWord] = React.useState('')
  const [scrambled, setScrambled] = React.useState('')
  const [guess, setGuess] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [score, setScore] = React.useState(() => parseInt(localStorage.getItem('score')) || 0)
  const [strikes, setStrikes] = React.useState(() => parseInt(localStorage.getItem('strikes')) || 0)
  const [passes, setPasses] = React.useState(() => parseInt(localStorage.getItem('passes')) || 3)
  const [gameOver, setGameOver] = React.useState(false)

    
const buttonStyle = {
  backgroundColor: '#007BFF',
  color: '#fff',
  padding: '10px 20px',
  fontSize: '16px',
  margin: '10px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer'
}

const getMessageStyle = () => {
  if (message.includes('Correct')) return { color: 'green', fontWeight: 'bold' }
  if (message.includes('Wrong')) return { color: 'red', fontWeight: 'bold' }
  if (message.includes('You lost')) return { color: 'red', fontWeight: 'bold' }
  if (message.includes('passed')) return { color: 'blue', fontWeight: 'bold' }
  if (message.includes('No passes')) return { color: 'purple', fontWeight: 'bold' }
  return {}
}


  React.useEffect(() => {
    resetGame()
  }, [])

  const resetGame = () => {
    localStorage.clear()
    setWords(shuffle(wordsList))
    setScore(0)
    setStrikes(0)
    setPasses(3)
    setGameOver(false)
    setMessage('')
    setTimeout(() => loadNextWord(), 0)
  }


  React.useEffect(() => {
    localStorage.setItem('score', score)
    localStorage.setItem('strikes', strikes)
    localStorage.setItem('passes', passes)
  }, [score, strikes, passes])


const loadNextWord = () => {
  if (words.length === 0) {
    setGameOver(true)
    return
  }
  const [next, ...rest] = words
  setCurrentWord(next)
  setScrambled(shuffle(next))
  setWords(rest)
  setGuess('')
}

  
const handleGuess = (e) => {
    e.preventDefault()
    setGuess('')
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      setScore(score + 1)
      setMessage('Correct. Next word.')
      setTimeout(() => loadNextWord(), 1000)
    } else {
      const newStrikes = strikes + 1
      setStrikes(newStrikes)
      setMessage('Wrong. Try again.')
      if (newStrikes >= 3) {
        setGameOver(true)
        setMessage('You lost.')
      }
    }
  }

  const handlePass = () => {
    if (passes > 1) {
      setPasses(passes - 1)
      setMessage('You passed. Next word.')
      setTimeout(() => loadNextWord(), 1000)
    } else {
      setPasses(0)
      setGameOver(true)
      setMessage('🚫 No passes left. Game over.')
    }
  }


  return (
    <div className="game-container">
      <h1>Welcome to Scramble.</h1>

      <div className="score-board">
        <div>
          <h2>{score}</h2>
          <p>POINTS</p>
        </div>
        <div>
          <h2>{strikes}</h2>
          <p>STRIKES</p>
        </div>
      </div>

      <p style={getMessageStyle()}>{message}</p>


      <h1 className="scrambled">{scrambled}</h1>

      <form onSubmit={handleGuess}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Type your guess"
          autoFocus
          disabled={gameOver}
        />
      </form>


      <button onClick={handlePass} disabled={gameOver} style={buttonStyle}>
        {passes} passes remaining
      </button>

      {gameOver && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => window.location.reload()} 
          style={buttonStyle}>

          Play Again?
          </button>
        </div>
      )}
    </div>
  )
}

root.render(<App />)