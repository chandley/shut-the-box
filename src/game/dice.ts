import type { Board } from './board'
import { highestAvailable } from './board'

export function rollDice(count: 1 | 2): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1)
}

export function diceTotal(values: number[]): number {
  return values.reduce((total, value) => total + value, 0)
}

export function canChooseDiceCount(board: Board): boolean {
  const highest = highestAvailable(board)
  return highest !== undefined && highest <= 6
}
