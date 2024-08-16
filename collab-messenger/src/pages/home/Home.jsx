import './Home.css';
import { useContext, useState } from 'react';
import { AppContext } from '../../state/app.context';
import Register from '../../components/register/Register';
import Login from '../../components/login/Login';

export default function Home() {
    const { user } = useContext(AppContext);
    const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
    const [isLoginModelVisible, setLoginModelVisible] = useState(false);

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
                            <Login isVisible={isLoginModelVisible} onClose={() => setLoginModelVisible(false)} />
                            <Register isVisible={isRegisterModalVisible} onClose={() => setRegisterModalVisible(false)} />
                        </>   
                    )}
                </div>
            </div>
            
        </>
    );
}