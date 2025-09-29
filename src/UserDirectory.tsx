import React, {
  useState,
  useMemo,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

function generateId(): string {
  return window.crypto.randomUUID();
}

function formatName(str: string): string {
  if (!str) return "";
  const trimmed = str.trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
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
    const formattedFirstName = formatName(firstName);
    const formattedLastName = formatName(lastName);
    const exists = users.some(
      (u) =>
        u.firstName === formattedFirstName && u.lastName === formattedLastName
    );

    if (exists) {
      console.error("A user with this name already exists.");
      return;
    }

    setUsers([
      ...users,
      {
        id: generateId(),
        firstName: formattedFirstName,
        lastName: formattedLastName,
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
    e: ChangeEvent<HTMLInputElement>,
    setter: Dispatch<SetStateAction<string>>
  ) => {
    setter(e.target.value);
  };

  const getListItemClasses = (user: User): string => {
    let classes =
      "p-3 border-b border-gray-700 cursor-pointer transition-all duration-150 ease-in-out font-medium";

    if (selectedUser?.id === user.id) {
      // Selected state: bright indigo
      classes += " bg-indigo-600 text-white shadow-lg hover:bg-indigo-700";
    } else {
      // Unselected state: dark gray background, light text, slight hover effect
      classes += " text-gray-200 bg-gray-800 hover:bg-gray-700";
    }
    return classes;
  };

  const isCreateDisabled: boolean =
    !firstName.trim() || !lastName.trim() || selectedUser !== null;
  const isActionDisabled: boolean = selectedUser === null;

  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-700 text-gray-200">
        {/* H1 Heading: Changed to text-indigo-100 */}
        <h1 className="text-3xl font-extrabold text-indigo-100 mb-6 text-center border-b pb-3 border-gray-700">
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
            className="w-full p-3 border border-gray-600 rounded-xl shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-200 bg-gray-900 placeholder-gray-400"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User List Panel */}
          <div
            id="name-list-container"
            className="md:col-span-1 bg-gray-900 border border-gray-600 rounded-xl overflow-hidden shadow-xl h-96 overflow-y-auto"
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
              <p className="p-4 text-center text-gray-400 italic">
                No users found.
              </p>
            )}
          </div>

          {/* Controls Panel */}
          <div className="md:col-span-2 space-y-6">
            <div
              id="name-text-field-container"
              className="space-y-4 p-6 border border-gray-700 rounded-xl shadow-lg bg-gray-700"
            >
              {/* H2 Heading: Changed to text-indigo-100 */}
              <h2 className="text-xl font-semibold text-indigo-100">
                User Details
              </h2>
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="first-name"
                  aria-label="first-name"
                  value={firstName}
                  onChange={(e) => handleInputTextChange(e, setFirstName)}
                  className="w-full p-3 border border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 text-gray-200 bg-gray-900"
                />
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last-name"
                  aria-label="last-name"
                  value={lastName}
                  onChange={(e) => handleInputTextChange(e, setLastName)}
                  className="w-full p-3 border border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 text-gray-200 bg-gray-900"
                />
              </div>
            </div>

            {/* Action Buttons (Removed hover transforms) */}
            <div
              id="button-group"
              className="flex flex-wrap gap-4 justify-end pt-4"
            >
              <button
                disabled={isCreateDisabled}
                onClick={handleCreate}
                className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 shadow-md ${
                  isCreateDisabled
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
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
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
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
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
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
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700"
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
