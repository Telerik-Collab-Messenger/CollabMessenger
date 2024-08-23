import { useState, useEffect, useContext } from 'react';
import { fetchTeamsOwnedByUser, createTeam, removeTeamMember, addTeamMember } from '../../services/team.services';
import { AppContext } from '../../state/app.context';

const CreateTeam = () => {
    const { user } = useContext(AppContext);
    const [teamName, setTeamName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [ownedTeams, setOwnedTeams] = useState([]);
    const [newMember, setNewMember] = useState('');

    useEffect(() => {
        const fetchTeams = async () => {
            if (user) {
                try {
                    const teams = await fetchTeamsOwnedByUser(user.uid);
                    setOwnedTeams(teams);
                } catch (error) {
                    console.error("Failed to fetch teams:", error);
                }
            }
        };

        fetchTeams();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
    
        if (!teamName.trim()) {
            setError('Team name is required');
            return;
        }
    
        setLoading(true);
    
        try {
            await createTeam(teamName, {
                uid: user.uid,          
                email: user.email,       
            });
            const teams = await fetchTeamsOwnedByUser(user.uid);
            setOwnedTeams(teams);
            setLoading(false);
            setSuccess('Team created successfully');
            setTeamName('');
        } catch (error) {
            setLoading(false);
            setError('Failed to create team. Please try again.', error);
        }
    };

    const handleAddMember = async (teamId) => {
        try {
            await addTeamMember(teamId, newMember);
            const teams = await fetchTeamsOwnedByUser(user.uid);
            setOwnedTeams(teams);
            setNewMember('');
        } catch (error) {
            console.error('Failed to add member:', error);
            setError('Failed to add member. Please try again.');
        }
    };

    const handleRemoveMember = async (teamId, memberHandle) => {
        try {
            await removeTeamMember(teamId, memberHandle);
            const teams = await fetchTeamsOwnedByUser(user.uid);
            setOwnedTeams(teams);
        } catch (error) {
            console.error('Failed to remove member:', error);
            setError('Failed to remove member. Please try again.');
        }
    };

    return (
        <div className="create-team-container">
            <h2>Create New Team</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="teamName">Team Name:</label>
                    <input
                        type="text"
                        id="teamName"
                        name="teamName"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Team'}
                </button>
            </form>
            <ul>
                {ownedTeams.map(team => (
                    <li key={team.id}>
                        <h2>Your Teams</h2>
                        <h3>{team.teamName}</h3>
                        <p>Members:</p>
                        <ul>
                            {Array.isArray(team.members) && team.members.length > 0 ? (
                                team.members.map(member => (
                                    <li key={member.id}>
                                        {member.id === team.author ? (
                                            <>
                                                {member.email} <span>(Owner)</span>
                                            </>
                                        ) : (
                                            <>
                                                {member.handle}
                                                <button onClick={() => handleRemoveMember(team.id, member.handle)}>Remove</button>
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
                ))}
            </ul>
        </div>
    );
};

export default CreateTeam;
