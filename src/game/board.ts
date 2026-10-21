export type Board = {
  availableTiles: number[]
}

export function createInitialBoard(): Board {
  return { availableTiles: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
}

export function removeTiles(board: Board, tiles: number[]): Board {
  for (const tile of tiles) {
    if (!board.availableTiles.includes(tile)) {
      throw new Error(`Tile ${tile} is not available on the board`)
    }
  }
  return { availableTiles: board.availableTiles.filter((tile) => !tiles.includes(tile)) }
}

export function boardScore(board: Board): number {
  return board.availableTiles.reduce((total, tile) => total + tile, 0)
}

export function isShut(board: Board): boolean {
  return board.availableTiles.length === 0
}

export function highestAvailable(board: Board): number | undefined {
  return board.availableTiles.length === 0 ? undefined : Math.max(...board.availableTiles)
}
