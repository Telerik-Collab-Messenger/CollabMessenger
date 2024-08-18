import { useState } from 'react';
import { loginUser } from '../../services/authenticate-service';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import './Login.css';
import { AppContext } from '../../state/app.context';
import { useContext } from 'react';

const Login = () => {
    const [user, setUser] = useState({
        email: '',
        password: '',
    });
    const { setAppState } = useContext(AppContext);
    const [isModalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();

    const updateUser = (prop) => (e) => {
        setUser({
            ...user,
            [prop]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!user.email || !user.password) {
            return alert('No credentials provided!');
        }
        try {
            const credentials = await loginUser(user.email, user.password);
            setAppState({
                user: credentials.user,
                userData: null,
            });
            alert('User logged in successfully!');
            setModalVisible(false);
            navigate('/logged');
        } catch (error) {
            console.error('Error logging in:', error);
            alert(error.message);
        }
    };

    return (
        <>
            <Button id="login" variant="success" onClick={() => setModalVisible(true)}>
                Login
            </Button>

            <Modal show={isModalVisible} onHide={() => setModalVisible(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={user.email}
                                onChange={updateUser('email')}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={user.password}
                                onChange={updateUser('password')}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Login;





// import { useState } from 'react';
// import { loginUser } from '../../services/authenticate-service';
// import { useNavigate } from 'react-router-dom';
// import { Modal, Button, Form } from 'react-bootstrap';
// import './Login.css';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isModalVisible, setModalVisible] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       await loginUser(email, password);
//       alert('User logged in successfully!');
//       setModalVisible(false);
//       navigate('/logged');
//     } catch (error) {
//       console.error('Error logging in:', error);
//       alert(error.message);
//     }
//   };

//   return (
//     <>
//       <Button id="login" variant="success" onClick={() => setModalVisible(true)}>
//         Login
//       </Button>

//       <Modal show={isModalVisible} onHide={() => setModalVisible(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Login</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleLogin}>
//             <Form.Group controlId="formEmail">
//               <Form.Label>Email address</Form.Label>
//               <Form.Control
//                 type="email"
//                 placeholder="Enter email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </Form.Group>

//             <Form.Group controlId="formPassword">
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </Form.Group>

//             <Button variant="primary" type="submit">
//               Login
//             </Button>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

// export default Login;