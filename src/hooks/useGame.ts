import { useCallback, useLayoutEffect, useReducer, useState } from 'react'
import type { Game } from '../game/game'
import { commitRound, createInitialGame, startRound, toggleSelection } from '../game/game'
import { canChooseDiceCount, diceTotal, rollDice } from '../game/dice'
import { canCommit } from '../game/chooseTilesToMatchDieRoll'
import { boardScore } from '../game/board'

type Action =
  | { type: 'startRound'; total: number }
  | { type: 'toggleSelection'; tile: number }
  | { type: 'commitRound' }
  | { type: 'newGame' }

function reducer(game: Game, action: Action): Game {
  switch (action.type) {
    case 'startRound':
      return startRound(game, action.total)
    case 'toggleSelection':
      return toggleSelection(game, action.tile)
    case 'commitRound':
      return commitRound(game)
    case 'newGame':
      return createInitialGame()
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

  const mustChooseDiceCount = canChooseDiceCount(game.board)

  // When there's no real choice (a tile above 6 is still available), roll 2
  // dice automatically instead of making the user click a "roll" prompt.
  useLayoutEffect(() => {
    if (game.status === 'playing' && game.currentRound === null && !mustChooseDiceCount) {
      rollAndStart(2)
    }
  }, [game.status, game.currentRound, mustChooseDiceCount, rollAndStart])

  const selectTile = useCallback((tile: number) => {
    dispatch({ type: 'toggleSelection', tile })
  }, [])

  const commit = useCallback(() => {
    dispatch({ type: 'commitRound' })
  }, [])

  const newGame = useCallback(() => {
    setDiceFaces([])
    dispatch({ type: 'newGame' })
  }, [])

  return {
    game,
    diceFaces,
    canChooseDiceCount: mustChooseDiceCount,
    canCommit: game.currentRound !== null && canCommit(game.currentRound),
    score: boardScore(game.board),
    rollAndStart,
    selectTile,
    commit,
    newGame,
  }
}
