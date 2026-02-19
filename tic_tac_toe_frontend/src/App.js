import React, { useMemo, useState } from "react";
import "./App.css";

const PLAYERS = {
  X: "X",
  O: "O",
};

const WINNING_LINES = [
  // rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonals
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Calculates the winner and the winning line (if any) for a given 3x3 board.
 * @param {Array<null|"X"|"O">} squares - 9-element board.
 * @returns {{winner: null|"X"|"O", line: null|number[]}}
 */
function calculateWinner(squares) {
  for (const [a, b, c] of WINNING_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

/**
 * True if all squares are filled and there is no winner.
 * @param {Array<null|"X"|"O">} squares
 * @param {null|"X"|"O"} winner
 * @returns {boolean}
 */
function isDraw(squares, winner) {
  return !winner && squares.every((v) => v !== null);
}

// PUBLIC_INTERFACE
function App() {
  /** Board squares: null | "X" | "O" */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line: winningLine } = useMemo(
    () => calculateWinner(squares),
    [squares]
  );

  const draw = useMemo(() => isDraw(squares, winner), [squares, winner]);

  const currentPlayer = xIsNext ? PLAYERS.X : PLAYERS.O;

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (draw) return "Draw!";
    return `Next player: ${currentPlayer}`;
  }, [winner, draw, currentPlayer]);

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    // Ignore clicks if game is over or square already taken.
    if (winner || squares[index] !== null) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[index] = currentPlayer;
      return next;
    });
    setXIsNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function restartGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="App">
      <main className="page">
        <section className="gameCard" aria-label="Tic Tac Toe game">
          <header className="header">
            <div className="titleBlock">
              <h1 className="title">Tic Tac Toe</h1>
              <p className="subtitle">Two players, one device</p>
            </div>

            <button className="btn btnSecondary" onClick={restartGame} type="button">
              Restart
            </button>
          </header>

          <div
            className="status"
            role="status"
            aria-live="polite"
            data-testid="status"
          >
            {statusText}
          </div>

          <div className="board" role="grid" aria-label="3 by 3 board">
            {squares.map((value, idx) => {
              const isWinningSquare = winningLine?.includes(idx) ?? false;
              return (
                <button
                  key={idx}
                  type="button"
                  className={`square ${isWinningSquare ? "squareWinning" : ""}`}
                  onClick={() => handleSquareClick(idx)}
                  disabled={Boolean(winner) || value !== null}
                  role="gridcell"
                  aria-label={`Square ${idx + 1}${value ? `: ${value}` : ""}`}
                  data-testid={`square-${idx}`}
                >
                  <span className={`mark ${value ? "markVisible" : ""}`}>
                    {value ?? ""}
                  </span>
                </button>
              );
            })}
          </div>

          <footer className="footer">
            <div className="hint">
              {winner || draw ? (
                <span>
                  Press <strong>Restart</strong> to play again.
                </span>
              ) : (
                <span>
                  Tip: take the center to control more winning lines.
                </span>
              )}
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
