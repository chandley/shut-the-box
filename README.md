# shut-the-box

A simple implementation of shut-the-box implemented using Claude Code.

Available on github pages [here](https://chandley.github.io/shut-the-box)

I wanted to see if we do stricter planning with Claude before implementing, if it improves the readability of the code.

A minimal Node + React + TypeScript project. Built with [Vite](https://vite.dev/).

## Rules

Throw the dice and add together. Flip 1 or more tiles that equal the total they rolled - these are then removed from play for the rest of the game. 

The game ends when a matching selection cannot be found, or all the tiles have been flipped.

[More details on rules](./docs/shut-the-box.md)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes bundled with Node.js)

## Running locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the URL printed in the terminal (typically [http://localhost:5173](http://localhost:5173)) in your browser.

## Other commands

- `npm run build` — type-checks and builds a production bundle into `dist/`
- `npm run preview` — serves the production build locally
- `npm run dev` — serves the production build locally
- `npm run lint` — runs ESLint over the project
- `npm run test` — show backend test coverage

