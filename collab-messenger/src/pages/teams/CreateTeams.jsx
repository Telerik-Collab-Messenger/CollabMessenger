import { useState, useEffect, useContext, useCallback } from 'react';
import { fetchTeamsOwnedByUser, createTeam, removeTeamMember, addTeamMember, fetchTeamsWhereUserIsMember } from '../../services/team.services';
import { AppContext } from '../../state/app.context';
import { TeamOwner } from './TeamOwner';
import { TeamMember } from './TeamMember';

const CreateTeam = () => {
    const { user, userData } = useContext(AppContext) || {};
    const [teamName, setTeamName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [ownedTeams, setOwnedTeams] = useState([]);
    const [newMember, setNewMember] = useState('');
    const [memberTeams, setMemberTeams] = useState([]);


    useEffect(() => {
        const fetchTeams = async () => {
            if (user && userData && userData.handle) {
                try {
                    const ownedTeams = await fetchTeamsOwnedByUser(userData.handle);
                    setOwnedTeams(ownedTeams);
                    const memberTeams = await fetchTeamsWhereUserIsMember(userData.handle);
                    setMemberTeams(memberTeams);
                } catch (error) {
                    console.error("Failed to fetch teams:", error);
                    setError('Failed to fetch teams. Please try again.');
                }
            } else {
                console.log("User data or handle is not available.");
            }
        };

        fetchTeams();
    }, [user, userData]);

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
        <div className="p-6 bg-black text-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Create New Team</h2>
            {error && <div className="bg-red-700 text-red-100 p-2 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-700 text-green-100 p-2 rounded mb-4">{success}</div>}
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="mb-4">
                    <label htmlFor="teamName" className="block text-gray-300 text-sm font-medium mb-2">Team Name:</label>
                    <input
                        type="text"
                        id="teamName"
                        name="teamName"
                        value={teamName}
                        onChange={handleSetTeamName}
                        required
                        className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800"
                        placeholder="Enter your Team's Name here ..."
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 text-white font-semibold rounded-lg ${loading ? 'bg-gray-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                    {loading ? 'Creating...' : 'Create Team'}
                </button>
            </form>
            <h3 className="text-xl font-semibold mb-4">Teams You Own</h3>
            <ul>
                {ownedTeams.length > 0 ? (
                    ownedTeams.map(team => (
                        <TeamOwner
                            key={team.id}
                            team={team}
                            newMember={newMember}
                            setNewMember={setNewMember}
                            handleAddMember={handleAddMember}
                            handleRemoveMember={handleRemoveMember}
                        />
                    ))
                ) : (
                    <li className="text-gray-400">No teams found.</li>
                )}
            </ul>
            <h3 className="text-xl font-semibold mb-4">Teams you are a Member Of</h3>
            <ul>
                {memberTeams.length > 0 ? (
                    memberTeams.map(team => (
                        <TeamMember
                            key={team.id}
                            team={team}
                            currentUser={userData}
                            handleLeaveTeam={handleRemoveMember}
                        />
                    ))
                ) : (
                    <li className="text-gray-400">No teams found.</li>
                )}
            </ul>
        </div>
    );
};

export default CreateTeam;
