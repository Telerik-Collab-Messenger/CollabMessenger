import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterModal from '../../../components/modals/RegisterModal';
import { AppContext } from './../../../state/app.context';

const Register = () => {
  const [user, setUser] = useState({
    handle: '',
    email: '',
    phoneNumber: '',
    password: '',
    passwordCheck: ''
  });

  const [isModalVisible, setModalVisible] = useState(false);

  const updateUser = prop => e => {
    setUser({
      ...user,
      [prop]: e.target.value,
    });
  };

  // const { setAppState } = useContext(AppContext);
  // const navigate = useNavigate();

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
  };

  return (
    <div>
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
    </div>
  );
};

export default Register;