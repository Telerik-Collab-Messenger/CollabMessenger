import { useState, useEffect, useContext, useCallback } from 'react';
import { fetchTeamsOwnedByUser, createTeam, removeTeamMember, addTeamMember } from '../../services/team.services';
import { AppContext } from '../../state/app.context';
import { Team } from './Team';

const CreateTeam = () => {
    const { user, userData, setAppState } = useContext(AppContext);
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
                    const teams = await fetchTeamsOwnedByUser(userData.handle);
                    setOwnedTeams(teams);
                } catch (error) {
                    console.error("Failed to fetch teams:", error);
                }
            }
        };

        fetchTeams();
    }, [userData]);

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
                uid: userData.handle,          
                email: user.email,       
            });
            const teams = await fetchTeamsOwnedByUser(userData.handle);
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
            const teams = await fetchTeamsOwnedByUser(userData.handle);
            setOwnedTeams(teams);
            setNewMember('');
        } catch (error) {
            console.error('Failed to add member:', error);
            setError('Failed to add member. Please try again.');
        }
    };

    const handleRemoveMember = async (teamId, memberEmail) => {
        try {
            await removeTeamMember(teamId, memberEmail);
            const teams = await fetchTeamsOwnedByUser(userData.handle);
            setOwnedTeams(teams);
        } catch (error) {
            console.error('Failed to remove member:', error);
            setError('Failed to remove member. Please try again.');
        }
    };

    const handleSetTeamName = useCallback((event) => {
        setTeamName(event.target.value)
    }, [setTeamName])

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
                        onChange={handleSetTeamName}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Team'}
                </button>
            </form>
            <ul>
                {ownedTeams.map(team => (
                    <Team 
                        key={team.id}
                        team={team}
                        newMember={newMember}
                        setNewMember={setNewMember}
                        handleAddMember={handleAddMember}
                        handleRemoveMember={handleRemoveMember}
                    />
                ))}
            </ul>
        </div>
    );
};

export default CreateTeam;


  // const handleAddMemberr = useCallback(async (teamId) => {
    //     try {
    //         await addTeamMember(teamId, newMember);
    //         const teams = await fetchTeamsOwnedByUser(user.uid);
    //         setOwnedTeams(teams);
    //         setNewMember('');
    //     } catch (error) {
    //         console.error('Failed to add member:', error);
    //         setError('Failed to add member. Please try again.');
    //     }
    // }, [user, newMember])