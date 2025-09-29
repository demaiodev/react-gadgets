import { useState, useEffect } from "react";

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
  //todo: handle adding additional lights in varying layouts
  return (
    <div>
      <Light />
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-indigo-400 mb-6 drop-shadow-black drop-shadow-md">
          Traffic Light
        </h1>
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
    </div>
  );
}
