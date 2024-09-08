import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { logoutUser } from '../../services/authenticate-service';
import { AppContext } from '../../state/app.context';



export default function Header() {
    const { user, userData, setAppState } = useContext(AppContext);
    const navigate = useNavigate();
    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
        navigate('/');
    };
    const detailUser = () => {
        navigate('userdetails');
      }

    return (
<div className="navbar bg-emerald-500">
  <div className="flex-1 px-2 lg:flex-none">
    <a className="text-2xl font-bold">Communicator 3000</a>
  </div>
  <div className="flex flex-1 justify-end px-2">
  {user && userData && (
        <div className="flex items-stretch">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn rounded-btn flex items-center">
              {userData.photoURL ? (
                <img src={userData.photoURL} alt="Profile" id="pfp" className="w-8 h-8 rounded-full mr-2" />
              ) : (
                <img src="../../../img/defaultUser.jpg" alt="Default Profile" id="pfp" className="w-8 h-8 rounded-full mr-2" />
              )}
              <span>Welcome, {userData.handle}</span>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow">
              <li><a onClick={detailUser}>Details</a></li>
              <li><a onClick={logout}>Logout</a></li>
            </ul>
          </div>
        </div>
      )}
  </div>
</div>
    );
}