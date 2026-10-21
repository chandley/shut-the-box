import { diceTotal, canChooseDiceCount, rollDice } from '../game/dice'

describe('diceTotal', () => {
  test('sums a two-value roll', () => {
    expect(diceTotal([4, 3])).toBe(7)
  })

  test('sums a one-value roll', () => {
    expect(diceTotal([5])).toBe(5)
  })
})

describe('canChooseDiceCount', () => {
  test('is true when nothing above 6 remains available', () => {
    expect(canChooseDiceCount({ availableTiles: [1, 2, 3, 4, 5, 6] })).toBe(true)
  })

  test('is false when a tile above 6 is still available', () => {
    expect(canChooseDiceCount({ availableTiles: [1, 2, 7] })).toBe(false)
  })
})

describe('rollDice', () => {
  test('rolling 1 die returns a single value between 1 and 6', () => {
    const values = rollDice(1)
    expect(values).toHaveLength(1)
    expect(values[0]).toBeGreaterThanOrEqual(1)
    expect(values[0]).toBeLessThanOrEqual(6)
  })

  test('rolling 2 dice returns two values each between 1 and 6', () => {
    const values = rollDice(2)
    expect(values).toHaveLength(2)
    values.forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(6)
    })
  })
})
