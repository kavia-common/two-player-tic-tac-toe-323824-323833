import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

function getSquare(index) {
  return screen.getByTestId(`square-${index}`);
}

describe("Tic Tac Toe", () => {
  test("starts with X as the next player", () => {
    render(<App />);
    expect(screen.getByTestId("status")).toHaveTextContent("Next player: X");
  });

  test("alternates turns between X and O when clicking empty squares", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getSquare(0));
    expect(getSquare(0)).toHaveTextContent("X");
    expect(screen.getByTestId("status")).toHaveTextContent("Next player: O");

    await user.click(getSquare(1));
    expect(getSquare(1)).toHaveTextContent("O");
    expect(screen.getByTestId("status")).toHaveTextContent("Next player: X");
  });

  test("detects a winner and prevents further moves", async () => {
    const user = userEvent.setup();
    render(<App />);

    // X wins across the top row: 0,1,2
    await user.click(getSquare(0)); // X
    await user.click(getSquare(3)); // O
    await user.click(getSquare(1)); // X
    await user.click(getSquare(4)); // O
    await user.click(getSquare(2)); // X -> win

    expect(screen.getByTestId("status")).toHaveTextContent("Winner: X");

    // Attempt another move should not change anything.
    await user.click(getSquare(5));
    expect(getSquare(5)).toHaveTextContent("");
  });

  test("detects a draw when the board is full with no winner", async () => {
    const user = userEvent.setup();
    render(<App />);

    // A known draw sequence:
    // X O X
    // X X O
    // O X O
    const moves = [0, 1, 2, 5, 3, 4, 7, 6, 8];
    for (const m of moves) {
      await user.click(getSquare(m));
    }

    expect(screen.getByTestId("status")).toHaveTextContent("Draw!");
  });

  test("restart clears the board and resets next player to X", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getSquare(0));
    expect(getSquare(0)).toHaveTextContent("X");

    await user.click(screen.getByRole("button", { name: /restart/i }));

    expect(getSquare(0)).toHaveTextContent("");
    expect(getSquare(1)).toHaveTextContent("");
    expect(getSquare(2)).toHaveTextContent("");
    expect(screen.getByTestId("status")).toHaveTextContent("Next player: X");
  });
});
