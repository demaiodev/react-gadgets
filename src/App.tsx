import { useState } from "react";
import UserDirectory from "./UserDirectory";
import TrafficLight from "./TrafficLight";
import Stopwatch from "./Stopwatch";
import TicTacToe from "./TicTacToe";
import JobBoard from "./JobBoard";
import TransferList from "./TransferList";
import Counter from "./Counter";
import TempConverter from "./TempConverter";
import TodoList from "./TodoList";
import DiceRoller from "./DiceRoller";

const APP_ROUTES = [
  { path: "dice-roller", title: "Dice Roller", component: DiceRoller },
  { path: "todo-list", title: "Todo List", component: TodoList },
  {
    path: "temp-converter",
    title: "Temperature Converter",
    component: TempConverter,
  },
  { path: "counter", title: "Counter", component: Counter },
  { path: "transfer-list", title: "Transfer List", component: TransferList },
  { path: "job-board", title: "Job Board", component: JobBoard },
  { path: "tic-tac-toe", title: "Tic Tac Toe", component: TicTacToe },
  { path: "stopwatch", title: "Stopwatch", component: Stopwatch },
  { path: "traffic-light", title: "Traffic Light", component: TrafficLight },
  { path: "user-directory", title: "User Directory", component: UserDirectory },
];

const Home = () => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-gray-300">
    <h1 className="text-5xl font-extrabold text-indigo-400 mb-4">
      React App Portfolio
    </h1>
    <p className="text-xl mb-8 text-center">
      Select an application from the sidebar to view its implementation.
    </p>
    <div className="text-center text-gray-400">
      <p className="mb-2">
        This portfolio showcases various React applications demonstrating
        different functionalities and UI components.
      </p>
      <p className="mb-2">
        Built with React, TypeScript, and Tailwind CSS by{" "}
        <a
          href="https://github.com/demaiodev"
          className="text-indigo-400 hover:underline"
        >
          Chris
        </a>
      </p>
    </div>
  </div>
);

export default function App() {
  const [currentPath, setCurrentPath] = useState("home");

  const renderComponent = () => {
    if (currentPath === "home") {
      return <Home />;
    }

    const ActiveComponent = APP_ROUTES.find(
      (route) => route.path === currentPath
    )?.component;

    if (ActiveComponent) {
      return <ActiveComponent />;
    }

    return (
      <div className="flex items-center justify-center h-full text-red-400 text-3xl font-bold">
        404 | Application Not Found
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      {/* Navigation Sidebar */}
      <nav className="flex-shrink-0 w-full md:w-64 bg-gray-800 p-4 border-r border-gray-700 shadow-xl md:min-h-screen">
        <h1 className="text-2xl font-bold text-indigo-400 mb-6 border-b pb-3 border-gray-700">
          My Projects
        </h1>

        <ul className="space-y-2">
          {/* Home Link */}
          <li>
            <button
              onClick={() => setCurrentPath("home")}
              className={`w-full text-left p-3 rounded-lg font-semibold transition-colors duration-200 ${
                currentPath === "home"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              Home
            </button>
          </li>
          {/* App Links generated from APP_ROUTES */}
          {APP_ROUTES.map((route) => (
            <li key={route.path}>
              <button
                onClick={() => setCurrentPath(route.path)}
                className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                  currentPath === route.path
                    ? "bg-gray-700 text-green-400 font-bold"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {route.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-10 flex flex-col justify-center">
        {renderComponent()}
      </main>
    </div>
  );
}
