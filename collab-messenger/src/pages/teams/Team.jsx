import { useMemo } from "react";
import PropTypes from 'prop-types';
import { createChatForTeam } from "../../services/chat.services";

export const Team = ({ team, newMember, setNewMember, handleAddMember, handleRemoveMember }) => {
    const members = useMemo(() => {
        return Object.values(team?.members || {});
    }, [team?.members]);

    const handleCreateChat = async () => {
        try {
            const author = members.find(member => member.id === team.author);
            const participants = members.filter(member => member.id !== team.author);
            await createChatForTeam(author, participants);
            alert('Group chat created successfully!');
        } catch (error) {
            console.error("Failed to create group chat:", error);
            alert('Failed to create group chat. Please try again.');
        }
    };

    return (
        <li key={team.id} className="p-4 mb-4 border border-gray-300 rounded-lg shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-2">Team: {team.teamName}</h2>
            <p className="text-gray-700 mb-4">
                Members: 
                <button 
                    onClick={handleCreateChat} 
                    className="ml-2 text-blue-500 hover:text-blue-600 underline"
                >
                    Create Group Chat
                </button>
            </p>
            <ul className="mb-4">
                {members.length ? (
                    members.map(member => (
                        <li key={member.id} className="flex items-center justify-between py-2 border-b border-gray-200">
                            <span className="text-gray-700">
                                {member.id === team.author 
                                    ? `Owner ID: ${member.id} email: ${member.email}` 
                                    : `Member ID: ${member.id} email: ${member.email}`
                                }
                            </span>
                            {member.id !== team.author && (
                                <button 
                                    onClick={() => handleRemoveMember(team.id, member.email)} 
                                    className="text-red-500 hover:text-red-600 underline"
                                >
                                    Remove
                                </button>
                            )}
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">No members found.</li>
                )}
            </ul>
            <div className="flex items-center">
                <input
                    type="text"
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    placeholder="Add member (email or handle)"
                    className="flex-grow p-2 border border-gray-300 rounded-lg mr-2"
                />
                <button 
                    onClick={() => handleAddMember(team.id)}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                >
                    Add Member
                </button>
            </div>
        </li>
    );
};

Team.propTypes = {
    team: PropTypes.shape({
        id: PropTypes.string.isRequired,
        teamName: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        members: PropTypes.objectOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                email: PropTypes.string.isRequired,
                joinedOn: PropTypes.string,
            })
        ),
    }).isRequired,
    newMember: PropTypes.string.isRequired,
    setNewMember: PropTypes.func.isRequired,
    handleAddMember: PropTypes.func.isRequired,
    handleRemoveMember: PropTypes.func.isRequired,
};

