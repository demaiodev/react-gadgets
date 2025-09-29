import React, { useState } from "react";

type ConversionFunction = (value: number) => number;
type SetterFunction = React.Dispatch<React.SetStateAction<string>>;

const celsiusToFahrenheit: ConversionFunction = (value) => (value * 9) / 5 + 32;
const fahrenheitToCelsius: ConversionFunction = (value) =>
  ((value - 32) * 5) / 9;

export default function TempConverter() {
  const [celsius, setCelsius] = useState<string>("");
  const [fahrenheit, setFahrenheit] = useState<string>("");

  function handleInputChange(
    value: string,
    setter: SetterFunction,
    conversionFn: ConversionFunction,
    isCelsiusInput: boolean = false
  ) {
    setter(value);
    const numericValue = parseFloat(value);

    if (isNaN(numericValue) || value.trim() === "") {
      if (isCelsiusInput) {
        setFahrenheit("");
      } else {
        setCelsius("");
      }
      return;
    }

    const result = conversionFn(numericValue);

    if (isFinite(result)) {
      // Round to 2 decimal places for cleaner display and remove trailing .00
      const resultString = result.toFixed(2).replace(/\.00$/, "");
      if (isCelsiusInput) {
        setFahrenheit(resultString);
      } else {
        setCelsius(resultString);
      }
    } else {
      // Handle unexpected results (like Infinity)
      const errorMsg = "Error";
      if (isCelsiusInput) {
        setFahrenheit(errorMsg);
      } else {
        setCelsius(errorMsg);
      }
    }
  }

  const inputClasses =
    "w-full p-4 text-3xl font-mono text-white bg-gray-700 border-2 border-indigo-500 rounded-xl focus:ring-4 focus:ring-indigo-500/50 outline-none transition-all duration-200 shadow-xl";
  const labelClasses =
    "text-gray-300 text-lg font-semibold absolute top-[-10px] left-4 px-2 bg-gray-800 border rounded border-gray-500";
  const containerClasses =
    "relative bg-gray-800 p-2 rounded-xl shadow-lg flex-1 w-full";
  const mainContainerClasses =
    "min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4";
  const cardClasses =
    "bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-xl space-y-8 border border-gray-700";

  return (
    <div className={mainContainerClasses}>
      <div className={cardClasses}>
        <h1 className="text-4xl font-extrabold text-center text-indigo-100 drop-shadow-black drop-shadow-sm">
          Temperature Converter
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
          <div className={containerClasses}>
            <input
              id="celsius"
              type="number"
              placeholder="0"
              value={celsius}
              className={inputClasses}
              onChange={(event) => {
                handleInputChange(
                  event.target.value,
                  setCelsius,
                  celsiusToFahrenheit,
                  true
                );
              }}
            />
            <div className="label-container">
              <label htmlFor="celsius" className={labelClasses}>
                Celsius (°C)
              </label>
            </div>
          </div>
          <div className="text-4xl font-extrabold text-indigo-100">=</div>
          <div className={containerClasses}>
            <input
              id="fahrenheit"
              type="number"
              placeholder="32"
              value={fahrenheit}
              className={inputClasses}
              onChange={(event) => {
                handleInputChange(
                  event.target.value,
                  setFahrenheit,
                  fahrenheitToCelsius,
                  false
                );
              }}
            />
            <div className="label-container">
              <label htmlFor="fahrenheit" className={labelClasses}>
                Fahrenheit (°F)
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
