import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { registerUser } from '../../services/authenticate-service';
import { createUserHandle } from '../../services/user.services';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [user, setUser] = useState({
        handle: '',
        email: '',
        phoneNumber: '',
        password: '',
        passwordCheck: ''
    });

    const [isModalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();

    const updateUser = prop => e => {
        setUser({
            ...user,
            [prop]: e.target.value,
        });
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
        if (!user.handle || user.handle.length < 5 || user.handle.length > 35){
            return alert("Invalid handle (between 5 and 35 symbols)");
        }
        // if(!user.phoneNumber || typeof user.phoneNumber !== 'string'){ 
        //       return alert("Invalid phone number");
        // }
        if (!validatePhoneNumber(user.phoneNumber)) {
          return; 
        }
     
        try {

            const userCredential = await registerUser(user.email, user.password);
            const uid = userCredential.user.uid;

            await createUserHandle(user.handle, uid, user.email, user.phoneNumber);
            
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
                            <Form.Label>Handle</Form.Label>
                            <Form.Control type="text" placeholder="Enter handle" value={user.handle} onChange={updateUser('handle')} />
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

                        <Button variant="primary" type="submit">
                            Register
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Register;