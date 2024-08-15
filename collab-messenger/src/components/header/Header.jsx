import './Header.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../state/app.context';

export default function Header() {
    const { user, userData, setAppState } = useContext(AppContext);

    const logout = async () => {
        setAppState({ user: null, userData: null });
        navigate('/login');
      };
      
    const navigate = useNavigate();
        
        return (
            <div id='header'>
                <header>
                    <div id='header-title'>
                        <p>Collab Messenger</p>
                        {user && (<>
                            <span>Welcome,</span>
                            {/* <button className="button" onClick={detailUser}>{userData.handle}</button> */}
                            <button className="button" onClick={logout}>Logout</button>
                        </>)}
                    </div>
                </header>
            </div>
        );
}