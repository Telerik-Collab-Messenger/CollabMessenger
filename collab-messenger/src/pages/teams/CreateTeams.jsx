import { useState, useContext } from 'react';
import { createTeam } from '../../services/team.services';
import { AppContext } from '../../state/app.context';

const CreateTeam = () => {
    const { user } = useContext(AppContext);
    const [teamName, setTeamName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleInputChange = (e) => {
        setTeamName(e.target.value);
    };

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
            const teamId = await createTeam(teamName, user.uid);
            setLoading(false);
            setSuccess('Team created successfully');
            setTeamName(''); 
        } catch {
            setLoading(false);
            setError('Failed to create team. Please try again.');
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
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Team'}
                </button>
            </form>
        </div>
    );
};

export default CreateTeam;