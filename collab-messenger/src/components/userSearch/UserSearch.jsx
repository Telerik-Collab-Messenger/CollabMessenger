import { useEffect } from "react";
import { useState } from "react";
//import { useSearchParams } from "react-router-dom";
import { getAllUsers } from "../../services/user.services";
import PropTypes from "prop-types";

export default function UserSearch({ onAddParticipant }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");  // Local state for search input

  useEffect(() => {
    if (search) {
      getAllUsers(search)
        .then((users) => setUsers(users))
        .catch((error) => alert(error.message));
    } else {
      // Clear users list when search is empty
      setUsers([]);
    }
  }, [search]);

  UserSearch.propTypes = {
    onAddParticipant: PropTypes.func.isRequired,
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md max-w-lg mx-auto">
      <h1 className="text-xl font-semibold mb-4 text-gray-800">Search for a user to chat:</h1>

      <input
        value={search} // Controlled input, no URL params involved
        onChange={(e) => setSearch(e.target.value)}
        type="text"
        name="search"
        id="search"
        placeholder="Search users..."
        className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {users.length > 0 ? (
        <ul className="space-y-4">
          {users.map((u) => (
            <li
              key={u.handle}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <div className="flex items-center">
                <img
                  src={u.photoURL || "/img/newDefaultUserIMG.jpeg"}
                  alt={u.handle} 
                  className="w-10 h-10 rounded-full object-cover mr-4"
                />
                <span className="text-gray-800 font-medium">{u.handle}</span>
              </div>

              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition"
                onClick={() => onAddParticipant(u)}
              >
                Add to Chat
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">No users found</p>
      )}
    </div>
  );
}


