import { createInitialGame, startRound, toggleSelection, commitRound } from '../game/game'
import type { Game } from '../game/game'
import { createInitialBoard, boardScore } from '../game/board'

describe('createInitialGame', () => {
  test('starts in playing status with the initial board and no current round', () => {
    const game = createInitialGame()
    expect(game.status).toBe('playing')
    expect(game.board).toEqual(createInitialBoard())
    expect(game.currentRound).toBeNull()
  })
})

describe('startRound', () => {
  test('sets the current round when a valid combination exists', () => {
    const game = createInitialGame()
    const result = startRound(game, 7)
    expect(result.status).toBe('playing')
    expect(result.currentRound).toEqual({ diceTotal: 7, selectedTiles: [] })
  })

  test('ends the game when no valid combination exists for the total', () => {
    const game = { status: 'playing' as const, board: { availableTiles: [2, 7] }, currentRound: null }
    const result = startRound(game, 6)
    expect(result.status).toBe('ended')
    expect(boardScore(result.board)).toBeGreaterThan(0)
  })
})

describe('toggleSelection', () => {
  test('delegates to the current round toggleTile', () => {
    const game = startRound(createInitialGame(), 7)
    const result = toggleSelection(game, 4)
    expect(result.currentRound?.selectedTiles).toEqual([4])
  })

  test('is a no-op when there is no current round', () => {
    const game = createInitialGame()
    const result = toggleSelection(game, 4)
    expect(result).toEqual(game)
  })

  test('is a no-op once the game has ended', () => {
    const game = {
      status: 'ended' as const,
      board: { availableTiles: [2, 7] },
      currentRound: { diceTotal: 6, selectedTiles: [] },
    }
    const result = toggleSelection(game, 2)
    expect(result).toEqual(game)
  })
})

describe('commitRound', () => {
  test('removes the selected tiles and stays in playing status', () => {
    let game = startRound(createInitialGame(), 7)
    game = toggleSelection(game, 7)
    const result = commitRound(game)
    expect(result.status).toBe('playing')
    expect(result.currentRound).toBeNull()
    expect(result.board.availableTiles).not.toContain(7)
  })

  test('ends the game with a score of 0 when the board is emptied', () => {
    let game: Game = {
      status: 'playing',
      board: { availableTiles: [9] },
      currentRound: { diceTotal: 9, selectedTiles: [] },
    }
    game = toggleSelection(game, 9)
    const result = commitRound(game)
    expect(result.status).toBe('ended')
    expect(boardScore(result.board)).toBe(0)
  })

  test('is a no-op when the current selection cannot be committed', () => {
    const game = startRound(createInitialGame(), 7)
    const result = commitRound(game)
    expect(result).toEqual(game)
  })
})
