import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../state/app.context";
import { useNavigate } from "react-router-dom";
import { getUserData, updateUserData, uploadPhoto } from "../../services/user.services";
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
      <div className="edit-container flex flex-col  w-full bg-blue-100 p-5">
        <h2 className="text-2xl font-semibold mb-2">Edit User Details</h2>
    
        <form className="" onSubmit={handleSave}>
          {userDetails.photoURL && (
            <div className="mt-4">
              <img
                src={userDetails.photoURL}
                className="w-24 h-24 rounded-full mx-auto"
                alt="Profile"
              />
            </div>
          )}
    
          <div className="form-group mb-4">
            <label htmlFor="photoURL" className="block text-gray-700">Profile Picture</label>
            <input
              type="file"
              id="photoURL"
              onChange={handleFileChange}
              className="form-control mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>
    
          <p id="msg" className="text-red-500 mb-4">Username cannot be changed</p>
    
          <div className="form-group mb-4">
            <label htmlFor="firstName" className="block text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter first name here..."
              value={userDetails.firstName}
              onChange={updateUser("firstName")}
              className="form-control mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>
    
          <div className="form-group mb-4">
            <label htmlFor="lastName" className="block text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter last name here..."
              value={userDetails.lastName}
              onChange={updateUser("lastName")}
              className="form-control mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>
    
          <div className="mt-6 flex justify-between">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              type="submit"
            >
              Save
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
    
}


// return (
//   <div className="edit-user-form-container">
//     <h2>Edit User Details</h2>

//     <Form onSubmit={handleSave}>
//       <p id="msg">Username cannot be changed</p>

//       <Form.Group controlId="firstName">
//         <Form.Label>First Name</Form.Label>
//         <Form.Control
//           type="text"
//           placeholder="Enter first name here..."
//           value={userDetails.firstName}
//           onChange={updateUser("firstName")}
//         />
//       </Form.Group>

//       <Form.Group controlId="lastName" className="mt-3">
//         <Form.Label>Last Name</Form.Label>
//         <Form.Control
//           type="text"
//           placeholder="Enter last name here..."
//           value={userDetails.lastName}
//           onChange={updateUser("lastName")}
//         />
//       </Form.Group>

//       <Form.Group controlId="photoURL" className="mt-3">
//         <Form.Label>Profile Picture</Form.Label>
//         <Form.Control type="file" onChange={handleFileChange} />
//       </Form.Group>

//       {userDetails.photoURL && (
//         <div className="mt-3">
//           <Image
//             src={userDetails.photoURL}
//             roundedCircle
//             style={{ width: "100px", height: "100px" }}
//             alt="Profile"
//           />
//         </div>
//       )}
//       <div className="mt-4">
//         <Button className="btn-edit" variant="success" type="submit">
//           Save
//         </Button>
//         <Button className="btn-edit2" variant="secondary" onClick={handleCancel}>
//           Cancel
//         </Button>
//       </div>
//     </Form>
//   </div>
// );