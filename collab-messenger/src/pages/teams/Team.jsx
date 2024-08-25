import { useMemo } from "react"
import PropTypes from 'prop-types';

export const Team = ({ team, newMember, setNewMember, handleAddMember, handleRemoveMember }) => {
    const members = useMemo(() => {
        return Object.values(team?.members || {})
    }, [team?.members])


    return <li key={team.id}>
        <h2>Your Teams</h2>
        <h3>{team.teamName}</h3>
        <p>Members:</p>
        <ul>
            {members.length ? (
                members.map(member => (
                    <li key={member.id}>
                        {member.id === team.author ? (
                            <>
                                {member.email} <span>(Owner)</span>
                            </>
                        ) : (
                            <>
                                {member.email}
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
