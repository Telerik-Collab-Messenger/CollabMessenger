import { useState, useEffect } from 'react'
import { AppContext } from './state/app.context';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { auth } from './config/firebase-config';
import { getUserData } from './services/user.services';
import { useAuthState } from 'react-firebase-hooks/auth';
import Header from './components/header/Header';
import Home from './pages/home/Home'
import Logged from './pages/logged/Logged'
import './App.css'
import UserDetails from './components/userDetails/userDetails';
import Authenticated from './hoc/Authenticated';
import EditUser from './components/editUser/EditUser';
import SideNav from './components/leftNavBar/SideNav';
import AllChats from './pages/chats/AllChats';
import SingleChat from './pages/chats/SingleChat';
import Teams from './pages/teams/CreateTeams';



function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (appState.user !== user) {
      setAppState({...appState, user });
    }
  }, [appState.user, user])


  useEffect(() => {
    if (!appState.user) return;

    getUserData(appState.user.uid)
      .then(data => {
        const userData = data[Object.keys(data)[0]];
        setAppState({...appState, userData});
      });
  }, [user]);
  // useEffect(() => {
  //   if (user) {
  //     getUserData(user.uid).then(data => {
  //       const userData = data ? data[Object.keys(data)[0]] : null;
  //       setAppState(prevState => ({ ...prevState, userData }));
  //     });
  //   }
  // }, [user]);

  return (
    <>
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <div id='main'>
          <Header />
          <div className='flex flex-row w-full h-screen'>
          {user && <SideNav />}
            <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/logged' element={<Logged />} />
            <Route path='/userdetails/edituser' element={<EditUser />} />
            <Route path='/userdetails' element={<Authenticated><UserDetails /></Authenticated>} />
            <Route path="/allchats" element={<AllChats />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/chat/:id" element={<SingleChat />} />
          </Routes>
          </div>
        </div>
        </AppContext.Provider>
    </BrowserRouter>
    </>
  )
}

export default App
