import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Home from './pages/Home';
function App() {
  return (
    <BrowserRouter>
       <Header />
       <Routes>
    
       <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
       </Routes>
         
    </BrowserRouter>
  
  )
}
//test
export default App