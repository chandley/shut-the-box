import { useCallback, useReducer, useState } from 'react'
import type { Game } from '../game/game'
import { commitRound, createInitialGame, startRound, toggleSelection } from '../game/game'
import { canChooseDiceCount, diceTotal, rollDice } from '../game/dice'
import { canCommit } from '../game/chooseTilesToMatchDieRoll'
import { boardScore } from '../game/board'

type Action =
  | { type: 'startRound'; total: number }
  | { type: 'toggleSelection'; tile: number }
  | { type: 'commitRound' }

function reducer(game: Game, action: Action): Game {
  switch (action.type) {
    case 'startRound':
      return startRound(game, action.total)
    case 'toggleSelection':
      return toggleSelection(game, action.tile)
    case 'commitRound':
      return commitRound(game)
  }
}

export function useGame() {
  const [game, dispatch] = useReducer(reducer, null, createInitialGame)
  const [diceFaces, setDiceFaces] = useState<number[]>([])

  const rollAndStart = useCallback((count: 1 | 2) => {
    const faces = rollDice(count)
    setDiceFaces(faces)
    dispatch({ type: 'startRound', total: diceTotal(faces) })
  }, [])

  const selectTile = useCallback((tile: number) => {
    dispatch({ type: 'toggleSelection', tile })
  }, [])

  const commit = useCallback(() => {
    dispatch({ type: 'commitRound' })
  }, [])

  return {
    game,
    diceFaces,
    canChooseDiceCount: canChooseDiceCount(game.board),
    canCommit: game.currentRound !== null && canCommit(game.currentRound),
    score: boardScore(game.board),
    rollAndStart,
    selectTile,
    commit,
  }
}
