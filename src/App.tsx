import { useState } from "react";
import { Menu, X } from "lucide-react";

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
  { path: "user-directory", title: "User Directory", component: UserDirectory },
  { path: "counter", title: "Fancy Counter", component: Counter },
  { path: "todo-list", title: "Todo List", component: TodoList },
  {
    path: "temp-converter",
    title: "Temp. Converter",
    component: TempConverter,
  },
  { path: "transfer-list", title: "Transfer Lists", component: TransferList },
  { path: "job-board", title: "Job Board", component: JobBoard },
  { path: "tic-tac-toe", title: "Tic Tac Toe", component: TicTacToe },
  { path: "dice-roller", title: "Dice Roller", component: DiceRoller },
  { path: "stopwatch", title: "Stopwatch", component: Stopwatch },
  { path: "traffic-light", title: "Traffic Light", component: TrafficLight },
];

const Home = () => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-gray-300">
    <h1 className="text-2xl font-extrabold text-indigo-100 mb-4 md:text-5xl text-center">
      React Components made by{" "}
      <a
        href="https://github.com/demaiodev"
        className="text-indigo-500 hover:underline hover:text-indigo-300"
        target="_blank"
        rel="noopener noreferrer"
      >
        Chris
      </a>
      .
    </h1>
    <p className="text-xl mb-8 text-center ">
      Select a component from the menu to view it.
    </p>
    <div className="text-center text-gray-400">
      <p className="mb-2">
        Built with React, TypeScript, Vite, and styled with Tailwind CSS.
      </p>
      <p className="mb-2">
        Source code for each component is available{" "}
        <a
          href="https://github.com/demaiodev/react-gadgets/tree/main/src"
          className="text-indigo-300 hover:underline hover:text-indigo-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </p>
    </div>
  </div>
);

export default function App() {
  const [currentPath, setCurrentPath] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setIsSidebarOpen(false);
  };

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
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 right-4 z-30 p-4 md:hidden bg-indigo-600 rounded-lg shadow-lg text-white"
        aria-label={isSidebarOpen ? "Close Menu" : "Open Menu"}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation Sidebar */}
      <nav
        className={`
          flex-shrink-0 w-64 bg-gray-800 p-4 border-r border-gray-700 shadow-xl 
          min-h-screen z-20 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0 fixed" : "-translate-x-full fixed"}
          md:static md:translate-x-0 md:flex
        `}
      >
        <div className="flex flex-col w-full">
          <h1 className="text-2xl font-bold text-indigo-100 mb-6 border-b pb-3 border-gray-700">
            Components
          </h1>

          <ul className="space-y-2">
            {/* Home Link */}
            <li>
              <button
                onClick={() => handleNavigate("home")}
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
                  onClick={() => handleNavigate(route.path)}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                    currentPath === route.path
                      ? "bg-indigo-100 text-gray-900 shadow-lg"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {route.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Content Overlay (to dim content when sidebar is open on mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-10 flex flex-col justify-center min-w-0">
        <div className="mt-16 md:mt-0 w-full h-full">{renderComponent()}</div>
      </main>
    </div>
  );
}
