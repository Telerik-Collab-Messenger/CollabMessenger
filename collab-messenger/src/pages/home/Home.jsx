import './Home.css';
import { useContext, useState } from 'react';
import { AppContext } from '../../state/app.context';
import Login from '../../components/login/Login';
import Register from '../../components/register/Register';

export default function Home() {
    const { user } = useContext(AppContext);
    const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
    const [isLoginModelVisible, setLoginModelVisible] = useState(false);

    
    return (
      <>
        <div
          id="home"
          className="min-h-screen bg-emerald-50 flex flex-col static w-full items-center justify-center"
        >
          <div id="home-title" className="mb-8">
            <h1 className="text-4xl font-bold text-emerald-700">
              Welcome to Collab Messenger
            </h1>
          </div>
          <div id="home-content" className="text-center">
            <p className="text-lg text-emerald-600 mb-4">
              Collab Messenger is a simple messaging app that allows you to chat
              with your friends and family.
            </p>
            <p className="text-lg text-emerald-600 mb-8">Get started</p>
            <div id="home-buttons" className="flex space-x-4 justify-center">
              <Login
                id="login"
                isVisible={isLoginModelVisible}
                onClose={() => setLoginModelVisible(false)}
              />
              <Register
                id="register"
                isVisible={isRegisterModalVisible}
                onClose={() => setRegisterModalVisible(false)}
              />
            </div>
          </div>
        </div>
      </>
    );
}