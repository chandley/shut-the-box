type DiceTrayProps = {
  diceFaces: number[]
  hasCurrentRound: boolean
  canChooseDiceCount: boolean
  canCommit: boolean
  onRoll: (count: 1 | 2) => void
  onCommit: () => void
}

export function DiceTray({
  diceFaces,
  hasCurrentRound,
  canChooseDiceCount,
  canCommit,
  onRoll,
  onCommit,
}: DiceTrayProps) {
  return (
    <div className="dice-tray">
      <div className="dice-faces">
        {diceFaces.map((face, index) => (
          <div key={index} className="die">
            {face}
          </div>
        ))}
      </div>

      {hasCurrentRound ? (
        <button type="button" className="commit-button" disabled={!canCommit} onClick={onCommit}>
          {canCommit ? 'Confirm selection' : 'Select tiles'}
        </button>
      ) : (
        canChooseDiceCount && (
          <div className="dice-choice">
            <button type="button" className="roll-button" onClick={() => onRoll(1)}>
              Roll 1 die
            </button>
            <button type="button" className="roll-button" onClick={() => onRoll(2)}>
              Roll 2 dice
            </button>
          </div>
        )
      )}
    </div>
  )
}
