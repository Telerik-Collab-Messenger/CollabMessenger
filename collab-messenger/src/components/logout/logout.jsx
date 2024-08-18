import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../state/auth.context';

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      alert('User logged out successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert(error.message);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;