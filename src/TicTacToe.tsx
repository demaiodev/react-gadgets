import { useState } from "react";

interface PlayerData {
  mark: "X" | "O";
  next: "p1" | "p2";
}

type PlayerKey = "p1" | "p2";
type BoardMark = PlayerData["mark"] | null;

const PLAYERS: Record<PlayerKey, PlayerData> = {
  p1: {
    mark: "X",
    next: "p2",
  },
  p2: {
    mark: "O",
    next: "p1",
  },
};

const SOLUTIONS: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getEmptyArray(length: number): BoardMark[] {
  return new Array(length).fill(null);
}

function checkWinner(board: BoardMark[]): BoardMark {
  for (let i = 0; i < SOLUTIONS.length; i++) {
    const [x, y, z] = SOLUTIONS[i];
    if (board[x] !== null && board[x] === board[y] && board[y] === board[z]) {
      return board[x] as BoardMark;
    }
  }
  return null;
}

function getGameStatus(
  player: PlayerData,
  winner: BoardMark,
  board: BoardMark[]
): string {
  if (winner) return `${winner} has won!`;
  if (board.every((mark) => mark !== null)) return `Draw!`;
  return `${player.mark}'s Turn`;
}

export default function TicTacToe() {
  const [board, setBoard] = useState<BoardMark[]>(getEmptyArray(9));
  const [currentPlayer, setCurrentPlayer] = useState<PlayerData>(PLAYERS["p1"]);

  const winner: BoardMark = checkWinner(board);
  const status: string = getGameStatus(currentPlayer, winner, board);

  const handleClick = (index: number, mark: BoardMark) => {
    if (mark !== null || winner !== null) return;
    const cloned = [...board];
    cloned[index] = currentPlayer.mark;
    setBoard(cloned);
    setCurrentPlayer(PLAYERS[currentPlayer.next]);
  };

  const handleReset = () => {
    setBoard(getEmptyArray(9));
    setCurrentPlayer(PLAYERS["p1"]);
  };

  const getMarkColorClass = (mark: BoardMark): string => {
    if (mark === PLAYERS["p1"].mark) return "text-red-500";
    if (mark === PLAYERS["p2"].mark) return "text-blue-500";
    return "text-gray-300";
  };

  const getStatusColorClass = (): string => {
    if (winner) return "text-green-400";
    if (board.every((mark) => mark !== null)) return "text-yellow-400";
    return "text-white";
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-extrabold text-indigo-400 mb-4 tracking-wider">
        Tic-Tac-Toe
      </h1>
      <h4 className={`text-2xl font-semibold mb-8 ${getStatusColorClass()}`}>
        {status}
      </h4>
      <div className="grid grid-cols-3 grid-rows-3 w-full max-w-sm aspect-square border-4 border-gray-700 rounded-lg shadow-2xl">
        {board.map((mark, index) => {
          return (
            <button
              key={index}
              disabled={mark !== null || winner !== null}
              onClick={() => handleClick(index, mark)}
              className={`
                bg-gray-800 
                border-gray-700 border 
                text-6xl font-bold 
                flex items-center justify-center 
                transition-all duration-150 ease-in-out
                ${getMarkColorClass(mark)}
                ${
                  mark === null && winner === null
                    ? "hover:bg-gray-700 active:bg-gray-600"
                    : "cursor-default"
                }
              `}
            >
              {mark}
            </button>
          );
        })}
      </div>
      <button
        onClick={handleReset}
        className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-full shadow-lg transition-transform duration-150 transform active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        Start New Game
      </button>
    </div>
  );
}
