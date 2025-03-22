import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SmartBin from './pages/SmartBin';
import WasteCollection from './pages/WasteCollection';
import EmployeeDashboard from './pages/EmpDash';
import EmpTeams from './pages/EmpTeams';
import Logs from './pages/EmpLogs';
import PickupScheduler from './pages/EmpPickups';
import Sidebar from './pages/EmpSidebar';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Sidebar />
      <div className="pt-20 lg:ml-64">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/smartbin" element={<SmartBin />} />
          <Route path="/WasteCollection" element={<WasteCollection />} />
          <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
          <Route path="/EmpTeams" element={<EmpTeams />} />
          <Route path="/EmpLogs" element={<Logs />} />
          <Route path="/EmpPickups" element={<PickupScheduler />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;