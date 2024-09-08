import { useState } from 'react';
import { loginUser } from '../../services/authenticate-service';
import { useNavigate } from 'react-router-dom';
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
            console.log("@@@@ credentials", credentials)
            setAppState({
                user: credentials.user,
                userData: null,
            });
            alert('User logged in successfully!');
            setModalVisible(false);
            navigate('/chatsmainview');
        } catch (error) {
            console.error('Error logging in:', error);
            alert(error.message);
        }
    };

    return (
      <>
      <button
        id="login"
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => setModalVisible(true)}
      >
        Login
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
                <h2 className="text-xl font-bold">Login</h2>
                <button
                  className="text-2xl bg-transparent border-none"
                  onClick={() => setModalVisible(false)}
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleLogin}>
                <div className="form-group mb-4">
                  <label htmlFor="formEmail" className="block mb-2">Email address</label>
                  <input
                    type="email"
                    id="formEmail"
                    placeholder="Enter email"
                    value={user.email}
                    onChange={updateUser('email')}
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="formPassword" className="block mb-2">Password</label>
                  <input
                    type="password"
                    id="formPassword"
                    placeholder="Password"
                    value={user.password}
                    onChange={updateUser('password')}
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
    );
};

export default Login;
