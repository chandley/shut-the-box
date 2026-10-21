# Shut the Box — Domain model & abstractions

## Goal

Keep game rules completely independent of React/display concerns. The game logic
should be plain, pure, synchronous TypeScript — testable with no rendering involved.
The UI layer only reads state and dispatches intents; it contains no rules.

## Core entities

### Board

Tracks which tiles are still "up" (available to be chosen). A tile is flipped
over/removed once it's selected — "tile" names that mutable, game-specific
thing, deliberately narrower than a plain immutable `number`.

- `availableTiles: number[]` — starts as `[1, 2, 3, 4, 5, 6, 7, 8, 9]`
- `score` (derived) — sum of `availableTiles` (used when the game ends early)
- `isShut` (derived) — `availableTiles.length === 0` (the win condition)
- `removeTiles(tiles: number[]): Board` — pure; returns a *new* Board with
  those tiles taken out. **Throws** if any tile passed in isn't currently in
  `availableTiles` — removing a tile that was never (or no longer) on the
  board is a bug in the caller, not a state to silently tolerate.

### Dice

Pure helpers, no state of their own.

- `rollDice(count: 1 | 2): number[]`
- `diceTotal(values: number[]): number`
- `canChooseDiceCount(board: Board): boolean` — true only when no tile above 6
  is still available. The user may *choose* one die in that case; two dice is
  otherwise the only option.

The individual die values returned by `rollDice` exist only for rendering (the
UI needs to show two dice faces). They never enter the game state — the
orchestration layer calls `rollDice`, computes the total with `diceTotal`, and
passes only that total into `Game.startRound(total)`. If the display needs to
show the faces after that point, it holds them itself (e.g. local state in the
hook), entirely outside the game model.

### ChooseTilesToMatchDieRoll

Represents the in-progress tile selection for the current dice total, scoped
to one board state. This used to be called `Round`, but "round" is really the
*bigger* idea — choosing/rolling the dice, matching tiles, and detecting a
shut box all together — which is what `Game`'s `startRound`/`commitRound`
actions already cover below. This type only ever does the narrow middle part
(matching tiles to a total), so it's named for exactly that instead of
borrowing the bigger word.

- `diceTotal: number` — the number to match; the game logic has no notion of
  how many dice or what the individual faces were
- `selectedTiles: number[]` — subset of `board.availableTiles`, chosen so far
- `isValidSelection` (derived) — `sum(selectedTiles) === diceTotal`
- `canCommit` (derived) — `isValidSelection && selectedTiles.length > 0`
  (this drives the grey → active button state; nothing else should)
- `toggleTile(tile: number): ChooseTilesToMatchDieRoll` — pure; selects/unselects
  `tile` in `selectedTiles`. Only callable pre-commit — this is what lets the
  user "unchoose" a tile before rolling again.
- `hasAnyValidCombination(board: Board): boolean` — subset-sum check: does *any*
  non-empty subset of `board.availableTiles` sum to `diceTotal`? If false, the
  round (and the game) is over.

### Game

Top-level orchestrator. A single immutable value representing "everything about
the game right now"; every action below returns a *new* `Game`, so it fits
naturally into a `useReducer`. `Game`'s own actions are where the full "round"
concept actually lives — taking in a dice total, tracking the in-progress
selection, committing it, and detecting a shut box.

- `status: 'playing' | 'ended'` — there is no separate "won" status. Shutting
  the box is simply the `ended` state with a score of zero; a regular
  game-over (no valid combination left) is `ended` with a positive score.
  `board.score === 0` is the only signal the display needs to pick the
  celebratory "shut the box!" message over the ordinary game-over message.
- `board: Board`
- `currentRound: ChooseTilesToMatchDieRoll | null` — the field is still called
  `currentRound` because, at the `Game` level, it *is* the round in progress;
  only the narrower type behind it was renamed.

Actions:

- `startRound(diceTotal: number)` — creates a new `ChooseTilesToMatchDieRoll`
  for that total (the caller already rolled the dice and reduced them to a
  total before calling this). If `!hasAnyValidCombination(board, diceTotal)`,
  immediately sets `status = 'ended'` — ending is detected right here, straight
  after the roll, before any selection happens, and `board.score` will be
  positive (tiles remain up).
- `toggleSelection(tile: number)` — delegates to `currentRound.toggleTile(tile)`.
  No-op once committed.
- `commitRound()` — only valid when `currentRound.canCommit`. Sets
  `board = removeTiles(board, currentRound.selectedTiles)`. If the resulting
  `board.isShut`, sets `status = 'ended'` (score is now zero — this is the
  shut-the-box ending, detected at the *end* of the round rather than right
  after rolling). Otherwise clears `currentRound`, ready for the next
  `startRound`.

## What the display layer does (and doesn't do)

React components:

- Render tiles from `board.availableTiles` (up vs. down)
- Render the dice faces from the individual roll values — these live in the
  hook (not in `Game`), computed by calling `rollDice` at roll time
- Render one button per available tile; clicking dispatches `toggleSelection(tile)`
- Style the roll-again button purely from `currentRound.canCommit` (grey vs. active)
- Render the end-of-game screen purely from `game.status === 'ended'`, choosing
  the celebratory "shut the box!" message when `board.score === 0` and an
  ordinary game-over message (with the score) otherwise
- Contain **no rules** — no sum checks, no subset-sum logic, no win/lose
  conditions. Every decision a component makes about what to show is read
  directly off `Game`/`Board`/`ChooseTilesToMatchDieRoll`, never recomputed in
  the component.

A `useGame()` hook wraps `useReducer(gameReducer, initialGame)` and is
responsible for calling `rollDice`/`diceTotal` and holding the individual die
faces alongside the reducer state, since those faces are the one piece of
"display-relevant roll data" that isn't part of `Game`. It's the only bridge
between the two layers.

