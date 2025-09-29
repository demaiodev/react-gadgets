import { useState, useEffect } from "react";

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState<string>("0.00");
  const [counting, setCounting] = useState<boolean>(false);
  const [start, setStart] = useState<number>(0);

  useEffect(() => {
    if (!counting) return;

    const id = setInterval(() => {
      const now = performance.now();
      setElapsed(((now - start) / 1000).toFixed(2));
    }, 10);

    return () => clearInterval(id);
  }, [counting, start]);

  const formatTime = (time: string) => {
    const parts = time.split(".");
    const seconds = parts[0] || "0";
    const milliseconds = parts[1] ? parts[1].padEnd(2, "0") : "00";

    const paddedSeconds = seconds.padStart(2, "0");

    return { seconds: paddedSeconds, milliseconds };
  };

  const { seconds, milliseconds } = formatTime(elapsed);

  const buttonText = counting ? "Pause" : start !== 0 ? "Resume" : "Start";
  const buttonColor = counting
    ? "bg-red-500 hover:bg-red-600"
    : start !== 0
    ? "bg-green-500 hover:bg-green-600"
    : "bg-indigo-500 hover:bg-indigo-600";
  const buttonIsActive = counting || start !== 0;

  const handleStartPause = () => {
    if (!counting && start === 0) {
      setStart(performance.now());
      setCounting(true);
    } else if (counting) {
      setCounting(false);
    } else {
      const pausedTime = parseFloat(elapsed) * 1000;
      setStart(performance.now() - pausedTime);
      setCounting(true);
    }
  };

  const handleReset = () => {
    setStart(0);
    setElapsed("0.00");
    setCounting(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border-4 border-gray-700 w-full max-w-sm flex flex-col items-center space-y-8">
        <div className="text-white font-mono text-center">
          <p className="text-8xl font-extrabold tracking-tight">
            {seconds}
            <span className="text-4xl text-gray-400">s</span>
          </p>
          <p className="text-3xl text-yellow-400 font-medium">
            {milliseconds}
            <span className="text-xl">ms</span>
          </p>
        </div>

        <div className="flex space-x-4 w-full">
          <button
            onClick={handleStartPause}
            className={`flex-1 px-6 py-3 rounded-full text-white font-bold transition-all duration-200 shadow-lg ${buttonColor} transform active:scale-95`}
          >
            {buttonText}
          </button>

          <button
            onClick={handleReset}
            disabled={!buttonIsActive}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-200 shadow-lg ${
              !buttonIsActive
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400 active:bg-gray-500"
            } transform active:scale-95`}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
