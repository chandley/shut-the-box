type EndScreenProps = {
  score: number
  onNewGame: () => void
}

export function EndScreen({ score, onNewGame }: EndScreenProps) {
  const isShut = score === 0

  return (
    <div className={['end-screen', isShut ? 'end-screen-shut' : ''].filter(Boolean).join(' ')}>
      <p className="end-screen-message">
        {isShut ? 'Shut the box! You win!' : `Game over — score: ${score}`}
      </p>
      <button type="button" className="new-game-button" onClick={onNewGame}>
        New game
      </button>
    </div>
  )
}
