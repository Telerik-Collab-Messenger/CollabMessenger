import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../state/app.context";
import { useNavigate } from "react-router-dom";
import { getUserData, updateUserData, uploadPhoto } from "../../services/user.services";
import { Form, Button, Image } from "react-bootstrap";
import "./EditUser.css";


export default function EditUser() {
    const { user, userData, setAppState } = useContext(AppContext);
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        photoURL: '',
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && userData) {
            setUserDetails({
                firstName: userData.firstName,
                lastName: userData.lastName,
                photoURL: userData.photoURL || '',
            });
        }
    }, [user, userData]);

    const updateUser = prop => e => {
        setUserDetails({
            ...userDetails,
            [prop]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!userDetails.firstName || userDetails.firstName.length < 4 || userDetails.firstName.length > 32) {
            return alert("Invalid first name");
        }
        if (!userDetails.lastName || userDetails.lastName.length < 4 || userDetails.lastName.length > 32) {
            return alert("Invalid last name");
        }

        try {
            let updatedPhotoURL = userDetails.photoURL;
            if (selectedFile) {
                updatedPhotoURL = await uploadPhoto(user.uid, selectedFile);
            }

            await updateUserData(user.uid, {
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                photoURL: updatedPhotoURL,
            });

            const updatedUserData = await getUserData(user.uid);
            console.log(updatedUserData)
            setAppState({ user, userData: Object.values(updatedUserData)[0] });

            alert("User details updated successfully!");
            navigate('/userdetails');
        } catch (error) {
            alert(`Failed to update user: ${error.message}`);
        }
    };

    const handleCancel = () => {
        navigate('/userdetails');
    };

    return (
      <div className="edit-user-form-container">
        <h2>Edit User Details</h2>

        <Form onSubmit={handleSave}>
          <p id="msg">Username cannot be changed</p>

          <Form.Group controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name here..."
              value={userDetails.firstName}
              onChange={updateUser("firstName")}
            />
          </Form.Group>

          <Form.Group controlId="lastName" className="mt-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name here..."
              value={userDetails.lastName}
              onChange={updateUser("lastName")}
            />
          </Form.Group>

          <Form.Group controlId="photoURL" className="mt-3">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>

          {userDetails.photoURL && (
            <div className="mt-3">
              <Image
                src={userDetails.photoURL}
                roundedCircle
                style={{ width: "100px", height: "100px" }}
                alt="Profile"
              />
            </div>
          )}
          <div className="mt-4">
            <Button className="btn-edit" variant="success" type="submit">
              Save
            </Button>
            <Button className="btn-edit2" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    );
    
}
