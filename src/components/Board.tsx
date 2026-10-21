import type { Board as BoardState } from '../game/board'

const ALL_TILES = [1, 2, 3, 4, 5, 6, 7, 8, 9]

type BoardProps = {
  board: BoardState
  selectedTiles: number[]
  canSelect: boolean
  onToggle: (tile: number) => void
}

export function Board({ board, selectedTiles, canSelect, onToggle }: BoardProps) {
  return (
    <div className="tile-row">
      {ALL_TILES.map((tile) => {
        const isAvailable = board.availableTiles.includes(tile)
        const isSelected = selectedTiles.includes(tile)
        return (
          <button
            key={tile}
            type="button"
            className={[
              'tile',
              isAvailable ? 'tile-up' : 'tile-down',
              isSelected ? 'tile-selected' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            disabled={!isAvailable || !canSelect}
            onClick={() => onToggle(tile)}
          >
            {tile}
          </button>
        )
      })}
    </div>
  )
}
