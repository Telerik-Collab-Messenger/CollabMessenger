import './Home.css'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../state/app.context';

export default function Home() {
    const { user } = useContext(AppContext);

    const navigate = useNavigate();

    return (
        <>
            <div id='home'>
                <div id='home-title'>
                    <h1>Welcome to Collab Messenger</h1>
                </div>
                <div id='home-content'>
                    <p>Collab Messenger is a simple messaging app that allows you to chat with your friends and family.</p>
                    <p>Get started by creating an account or logging in.</p>
                    {user ? (
                        <>  
                            <span>Welcome, {user}</span>
                            {/* do stuff */}
                        </>
                    ) : (
                        <>
                        <button className="button" onClick={() => navigate('/login')}>Login</button>
                        <button className="button" onClick={() => navigate('/register')}>Register</button>
                        </>   
                )}
                </div>
            </div>
        </>
    )
}
