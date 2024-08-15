import { useState } from 'react'
import { AppContext } from './state/app.context';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './pages/home/Home'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';


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
          </Routes>
        </div>
        </AppContext.Provider>
    </BrowserRouter>
    </>
  )
}

export default App
