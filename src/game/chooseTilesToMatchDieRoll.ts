import type { Board } from './board'

export type ChooseTilesToMatchDieRoll = {
  diceTotal: number
  selectedTiles: number[]
}

export function createChooseTilesToMatchDieRoll(diceTotal: number): ChooseTilesToMatchDieRoll {
  return { diceTotal, selectedTiles: [] }
}

export function toggleTile(
  choice: ChooseTilesToMatchDieRoll,
  tile: number,
): ChooseTilesToMatchDieRoll {
  const isSelected = choice.selectedTiles.includes(tile)
  return {
    diceTotal: choice.diceTotal,
    selectedTiles: isSelected
      ? choice.selectedTiles.filter((selected) => selected !== tile)
      : [...choice.selectedTiles, tile],
  }
}

export function isValidSelection(choice: ChooseTilesToMatchDieRoll): boolean {
  const sum = choice.selectedTiles.reduce((total, tile) => total + tile, 0)
  return sum === choice.diceTotal
}

export function canCommit(choice: ChooseTilesToMatchDieRoll): boolean {
  return isValidSelection(choice) && choice.selectedTiles.length > 0
}

export function hasAnyValidCombination(board: Board, diceTotal: number): boolean {
  const tiles = board.availableTiles

  function canMatch(index: number, remaining: number, usedAny: boolean): boolean {
    if (remaining === 0 && usedAny) return true
    if (index === tiles.length) return false

    if (canMatch(index + 1, remaining, usedAny)) return true

    const tile = tiles[index]
    if (tile <= remaining && canMatch(index + 1, remaining - tile, true)) return true

    return false
  }

  return canMatch(0, diceTotal, false)
}
