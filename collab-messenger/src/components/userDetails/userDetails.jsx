import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../state/app.context';
import { getUserData } from '../../services/user.services';
import { useNavigate } from 'react-router-dom';


export default function UserDetails() {
  const { user, isLoading } = useContext(AppContext);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoading) {
        if (!user) {
          navigate('/login');
        } else {
          const data = await getUserData(user.uid);
          if (data) {
            const userKey = Object.keys(data)[0];
            setUserData(data[userKey]);
          }
        }
      }
    };
  
    if (!isLoading) {
      fetchUserData();
    }
  }, [user, isLoading]);

  if (isLoading || !userData) {
    return <p>Loading user details...</p>;
  }

  const editUser = () => {
    navigate('edituser');
  }

  return (
    <div className="user-details-container">
      <h2>Account Details</h2>
      <div className="user-details">
        <p><strong>Username:</strong> {userData.handle}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Phone Number:</strong> {userData.phoneNumber || 'Not Provided'}</p>
        <p><strong>Account Created On:</strong> {userData.createdOn}</p>
        <button className="edit-button" onClick={editUser}>Edit details</button>
      </div>
    </div>
  );
}