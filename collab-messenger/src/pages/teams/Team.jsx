import { useMemo } from "react"
import PropTypes from 'prop-types';
import { createChatForTeam } from "../../services/chat.services";

export const Team = ({ team, newMember, setNewMember, handleAddMember, handleRemoveMember }) => {
    const members = useMemo(() => {
        return Object.values(team?.members || {})
    }, [team?.members])

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

    return <li key={team.id}>
        <h2>Your Teams</h2>
        <h3>{team.teamName}</h3> 
        <p>Members: <button onClick={handleCreateChat}>Create Group Chat</button></p>
        <ul>
            {members.length ? (
                members.map(member => (
                    <li key={member.id}>
                        {member.id === team.author ? (
                            <>
                               Owner ID: {member.id} email: {member.email} <span></span>
                                
                            </>
                        ) : (
                            <>
                                Member ID: {member.id} email: {member.email}
                                <button onClick={() => handleRemoveMember(team.id, member.email)}>Remove</button>
                            </>
                        )}
                    </li>
                ))
            ) : (
                <li>No members found.</li>
            )}
        </ul>
        <input
            type="text"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Add member (email or handle)"
        />
        <button onClick={() => handleAddMember(team.id)}>Add Member</button>
    </li>
}

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
