import { logoutUser } from "../../services/authenticate-service";

const Logout = () => {
  const logout = async () => {
    try {
      await logoutUser();
      alert('User logged out successfully!');
    } catch (error) {
      console.error('Error logging out:', error);
      alert(error.message);
    }
  };

  return <button onClick={logout}>Logout</button>;
};

export default Logout;