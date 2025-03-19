import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SmartBin from './pages/SmartBin';
import WasteCollection from './pages/WasteCollection';
function App() {
  return (
    <BrowserRouter>
       <Header />
       <Routes>
    
       <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/smartbin' element={<SmartBin/>} />
        <Route path='/WasteCollection' element={<WasteCollection/>} />
       </Routes>
         
    </BrowserRouter>
  
  )
}

export default App