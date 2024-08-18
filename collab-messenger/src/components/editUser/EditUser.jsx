import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../state/app.context";
import { useNavigate } from "react-router-dom";
import { getUserData, updateUserData } from "../../services/user.services";


export default function EditUser() {
  const { user, userData, setAppState } = useContext(AppContext);
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user && userData) {
      setUserDetails({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      });
    }
  }, [user, userData]);

  const updateUser = prop => e => {
    setUserDetails({
      ...userDetails,
      [prop]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!userDetails.firstName || userDetails.firstName.length < 4 || userDetails.firstName.length > 32) {
      return alert("Invalid first name");
    }
    if (!userDetails.lastName || userDetails.lastName.length < 4 || userDetails.lastName.length > 32) {
      return alert("Invalid last name");
    }
    if (!userDetails.email || !/\S+@\S+\.\S+/.test(userDetails.email)) {
      return alert("Invalid email");
    }

    try {
      await updateUserData(user.uid, {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
      });

      const updatedUserData = await getUserData(user.uid);
      setAppState({ user, userData: updatedUserData });

      alert("User details updated successfully!");
      navigate('/');
    } catch (error) {
      alert(`Failed to update user: ${error.message}`);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <form className="edit-user-form">
      <h2>Edit User Details</h2>
      <p id="msg">Username cannot be changed</p>
      <label htmlFor="firstName" className="firstName-label">First Name:
        <input type="text" name="firstName" id="firstName"
          placeholder="Enter first name here..."
          value={userDetails.firstName} onChange={updateUser('firstName')} />
      </label><br />
      <br />
      <label htmlFor="lastName" className="lastName-label">Last Name:
        <input type="text" name="lastName" id="lastName"
          placeholder="Enter last name here..."
          value={userDetails.lastName} onChange={updateUser('lastName')} />
      </label><br />
      <br />
      <label htmlFor="email" className="email-label">Email:
        <input type="text" name="email" id="email"
          placeholder="Enter email here..."
          value={userDetails.email} onChange={updateUser('email')} />
      </label><br />
      <br />
      <button onClick={handleSave}>Save</button>
      <button onClick={handleCancel}>Cancel</button>
    </form>
  );
}
