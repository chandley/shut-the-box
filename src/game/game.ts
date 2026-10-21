import type { Board } from './board'
import { createInitialBoard, removeTiles, isShut } from './board'
import type { ChooseTilesToMatchDieRoll } from './chooseTilesToMatchDieRoll'
import {
  createChooseTilesToMatchDieRoll,
  toggleTile,
  canCommit,
  hasAnyValidCombination,
} from './chooseTilesToMatchDieRoll'

export type GameStatus = 'playing' | 'ended'

export type Game = {
  status: GameStatus
  board: Board
  currentRound: ChooseTilesToMatchDieRoll | null
}

export function createInitialGame(): Game {
  return { status: 'playing', board: createInitialBoard(), currentRound: null }
}

export function startRound(game: Game, diceTotal: number): Game {
  if (!hasAnyValidCombination(game.board, diceTotal)) {
    return { ...game, status: 'ended', currentRound: null }
  }
  return { ...game, currentRound: createChooseTilesToMatchDieRoll(diceTotal) }
}

export function toggleSelection(game: Game, tile: number): Game {
  if (game.status !== 'playing' || game.currentRound === null) {
    return game
  }
  return { ...game, currentRound: toggleTile(game.currentRound, tile) }
}

export function commitRound(game: Game): Game {
  if (game.currentRound === null || !canCommit(game.currentRound)) {
    return game
  }

  const board = removeTiles(game.board, game.currentRound.selectedTiles)
  return { status: isShut(board) ? 'ended' : 'playing', board, currentRound: null }
}
