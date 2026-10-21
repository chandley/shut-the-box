import {
  createChooseTilesToMatchDieRoll,
  toggleTile,
  isValidSelection,
  canCommit,
  hasAnyValidCombination,
} from '../game/chooseTilesToMatchDieRoll'

describe('createChooseTilesToMatchDieRoll', () => {
  test('sets the dice total and starts with no tiles selected', () => {
    expect(createChooseTilesToMatchDieRoll(7)).toEqual({ diceTotal: 7, selectedTiles: [] })
  })
})

describe('toggleTile', () => {
  test('selects a tile that is not yet selected', () => {
    const choice = createChooseTilesToMatchDieRoll(7)
    const result = toggleTile(choice, 4)
    expect(result.selectedTiles).toEqual([4])
  })

  test('unselects a tile that is already selected', () => {
    const choice = { diceTotal: 7, selectedTiles: [4] }
    const result = toggleTile(choice, 4)
    expect(result.selectedTiles).toEqual([])
  })

  test('does not mutate the choice passed in', () => {
    const choice = createChooseTilesToMatchDieRoll(7)
    toggleTile(choice, 4)
    expect(choice.selectedTiles).toEqual([])
  })
})

describe('isValidSelection', () => {
  test('is true when the selected tiles sum to the dice total', () => {
    expect(isValidSelection({ diceTotal: 7, selectedTiles: [4, 3] })).toBe(true)
  })

  test('is false when the selected tiles do not sum to the dice total', () => {
    expect(isValidSelection({ diceTotal: 7, selectedTiles: [4] })).toBe(false)
  })

  test('is false for an empty selection', () => {
    expect(isValidSelection({ diceTotal: 7, selectedTiles: [] })).toBe(false)
  })
})

describe('canCommit', () => {
  test('is true for a valid, non-empty selection', () => {
    expect(canCommit({ diceTotal: 7, selectedTiles: [4, 3] })).toBe(true)
  })

  test('is false for an empty selection even if the total is 0', () => {
    expect(canCommit({ diceTotal: 0, selectedTiles: [] })).toBe(false)
  })
})

describe('hasAnyValidCombination', () => {
  test('is true when some subset of available tiles sums to the total', () => {
    const board = { availableTiles: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
    expect(hasAnyValidCombination(board, 7)).toBe(true)
  })

  test('is false when no subset of available tiles sums to the total', () => {
    const board = { availableTiles: [2, 7] }
    expect(hasAnyValidCombination(board, 6)).toBe(false)
  })

  test('is true for a single-tile match', () => {
    const board = { availableTiles: [2, 7] }
    expect(hasAnyValidCombination(board, 7)).toBe(true)
  })

  test('is false on an empty board', () => {
    expect(hasAnyValidCombination({ availableTiles: [] }, 7)).toBe(false)
  })
})
