import React, { useState } from "react";

const Dice = ({ value }: { value: number }) => {
  return (
    <div className={`dice dice-${value}`}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className={`dice-dot dot-${i + 1}`}></div>
      ))}
    </div>
  );
};

export default function DiceRoller() {
  const [numberOfDice, setNumberOfDice] = useState<number>(1);
  const [rolledDice, setRolledDice] = useState<number[]>([]);
  const [displayDice, setDisplayDice] = useState(false);

  const getDiceNumber = (): number => {
    const min = 1;
    const max = 6;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleRoll = (e: React.FormEvent) => {
    e.preventDefault();

    if (numberOfDice < 1 || numberOfDice > 12) return;

    const newRolls: number[] = Array.from({ length: numberOfDice }, () =>
      getDiceNumber()
    );

    setRolledDice(newRolls);
    setDisplayDice(true);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setNumberOfDice(value);
    setDisplayDice(false);
  };

  const totalScore = rolledDice.reduce((sum, current) => sum + current, 0);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4">
      <style>{`
        .dice {
          width: 80px;
          height: 80px;
          background-color: #f7f7f7;
          border-radius: 12px;
          border: 2px outset rgb(213, 213, 213);
          box-shadow: 5px 2px 2px black;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          padding: 8px;
          box-sizing: border-box;
          position: relative;
          user-select: none;
        }

        .dice-dot {
          background-color: #333;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          justify-self: center;
          align-self: center;
          opacity: 0;
        }

        .dot-1 { grid-area: 3 / 1; } 
        .dot-2 { grid-area: 2 / 1; } 
        .dot-3 { grid-area: 1 / 1; } 
        .dot-4 { grid-area: 1 / 2; } 
        .dot-5 { grid-area: 3 / 3; } 
        .dot-6 { grid-area: 2 / 3; } 
        .dot-7 { grid-area: 1 / 3; } 
        .dot-8 { grid-area: 2 / 2; } 
        .dot-9 { grid-area: 3 / 2; } 

        .dice-1 .dot-8 { opacity: 1; }
        
        .dice-2 .dot-3, .dice-2 .dot-5 { opacity: 1; }

        .dice-3 .dot-1, .dice-3 .dot-8, .dice-3 .dot-7 { opacity: 1; }

        .dice-4 .dot-1, .dice-4 .dot-3, .dice-4 .dot-5, .dice-4 .dot-7 { opacity: 1; }
        
        .dice-5 .dot-1, .dice-5 .dot-3, .dice-5 .dot-5, .dice-5 .dot-7, .dice-5 .dot-8 { opacity: 1; }

        .dice-6 .dot-1, .dice-6 .dot-3, .dice-6 .dot-5, .dice-6 .dot-7, .dice-6 .dot-2, .dice-6 .dot-6 { opacity: 1; }

        .dice-6 .dot-2 { grid-area: 2 / 1; opacity: 1; }
        .dice-6 .dot-6 { grid-area: 2 / 3; opacity: 1; }
        .dice-6 .dot-3 { grid-area: 1 / 1; opacity: 1; }
        .dice-6 .dot-7 { grid-area: 1 / 3; opacity: 1; }
        .dice-6 .dot-1 { grid-area: 3 / 1; opacity: 1; }
        .dice-6 .dot-5 { grid-area: 3 / 3; opacity: 1; }
        
        .dice-1 .dot-8 { grid-area: 2 / 2; opacity: 1; }
        
        .dice-2 .dot-7 { grid-area: 1 / 3; opacity: 1; }
        .dice-2 .dot-1 { grid-area: 3 / 1; opacity: 1; }

        .dice-3 .dot-7 { grid-area: 1 / 3; opacity: 1; }
        .dice-3 .dot-8 { grid-area: 2 / 2; opacity: 1; }
        .dice-3 .dot-1 { grid-area: 3 / 1; opacity: 1; }

        .dice-4 .dot-3 { grid-area: 1 / 1; opacity: 1; }
        .dice-4 .dot-7 { grid-area: 1 / 3; opacity: 1; }
        .dice-4 .dot-1 { grid-area: 3 / 1; opacity: 1; }
        .dice-4 .dot-5 { grid-area: 3 / 3; opacity: 1; }
        
        .dice-5 .dot-3 { grid-area: 1 / 1; opacity: 1; }
        .dice-5 .dot-7 { grid-area: 1 / 3; opacity: 1; }
        .dice-5 .dot-8 { grid-area: 2 / 2; opacity: 1; }
        .dice-5 .dot-1 { grid-area: 3 / 1; opacity: 1; }
        .dice-5 .dot-5 { grid-area: 3 / 3; opacity: 1; }
        
      `}</style>

      <div className="flex flex-col items-center justify-center w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl space-y-6 mt-10 border border-gray-700">
        <h1 className="text-4xl font-extrabold text-indigo-400">Dice Roller</h1>

        <form className="flex flex-col w-full space-y-4" onSubmit={handleRoll}>
          <label
            htmlFor="dice-roll-input"
            className="text-lg font-medium text-gray-300 hidden"
          >
            Number of Dice (1-12)
          </label>
          <input
            id="dice-roll-input"
            className="w-full p-3 text-lg text-white bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            type="number"
            min="1"
            max="12"
            value={numberOfDice}
            onChange={handleAmountChange}
          />
          <button
            type="submit"
            className="p-3 font-bold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200"
          >
            Roll!
          </button>
        </form>

        {displayDice && (
          <div className="w-full space-y-4 pt-4 border-t border-gray-700">
            <h2 className="text-2xl font-bold text-center text-green-400">
              Total Score: {totalScore}
            </h2>
            <section className="flex flex-wrap justify-center gap-4 p-4 bg-gray-700 rounded-lg shadow-inner">
              {rolledDice.map((number, i) => (
                <Dice key={i} value={number} />
              ))}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
