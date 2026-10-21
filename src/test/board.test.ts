import { createInitialBoard, removeTiles, boardScore, isShut, highestAvailable } from '../game/board'

describe('createInitialBoard', () => {
  test('returns tiles 1 to 9', () => {
    expect(createInitialBoard()).toEqual({ availableTiles: [1, 2, 3, 4, 5, 6, 7, 8, 9] })
  })
})

describe('removeTiles', () => {
  test('removes the given tiles and leaves the rest', () => {
    const board = createInitialBoard()
    const result = removeTiles(board, [3, 7])
    expect(result.availableTiles).toEqual([1, 2, 4, 5, 6, 8, 9])
  })

  test('does not mutate the board passed in', () => {
    const board = createInitialBoard()
    const original = [...board.availableTiles]
    removeTiles(board, [1])
    expect(board.availableTiles).toEqual(original)
  })

  test('throws when given a tile that is not available on the board', () => {
    const board = createInitialBoard()
    expect(() => removeTiles(board, [20])).toThrow()
  })

  test('throws when any tile in the batch is unavailable, even if others are valid', () => {
    const board = createInitialBoard()
    expect(() => removeTiles(board, [3, 20])).toThrow()
  })
})

describe('boardScore', () => {
  test('sums the remaining tiles', () => {
    expect(boardScore({ availableTiles: [1, 2, 7] })).toBe(10)
  })

  test('is 0 for an empty board', () => {
    expect(boardScore({ availableTiles: [] })).toBe(0)
  })
})

describe('isShut', () => {
  test('is true only when no tiles remain', () => {
    expect(isShut({ availableTiles: [] })).toBe(true)
    expect(isShut({ availableTiles: [5] })).toBe(false)
  })
})

describe('highestAvailable', () => {
  test('returns the highest available tile', () => {
    expect(highestAvailable({ availableTiles: [1, 4, 2] })).toBe(4)
  })

  test('returns undefined on an empty board', () => {
    expect(highestAvailable({ availableTiles: [] })).toBeUndefined()
  })
})
