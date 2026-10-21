import { Board } from './components/Board'
import { DiceTray } from './components/DiceTray'
import { EndScreen } from './components/EndScreen'
import { useGame } from './hooks/useGame'
import './App.css'

function App() {
  const { game, diceFaces, canChooseDiceCount, canCommit, score, rollAndStart, selectTile, commit } =
    useGame()

  return (
    <div className="board-frame">
      <Board
        board={game.board}
        selectedTiles={game.currentRound?.selectedTiles ?? []}
        canSelect={game.status === 'playing' && game.currentRound !== null}
        onToggle={selectTile}
      />
      <DiceTray
        diceFaces={diceFaces}
        hasCurrentRound={game.currentRound !== null}
        canChooseDiceCount={canChooseDiceCount}
        canCommit={canCommit}
        onRoll={rollAndStart}
        onCommit={commit}
      />
      {game.status === 'ended' && <EndScreen score={score} />}
    </div>
  )
}

export default App
