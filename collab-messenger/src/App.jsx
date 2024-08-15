import { useState } from 'react'
import { AppContext } from './state/app.context';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './pages/home/Home'
import './App.css'
import Login from './pages/home/userPages/Login';
import Register from './pages/home/userPages/Register';

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });


  return (
    <>
    <BrowserRouter>
      <AppContext.Provider value={{ ...appState, setAppState }}>
        <div id='main'>
          <Header />
            <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </div>
        </AppContext.Provider>
    </BrowserRouter>
    </>
  )
}

export default App
