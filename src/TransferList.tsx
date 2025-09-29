import React, { useState, useCallback } from "react";
import type { ChangeEvent } from "react";
import {
  ArrowLeft,
  ArrowLeftFromLine,
  ArrowRight,
  ArrowRightFromLine,
} from "lucide-react";

type ListItems = Record<string, boolean>;
type SetListItems = React.Dispatch<React.SetStateAction<ListItems>>;

const LIST_A: ListItems = {
  HTML: false,
  JavaScript: false,
  CSS: false,
  TypeScript: false,
};

const LIST_B: ListItems = {
  React: false,
  Angular: false,
  Vue: false,
  Svelte: false,
};

interface ListProps {
  list: ListItems;
  setList: SetListItems;
  title: string;
}

const List: React.FC<ListProps> = ({ list, setList, title }) => {
  const handleItemChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { id, checked } = e.target;
      setList((prevList) => ({
        ...prevList,
        [id]: checked,
      }));
    },
    [setList]
  );

  return (
    <div className="w-full max-w-xs bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 h-96 overflow-y-auto">
      <h2 className="text-xl font-semibold text-indigo-400 mb-4 border-b border-gray-700 pb-2">
        {title}
      </h2>
      <ul className="space-y-3">
        {Object.entries(list).map(([text, isChecked]) => (
          <li key={text} className="flex items-center text-white">
            <input
              type="checkbox"
              id={text}
              checked={isChecked}
              onChange={handleItemChange}
              className="w-4 h-4 text-indigo-500 bg-gray-900 border-gray-600 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor={text}
              className={`ml-3 text-sm font-medium ${
                isChecked ? "text-indigo-300" : "text-gray-200"
              }`}
            >
              {text}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface ControlsProps {
  setListA: SetListItems;
  setListB: SetListItems;
  listA: ListItems;
  listB: ListItems;
}

const Controls: React.FC<ControlsProps> = ({
  setListA,
  listA,
  setListB,
  listB,
}) => {
  const getSelectedItems = (list: ListItems) =>
    Object.entries(list).filter(([, isChecked]) => isChecked);

  const getUnselectedItems = (list: ListItems) =>
    Object.entries(list).filter(([, isChecked]) => !isChecked);

  const isAnySelected = (list: ListItems) => Object.values(list).some((v) => v);
  const handleMoveAll = (
    source: ListItems,
    target: ListItems,
    setSource: SetListItems,
    setTarget: SetListItems
  ) => {
    setTarget({ ...target, ...source });
    setSource({});
  };

  const handleMoveSelected = (
    source: ListItems,
    target: ListItems,
    setSource: SetListItems,
    setTarget: SetListItems
  ) => {
    const selected = getSelectedItems(source);
    const unselected = getUnselectedItems(source);

    const itemsToMove: ListItems = Object.fromEntries(selected);
    setSource(Object.fromEntries(unselected));
    setTarget({ ...target, ...itemsToMove });
  };
  const arrowSize = 20;
  const arrowStroke = 2;

  const baseButtonClass =
    "p-0 w-12 h-12 flex items-center justify-center text-xl font-extrabold rounded-full text-white shadow-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col space-y-4 mx-8">
      <button
        onClick={() => handleMoveAll(listB, listA, setListB, setListA)}
        className={`${baseButtonClass} bg-red-600 hover:bg-red-700`}
        disabled={Object.keys(listB).length === 0}
        aria-label="Move all items from Frameworks to Fundamentals"
      >
        <span className="w-5 h-5">
          <ArrowLeftFromLine size={arrowSize} strokeWidth={arrowStroke} />
        </span>
      </button>
      <button
        disabled={!isAnySelected(listB)}
        onClick={() => handleMoveSelected(listB, listA, setListB, setListA)}
        className={`${baseButtonClass} bg-indigo-600 hover:bg-indigo-700`}
        aria-label="Move selected items from Frameworks to Fundamentals"
      >
        <span className="w-5 h-5">
          <ArrowLeft size={arrowSize} strokeWidth={arrowStroke} />
        </span>
      </button>
      <button
        disabled={!isAnySelected(listA)}
        onClick={() => handleMoveSelected(listA, listB, setListA, setListB)}
        className={`${baseButtonClass} bg-indigo-600 hover:bg-indigo-700`}
        aria-label="Move selected items from Fundamentals to Frameworks"
      >
        <span className="w-5 h-5">
          <ArrowRight size={arrowSize} strokeWidth={arrowStroke} />
        </span>
      </button>
      <button
        onClick={() => handleMoveAll(listA, listB, setListA, setListB)}
        className={`${baseButtonClass} bg-red-600 hover:bg-red-700`}
        disabled={Object.keys(listA).length === 0}
        aria-label="Move all items from Fundamentals to Frameworks"
      >
        <span className="w-5 h-5">
          <ArrowRightFromLine size={arrowSize} strokeWidth={arrowStroke} />
        </span>
      </button>
    </div>
  );
};

export default function TransferList() {
  const [listA, setListA] = useState<ListItems>(LIST_A);
  const [listB, setListB] = useState<ListItems>(LIST_B);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-extrabold text-indigo-400 mb-8 drop-shadow-black drop-shadow-sm">
        Transfer Lists
      </h1>
      <div className="flex justify-center items-stretch sm:items-center w-full max-w-4xl p-6 bg-gray-900 rounded-2xl">
        <List list={listA} setList={setListA} title="Fundamentals" />
        <Controls
          setListA={setListA}
          listA={listA}
          setListB={setListB}
          listB={listB}
        />
        <List list={listB} setList={setListB} title="Frameworks" />
      </div>
    </div>
  );
}
