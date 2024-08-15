import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './pages/home/Home'
import './App.css'

function App() {


  return (
    <>
    <BrowserRouter>
      <div id='main'>
        <Header />
        <Routes>
        <Route path='/' element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
    </>
  )
}

export default App
