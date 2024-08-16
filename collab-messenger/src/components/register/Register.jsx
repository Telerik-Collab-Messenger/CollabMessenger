import { useState } from 'react';
import { registerUser } from '../../services/authenticate-service';
import RegisterModal from '../modals/RegisterModal';
import { createUserHandle } from '../../services/user.services';
import { useNavigate } from 'react-router-dom';


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
    // have to fix check for phoneNumber bigint // string check
    // if (!user.phoneNumber ) {
    //     return alert('!');
    // }

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
      <button onClick={() => setModalVisible(true)}>Register</button>
      <RegisterModal isVisible={isModalVisible} onClose={() => setModalVisible(false)}>
        <form onSubmit={register}>
          <input type="text" value={user.handle} onChange={updateUser('handle')} placeholder="Handle" />
          <input type="email" value={user.email} onChange={updateUser('email')} placeholder="Email" />
          <input type="text" value={user.phoneNumber} onChange={updateUser('phoneNumber')} placeholder="Phone Number" />
          <input type="password" value={user.password} onChange={updateUser('password')} placeholder="Password" />
          <input type="password" value={user.passwordCheck} onChange={updateUser('passwordCheck')} placeholder="Confirm Password" />
          <button type="submit">Register</button>
        </form>
      </RegisterModal>
    </>
  );
};

export default Register;