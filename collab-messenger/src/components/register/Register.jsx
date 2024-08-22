import { useState } from 'react';
import { registerUser } from '../../services/authenticate-service';
import { uploadPhoto } from '../../services/user.services';
import { createUserHandle } from '../../services/user.services';
import { useNavigate } from 'react-router-dom';
import './Register.css';


const Register = () => {
    const [user, setUser] = useState({
        handle: '',
        email: '',
        phoneNumber: '',
        password: '',
        passwordCheck: '',
        photo: null,
        firstName: '',
        lastName: ''
    });

    const [isModalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();

    const updateUser = prop => e => {
        if (prop === 'photo') {
            setUser({
                ...user,
                [prop]: e.target.files[0],
            });
        } else {
            setUser({
                ...user,
                [prop]: e.target.value,
            });
        }
    };

    const validatePhoneNumber = (phoneNumber) => {
        if (typeof phoneNumber !== 'string') {
            alert("Phone number must be a string");
            return false;
        }
        if (phoneNumber.length === 13 && phoneNumber[0] !== '+') {
            alert("Invalid phone number: 13-digit numbers must start with '+'");
            return false;
        }
        if (phoneNumber.length === 10 && phoneNumber[0] !== '0') {
            alert("Invalid phone number: 10-digit numbers must start with '0'");
            return false;
        }
        return true;
    };

    const register = async (e) => {
        e.preventDefault();
        if (!user.email || !user.password) {
            return alert('No credentials provided!');
        }
        if (user.password !== user.passwordCheck) {
            return alert("Password doesn't match");
        }
        if (!user.handle || user.handle.length < 5 || user.handle.length > 35) {
            return alert("Invalid handle (between 5 and 35 symbols)");
        }
        if (!validatePhoneNumber(user.phoneNumber)) {
            return;
        }
        if (typeof user.firstName !== 'string') {
            alert("Invalid First Name");
            return false;
        }
        if (typeof user.lastName !== 'string') {
            alert("Invalid Last Name");
            return false;
        }

        try {
            const userCredential = await registerUser(user.email, user.password);
            const uid = userCredential.user.uid;
            const photoURL = await uploadPhoto(uid, user.photo);

            await createUserHandle(user.handle, uid, user.email, user.phoneNumber, photoURL, user.firstName, user.lastName);

            alert('User registered successfully!');
            setModalVisible(false);
            navigate('/logged');
        } catch (error) {
            console.error('Error registering user:', error);
            alert(error.message);
        }
    };

    return (
      <>
      <button
        id="register"
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => setModalVisible(true)}
      >
        Register
      </button>

      {isModalVisible && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setModalVisible(false)}
          />
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-white p-5 shadow-lg rounded-lg w-80">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Register</h2>
                <button
                  className="text-2xl bg-transparent border-none"
                  onClick={() => setModalVisible(false)}
                >
                  &times;
                </button>
              </div>
              <form onSubmit={register}>
                <div className="form-group mb-4">
                  <label htmlFor="handle" className="block mb-2">Username</label>
                  <input
                    type="text"
                    id="handle"
                    placeholder="Enter username"
                    value={user.handle}
                    onChange={updateUser('handle')}
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="firstName" className="block mb-2">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="Enter First Name"
                    value={user.firstName}
                    onChange={updateUser('firstName')}
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="lastName" className="block mb-2">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Enter Last Name"
                    value={user.lastName}
                    onChange={updateUser('lastName')}
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="email" className="block mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter email"
                    value={user.email}
                    onChange={updateUser('email')}
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="phoneNumber" className="block mb-2">Phone Number</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    placeholder="Enter phone number"
                    value={user.phoneNumber}
                    onChange={updateUser('phoneNumber')}
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="password" className="block mb-2">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    value={user.password}
                    onChange={updateUser('password')}
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="passwordCheck" className="block mb-2">Confirm Password</label>
                  <input
                    type="password"
                    id="passwordCheck"
                    placeholder="Confirm password"
                    value={user.passwordCheck}
                    onChange={updateUser('passwordCheck')}
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="photo" className="block mb-2">Upload Photo</label>
                  <input
                    type="file"
                    id="photo"
                    onChange={updateUser('photo')}
                    accept="image/*"
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
    );
};

export default Register;


{/* <>
<Button id="register" variant="success" onClick={() => setModalVisible(true)}>
    Register
</Button>

<Modal show={isModalVisible} onHide={() => setModalVisible(false)} centered>
    <Modal.Header closeButton>
        <Modal.Title>Register</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form onSubmit={register}>
            <Form.Group controlId="handle">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" value={user.handle} onChange={updateUser('handle')} />
            </Form.Group>

            <Form.Group controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="Enter First Name" value={user.firstName} onChange={updateUser('firstName')} />
            </Form.Group>

            <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Last Name" value={user.lastName} onChange={updateUser('lastName')} />
            </Form.Group>

            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={user.email} onChange={updateUser('email')} />
            </Form.Group>

            <Form.Group controlId="phoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="text" placeholder="Enter phone number" value={user.phoneNumber} onChange={updateUser('phoneNumber')} />
            </Form.Group>

            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" value={user.password} onChange={updateUser('password')} />
            </Form.Group>

            <Form.Group controlId="passwordCheck">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm password" value={user.passwordCheck} onChange={updateUser('passwordCheck')} />
            </Form.Group>

            <Form.Group controlId="photo">
                <Form.Label>Upload Photo</Form.Label>
                <Form.Control type="file" onChange={updateUser('photo')} accept="image/*" />
            </Form.Group>

            <Button variant="primary" type="submit">
                Register
            </Button>
        </Form>
    </Modal.Body>
</Modal>
</> */}