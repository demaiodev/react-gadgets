import React, { useState } from "react";
import { ListTodo, Trash2, Circle, CheckCircle } from "lucide-react";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

function getId(): string {
  return crypto.randomUUID();
}

const START_ITEMS: TodoItem[] = [
  { id: getId(), text: "Pet the dog (Charlie)", completed: false },
  { id: getId(), text: "Check email", completed: true },
  { id: getId(), text: "Standup updates", completed: false },
  { id: getId(), text: "PR reviews", completed: false },
];

export default function TodoList() {
  const [list, setList] = useState<TodoItem[]>(START_ITEMS);
  const [text, setText] = useState("");

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();

    if (!trimmedText) return;

    const newItem: TodoItem = {
      id: getId(),
      text: trimmedText,
      completed: false,
    };

    setList((currentList) => [...currentList, newItem]);
    setText("");
  };

  const handleDelete = (id: string) => {
    setList((currentList) => currentList.filter((item) => item.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setList((currentList) =>
      currentList.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const mainContainerClasses =
    "min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4";
  const cardClasses =
    "bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg space-y-6 border border-gray-700";
  const inputClasses =
    "w-full p-3 text-lg text-white bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200";
  const buttonClasses =
    "p-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md flex-shrink-0";
  const deleteButtonClasses =
    "p-2 ml-4 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm flex items-center justify-center";

  return (
    <div className={mainContainerClasses}>
      <div className={cardClasses}>
        <h1 className="text-2xl font-extrabold text-center text-indigo-100 flex items-center justify-between space-x-3 drop-shadow-black drop-shadow-sm">
          <ListTodo className="w-8 h-8 text-white" />
          <span className="text-green-700 ">// TODO: Finish List</span>
        </h1>
        <form onSubmit={handleAddTodo} className="flex space-x-3">
          <input
            type="text"
            placeholder="Add a new task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={inputClasses}
          />
          <button type="submit" className={buttonClasses}>
            Add
          </button>
        </form>
        <ul className="space-y-3">
          {list.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-700 rounded-xl shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center flex-1 min-w-0">
                <button
                  onClick={() => handleToggleComplete(item.id)}
                  className="p-1 rounded-full hover:bg-gray-600 transition-colors duration-150 flex-shrink-0"
                  aria-label={
                    item.completed ? "Mark incomplete" : "Mark complete"
                  }
                >
                  {item.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-indigo-100" />
                  )}
                </button>
                <span
                  className={`ml-4 text-white text-lg ${
                    item.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {item.text}
                </span>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className={deleteButtonClasses}
                aria-label={`Delete task: ${item.text}`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>

        {list.length === 0 && (
          <p className="text-center text-gray-500 italic">
            No tasks yet! Time to add one.
          </p>
        )}
      </div>
    </div>
  );
}
