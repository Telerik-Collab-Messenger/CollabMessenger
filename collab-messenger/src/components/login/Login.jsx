
import { useState } from 'react';
import { loginUser } from '../../services/authenticate-service';
import RegisterModal from '../modals/RegisterModal';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModelVisible, setModelVisible] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    try {
      await loginUser(email, password);
      alert('User logged in successfully!');
      setModelVisible(false);
      navigate('/logged');
    } catch (error) {
      console.error('Error logging in:', error);
      alert(error.message);
    }
  };

  return (
    <>
    <button onClick={() => setModelVisible(true)}>Login</button>
    <RegisterModal isVisible={isModelVisible} onClose={() => setModelVisible(false)}>
    <form onSubmit={login}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <br/>
      <button type="submit">Login</button>
    </form>
    </RegisterModal>
    </>
  );
};

export default Login;