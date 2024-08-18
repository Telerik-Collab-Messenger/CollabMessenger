import { useState, useEffect } from 'react'
import { AppContext } from './state/app.context';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { auth } from './config/firebase-config';
import { getUserData } from './services/user.services';
import { useAuthState } from 'react-firebase-hooks/auth';
import Header from './components/header/Header';
import Home from './pages/home/Home'
import  Logged from './pages/logged/Logged'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user] = useAuthState(auth);

if (appState.user !== user) {
  setAppState({...appState, user})
}

  useEffect(() => {
    if (user) {
      getUserData(user.uid).then(data => {
        const userData = data ? data[Object.keys(data)[0]] : null;
        setAppState(prevState => ({ ...prevState, userData }));
      });
    }
  }, [user]);


  return (
    <>
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <div id='main'>
          <Header />
            <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/logged' element={<Logged />} />
          </Routes>
        </div>
        </AppContext.Provider>
    </BrowserRouter>
    </>
  )
}

export default App
