import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getAllUsers } from "../../services/user.services";
import { addTeamMember, removeTeamMember, getTeamByID } from "../../services/team.services";

export default function UserSearchForTeams({ teamId }) {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");  // Local state for search input
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        if (search) {
            getAllUsers(search)
                .then((users) => setUsers(users))
                .catch((error) => alert(error.message));
        } else {
            setUsers([]);
        }
    }, [search]);

    useEffect(() => {
        if (teamId) {
            getTeamByID(teamId)
                .then((team) => {
                    // Ensure team.members is set properly
                    setTeamMembers(team.members || []);
                })
                .catch((error) => {
                    console.error("Failed to fetch team members:", error);
                    alert("Failed to fetch team members. Please try again.");
                });
        }
    }, [teamId]);

    const handleAddOrRemove = async (user) => {
        try {
            const isMember = teamMembers.some(member => member.email === user.email);
            if (isMember) {
                // Remove from team
                await removeTeamMember(teamId, user.email);
                setTeamMembers(prevMembers => prevMembers.filter(member => member.email !== user.email));
            } else {
                // Add to team
                await addTeamMember(teamId, user.handle);
                setTeamMembers(prevMembers => [...prevMembers, user]);
            }
            setUsers(prevUsers => prevUsers.filter(u => u.email !== user.email)); // Optionally remove user from search results
        } catch (error) {
            console.error("Failed to update team member:", error);
            alert("Failed to update team member. Please try again.");
        }
    };

    UserSearchForTeams.propTypes = {
        teamId: PropTypes.string.isRequired, // Ensure teamId is passed as a prop
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md max-w-lg mx-auto">
            <h1 className="text-xl font-semibold mb-4 text-gray-800">Search for a user to add/remove from the Team:</h1>
            
            <input
                value={search}
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
                                {u.photoURL ? (
                                    <img
                                        src={u.photoURL}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover mr-4"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                                        <span className="text-gray-500">No Image</span>
                                    </div>
                                )}
                                <span className="text-gray-800 font-medium">{u.handle}</span>
                            </div>

                            <button
                                className={`py-2 px-4 rounded-lg transition ${teamMembers.some(member => member.email === u.email) ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold`}
                                onClick={() => handleAddOrRemove(u)}
                            >
                                {teamMembers.some(member => member.email === u.email) ? 'Remove from Team' : 'Add to Team'}
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

