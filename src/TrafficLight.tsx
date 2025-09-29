import { useState, useEffect } from "react";
import { CirclePlus } from "lucide-react";

type LightColor = "red" | "yellow" | "green";

interface LightConfig {
  duration: number;
  next: LightColor;
}

interface LightsState {
  red: LightConfig;
  yellow: LightConfig;
  green: LightConfig;
}

const lights: LightsState = {
  red: {
    duration: 4000,
    next: "green",
  },
  yellow: {
    duration: 500,
    next: "red",
  },
  green: {
    duration: 3000,
    next: "yellow",
  },
};

export default function TrafficLight() {
  const [amount, setAmount] = useState<number>(1);
  return (
    <div className="flex justify-center items-center h-150">
      <div className="bg-gray-900 flex flex-col items-center justify-center p-4 mt-auto">
        <h1 className="text-4xl font-extrabold text-indigo-100 drop-shadow-black drop-shadow-sm">
          Traffic Light
        </h1>
        <button
          onClick={() => setAmount(amount + 1)}
          className="flex w-45 justify-around items-center mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-full shadow-lg transition-transform duration-150 transform active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          <CirclePlus /> Add light
        </button>
        <div className="flex items-center justify-center w-min m-6">
          {Array.from({ length: amount }).map((_, index) => (
            <div>
              <Light key={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Light() {
  const [currentLight, setCurrentLight] = useState<LightColor>("red");

  useEffect(() => {
    const currentConfig = lights[currentLight];
    const timeoutId = setTimeout(() => {
      setCurrentLight(currentConfig.next);
    }, currentConfig.duration);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentLight]);

  const getLightClass = (color: LightColor): string => {
    const activeColor = currentLight === color ? color : "gray-600";
    switch (activeColor) {
      case "red":
        return "bg-red-500 shadow-red-500/50";
      case "yellow":
        return "bg-yellow-400 shadow-yellow-400/50";
      case "green":
        return "bg-green-500 shadow-green-500/50";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="flex flex-col items-center m-2">
      <div className="bg-gray-800 p-3 rounded-2xl flex flex-col items-center shadow-2xl space-y-3 border-4 border-gray-600">
        {(Object.keys(lights) as LightColor[]).map((color) => {
          return (
            <div
              key={color}
              className={`
                                w-20 h-20 rounded-full 
                                transition-all duration-300 ease-in-out 
                                shadow-lg
                                ${getLightClass(color)}
                                ${currentLight === color ? "shadow-2xl" : ""}
                            `}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
