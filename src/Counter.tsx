import React, { useReducer } from "react";
import { RefreshCcw, Undo2, Zap } from "lucide-react";

type MathActionType = "increment" | "decrement" | "double" | "halve";
type ControlActionType = "reset" | "undo" | "redo";

interface HistoryEntry {
  type: MathActionType;
  op: string; // The symbol (+1, x2, /2, -1)
  oldVal: number;
  newVal: number;
}

interface State {
  value: number;
  history: HistoryEntry[];
}

type Action =
  | { type: ControlActionType }
  | (HistoryEntry & { type: MathActionType }); // Math actions carry all history payload data

type FunctionLookup = Record<MathActionType, (val: number) => number>;

const functionLookup: FunctionLookup = {
  increment: (val: number) => val + 1,
  decrement: (val: number) => val - 1,
  double: (val: number) => val * 2,
  halve: (val: number) => val / 2,
};

function reducer(state: State, action: Action): State {
  if (action.type === "reset") {
    return { value: 0, history: [] };
  }

  if (action.type === "undo") {
    if (state.history.length === 0) return state;
    return {
      value: state.history.at(-1)!.oldVal,
      history: state.history.slice(0, -1),
    };
  }

  if (action.type === "redo") {
    const lastEntry = state.history.at(-1);
    if (!lastEntry) return state;

    const mathActionType = lastEntry.type;
    const newVal = functionLookup[mathActionType](state.value);

    const newHistoryEntry: HistoryEntry = {
      type: mathActionType,
      op: lastEntry.op,
      oldVal: state.value,
      newVal: newVal,
    };

    return {
      value: newVal,
      history: [...state.history, newHistoryEntry],
    };
  }

  const mathAction = action as HistoryEntry & { type: MathActionType };

  return {
    value: functionLookup[mathAction.type](state.value),
    history: [...state.history, mathAction],
  };
}

interface EffectButtonProps {
  text: string;
  callbackFn: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  isControl?: boolean;
}

const EffectButton: React.FC<EffectButtonProps> = ({
  text,
  callbackFn,
  disabled = false,
  icon,
  isControl = false,
}) => {
  const baseClasses =
    "flex items-center justify-center space-x-2 font-semibold transition-all duration-200 rounded-lg shadow-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";

  const controlClasses =
    "bg-gray-700 hover:bg-gray-600 text-white w-24 py-2 border-b-4 border-gray-800 hover:border-indigo-500";
  const mathClasses =
    "bg-indigo-600 hover:bg-indigo-700 text-white w-16 h-16 text-2xl border-b-4 border-indigo-700 hover:border-white";

  return (
    <button
      className={`${baseClasses} ${isControl ? controlClasses : mathClasses}`}
      onClick={callbackFn}
      disabled={disabled}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span>{text}</span>
    </button>
  );
};

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { value: 0, history: [] });

  const currentVal = state.value;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg space-y-6 border border-gray-700">
        <h1 className="text-4xl font-extrabold text-center text-indigo-100 drop-shadow-black drop-shadow-sm">
          Undoable Counter
        </h1>
        <div className="text-center p-6 bg-gray-900 rounded-xl shadow-inner border border-indigo-500">
          <h2 className="text-xl font-medium text-gray-400 mb-1">
            Current Value
          </h2>
          <span className="text-7xl font-extrabold text-indigo-100 block break-words">
            {currentVal.toFixed(3).replace(/\.000$/, "")}
          </span>
        </div>
        <div className="flex justify-center space-x-4 p-2" id="button-controls">
          <EffectButton
            text={"Undo"}
            isControl
            disabled={state.history.length === 0}
            icon={<Undo2 size={20} />}
            callbackFn={() => {
              dispatch({ type: "undo" });
            }}
          />
          <EffectButton
            text={"Redo"}
            isControl
            disabled={state.history.length === 0}
            icon={<RefreshCcw size={20} />}
            callbackFn={() => {
              dispatch({ type: "redo" });
            }}
          />
          <EffectButton
            text={"Reset"}
            isControl
            icon={<Zap size={20} />}
            callbackFn={() => dispatch({ type: "reset" })}
          />
        </div>

        <hr className="border-gray-700" />
        <div className="flex justify-between items-center px-4" id="effects">
          <EffectButton
            text={"/2"}
            callbackFn={() =>
              dispatch({
                type: "halve",
                op: "/2",
                oldVal: currentVal,
                newVal: functionLookup["halve"](currentVal),
              })
            }
          />
          <EffectButton
            text={"-1"}
            callbackFn={() =>
              dispatch({
                type: "decrement",
                op: "-1",
                oldVal: currentVal,
                newVal: functionLookup["decrement"](currentVal),
              })
            }
          />
          <div className="w-16 h-16" />
          <EffectButton
            text={"+1"}
            callbackFn={() =>
              dispatch({
                type: "increment",
                op: "+1",
                oldVal: currentVal,
                newVal: functionLookup["increment"](currentVal),
              })
            }
          />
          <EffectButton
            text={"x2"}
            callbackFn={() =>
              dispatch({
                type: "double",
                op: "x2",
                oldVal: currentVal,
                newVal: functionLookup["double"](currentVal),
              })
            }
          />
        </div>
        <hr className="border-gray-700" />
        <h3 className="text-lg font-semibold text-gray-300 mb-2">
          Operation History
        </h3>
        <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-700">
          <table
            className="min-w-full divide-y divide-gray-700"
            id="effect-history"
          >
            <thead className="bg-gray-700 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider w-1/3">
                  Op
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider w-1/3">
                  Old Value
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider w-1/3">
                  New Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {state.history.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-sm text-gray-500 text-center italic"
                  >
                    No operations recorded yet.
                  </td>
                </tr>
              ) : (
                state.history.map((action, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-indigo-300">
                      {action.op}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-400">
                      {action.oldVal.toFixed(3).replace(/\.000$/, "")}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-200">
                      {action.newVal.toFixed(3).replace(/\.000$/, "")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
