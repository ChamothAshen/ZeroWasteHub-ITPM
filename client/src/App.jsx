import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CollectRequestForm from './pages/RequestWaste/CollectRequestForm';
import RequestSmartBinForm from './pages/RequestWaste/RequestSmartBinForm';
import CardPayment from './pages/Payement/CardPayment';
import ClientBill from './pages/Payement/ClientBill';

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
        <Route path='/CollectRequestForm' element={<CollectRequestForm />} />
        <Route path='/RequestSmartBinForm' element={<RequestSmartBinForm />} />
        <Route path='/CardPayment' element={<CardPayment />} />
        <Route path='/ClientBill' element={<ClientBill />} />
      </Routes>

    </BrowserRouter>

  )
}

export default App