import React, { useState, useMemo } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

function generateId(): string {
  return crypto.randomUUID();
}

function formatName(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const SEED_USERS: User[] = [
  { id: generateId(), firstName: "Dave", lastName: "Davis" },
  { id: generateId(), firstName: "John", lastName: "Smith" },
  { id: generateId(), firstName: "George", lastName: "Harris" },
];

export default function UserDirectory() {
  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  const handleCreate = () => {
    if (!firstName.trim() || !lastName.trim()) return;

    const exists = users.some(
      (u) =>
        u.firstName.toLowerCase() === firstName.toLowerCase().trim() &&
        u.lastName.toLowerCase() === lastName.toLowerCase().trim()
    );

    if (exists) {
      console.error("A user with this name already exists.");
      return;
    }

    setUsers([
      ...users,
      {
        id: generateId(),
        firstName: formatName(firstName),
        lastName: formatName(lastName),
      },
    ]);
    reset();
  };

  const filteredUsers: User[] = useMemo(() => {
    if (searchText.trim() === "") return users;

    const lowerSearchText = searchText.toLowerCase().trim();

    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(lowerSearchText) ||
        user.lastName.toLowerCase().includes(lowerSearchText)
    );
  }, [users, searchText]);

  const reset = () => {
    setFirstName("");
    setLastName("");
    setSelectedUser(null);
  };

  const handleUpdate = () => {
    if (!selectedUser) return;

    const newUser: User = {
      ...selectedUser,
      firstName: formatName(firstName),
      lastName: formatName(lastName),
    };

    setUsers(users.map((user) => (user.id === newUser.id ? newUser : user)));
    reset();
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    setUsers(users.filter((user) => user.id !== selectedUser.id));
    reset();
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setFirstName(user.firstName);
    setLastName(user.lastName);
  };

  const handleInputTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
  };

  const getListItemClasses = (user: User): string => {
    let classes =
      "p-3 border-b border-gray-200 cursor-pointer transition-all duration-150 ease-in-out font-medium hover:bg-indigo-100";

    if (selectedUser?.id === user.id) {
      classes += " bg-indigo-600 text-white shadow-md hover:bg-indigo-700";
    } else {
      classes += " text-gray-800 bg-white";
    }
    return classes;
  };

  const isCreateDisabled: boolean =
    !firstName.trim() || !lastName.trim() || selectedUser !== null;
  const isActionDisabled: boolean = selectedUser === null;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center border-b pb-3 border-gray-200">
          User Directory Manager
        </h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by first or last name..."
            id="search"
            aria-label="search"
            value={searchText}
            onChange={(e) => handleInputTextChange(e, setSearchText)}
            className="w-full p-3 border border-gray-300 rounded-xl shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-black"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            id="name-list-container"
            className="md:col-span-1 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-lg h-96 overflow-y-auto"
          >
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={getListItemClasses(user)}
                >
                  {user.firstName} {user.lastName}
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-gray-500 italic">
                No users found.
              </p>
            )}
          </div>
          <div className="md:col-span-2 space-y-6">
            <div
              id="name-text-field-container"
              className="space-y-4 p-4 border border-gray-200 rounded-xl shadow-inner bg-white"
            >
              <h2 className="text-xl font-semibold text-gray-700">
                User Details
              </h2>
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="first-name"
                  aria-label="first-name"
                  value={firstName}
                  onChange={(e) => handleInputTextChange(e, setFirstName)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 text-black"
                />
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last-name"
                  aria-label="last-name"
                  value={lastName}
                  onChange={(e) => handleInputTextChange(e, setLastName)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 text-black"
                />
              </div>
            </div>
            <div
              id="button-group"
              className="flex flex-wrap gap-4 justify-end pt-4 border-t border-gray-200"
            >
              <button
                disabled={isCreateDisabled}
                onClick={handleCreate}
                className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 shadow-md ${
                  isCreateDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 active:bg-green-800"
                }`}
              >
                Create
              </button>
              <button
                disabled={isActionDisabled}
                onClick={handleUpdate}
                className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 shadow-md ${
                  isActionDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800"
                }`}
              >
                Update
              </button>
              <button
                disabled={isActionDisabled}
                onClick={handleDelete}
                className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 shadow-md ${
                  isActionDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
                }`}
              >
                Delete
              </button>
              <button
                disabled={
                  isActionDisabled && !firstName.trim() && !lastName.trim()
                }
                onClick={reset}
                className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 shadow-md ${
                  isActionDisabled && !firstName.trim() && !lastName.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