## File layout

Everything is plain functions over plain data — no classes, nothing stateful
hidden inside a module. That's what makes each file trivial to unit test:
every function is "given this input, assert this output."

```
src/game/
  board.ts
  dice.ts
  chooseTilesToMatchDieRoll.ts
  game.ts

src/test/
  board.test.ts
  dice.test.ts
  chooseTilesToMatchDieRoll.test.ts
  game.test.ts

src/components/
  ...            — presentational only, driven by useGame() (not covered by Jest)
```

### `board.ts`
- `createInitialBoard(): Board`
- `removeTiles(board: Board, tiles: number[]): Board` — throws if any `tile`
  isn't in `board.availableTiles`
- `boardScore(board: Board): number`
- `isShut(board: Board): boolean`
- `highestAvailable(board: Board): number | undefined`

### `dice.ts`
- `rollDice(count: 1 | 2): number[]` — the one function in this whole layer
  that touches `Math.random()`; isolating it here keeps every other function
  deterministic and easy to test
- `diceTotal(values: number[]): number`
- `canChooseDiceCount(board: Board): boolean` — true only when
  `highestAvailable(board)` is `6` or less

### `chooseTilesToMatchDieRoll.ts`
- `createChooseTilesToMatchDieRoll(diceTotal: number): ChooseTilesToMatchDieRoll`
- `toggleTile(choice: ChooseTilesToMatchDieRoll, tile: number): ChooseTilesToMatchDieRoll`
- `isValidSelection(choice: ChooseTilesToMatchDieRoll): boolean`
- `canCommit(choice: ChooseTilesToMatchDieRoll): boolean`
- `hasAnyValidCombination(board: Board, diceTotal: number): boolean`

### `game.ts`
- `createInitialGame(): Game`
- `startRound(game: Game, diceTotal: number): Game`
- `toggleSelection(game: Game, tile: number): Game`
- `commitRound(game: Game): Game`

## Test plan

Since you want the Jest tests written before the implementation, this is the
list of cases to write per file, in dependency order (`board` → `dice` →
`chooseTilesToMatchDieRoll` → `game`, since each later file's tests will
construct its inputs using the earlier files' functions). No tests are
planned for `src/components`.

### `board.test.ts`
- `createInitialBoard()` returns `[1..9]`
- `removeTiles` removes the given tiles and leaves the rest untouched,
  without mutating the board passed in
- `removeTiles` throws if a tile isn't currently available — both for a
  single invalid tile, and when it's mixed in with otherwise-valid tiles
- `boardScore` sums the remaining tiles; `0` on an empty board
- `isShut` is `true` only when `availableTiles` is empty
- `highestAvailable` returns the max of `availableTiles`; returns
  `undefined` on an empty board

### `dice.test.ts`
- `diceTotal` sums a one- or two-value array
- `canChooseDiceCount` is `true` for a board like `[1,2,3,4,5,6]` (nothing
  above 6 left) and `false` for a board that still has e.g. `7`
- `rollDice(1)` returns one value in `1..6`; `rollDice(2)` returns two values
  each in `1..6` — since this is the one random function, assert the
  *shape* (length, range) rather than exact values; mock `Math.random` if you
  want to pin specific outcomes

### `chooseTilesToMatchDieRoll.test.ts`
- `createChooseTilesToMatchDieRoll` sets `diceTotal` and starts with empty
  `selectedTiles`
- `toggleTile` selects a tile not yet selected, and unselects it if it's
  already selected, without mutating the value passed in
- `isValidSelection` is `true` iff the selected tiles sum to `diceTotal`
  (including the empty-selection case, which should be `false`)
- `canCommit` is `isValidSelection && selectedTiles.length > 0` — assert
  it's `false` for an empty selection even if `diceTotal` were somehow `0`
- `hasAnyValidCombination`:
  - `true` when some subset sums to the total (e.g. board `[1..9]`, total
    `7`, matched by `7`, `4+3`, `5+2`, `6+1`, `4+2+1`)
  - `false` when no subset matches (the rulebook example: board `[2,7]`,
    total `6`)
  - `true` for a single-tile match (total equals one available tile
    directly)
  - `false` on an empty board

### `game.test.ts`
- `createInitialGame()` has `status: 'playing'`, the initial board, and
  `currentRound: null`
- `startRound` sets `currentRound` when a valid combination exists for that
  total, and leaves `status` as `'playing'`
- `startRound` sets `status: 'ended'` when no valid combination exists,
  leaving the board unchanged (so `boardScore` is positive)
- `toggleSelection` delegates to the current round's `toggleTile`, and is a
  no-op when there's no current round or the game has already ended
- `commitRound` with a valid, non-emptying selection: removes those tiles
  from the board, clears `currentRound`, `status` stays `'playing'`
- `commitRound` with a selection that empties the board: `status: 'ended'`
  and `boardScore(board) === 0`
- `commitRound` when `canCommit` is false: no-op, returns the game unchanged

## Verification

- Jest is wired up via `babel-jest` + `@babel/preset-typescript` (the project
  is ESM — `"type": "module"` in `package.json` — and Babel sidesteps the
  extra ESM configuration `ts-jest` would otherwise need). Run with `npm test`.
- All test files above should run and fail — currently with "Cannot find
  module" errors, since none of `board.ts`/`dice.ts`/
  `chooseTilesToMatchDieRoll.ts`/`game.ts` exist yet — before any
  implementation exists. That's the point of writing them first.
- Once implemented, all cases pass with no DOM/rendering involved.
- `src/components` stays outside this Jest setup entirely, per your request.
