import { useMemo } from "react";
import PropTypes from 'prop-types';

export const TeamMember = ({ team, currentUser, handleLeaveTeam }) => {
    console.log("Team Data:", team);
    console.log("Current User Data:", currentUser);
    const members = useMemo(() => {
        return Object.values(team?.members || {});
    }, [team?.members]);

    const handleLeave = async () => {
        try {
            await handleLeaveTeam(team.id, currentUser.email);
            window.location.reload();
        } catch (error) {
            console.error('Failed to leave the team:', error);
            alert('Failed to leave the team. Please try again.');
        }
    };

    return (
        <li key={team.id} className="p-4 mb-4 border border-gray-300 rounded-lg shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-2">Team: {team.teamName}</h2>
            <p className="text-gray-700 mb-4">
                Members:
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
                            {member.email === currentUser.email && (
                                <button 
                                    onClick={handleLeave} 
                                    className="text-red-500 hover:text-red-600 underline"
                                >
                                    Leave Team
                                </button>
                            )}
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">No members found.</li>
                )}
            </ul>
        </li>
    );
};

TeamMember.propTypes = {
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
    currentUser: PropTypes.shape({
        uid: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
    }).isRequired,
    handleLeaveTeam: PropTypes.func.isRequired,
};