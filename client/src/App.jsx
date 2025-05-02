import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import RequestSmartBinForm from './pages/RequestWaste/RequestSmartBinForm';
import CardPayment from './pages/Payement/CardPayment';
import ClientBill from './pages/Payement/ClientBill';
import CollectRequestForm from './pages/RequestWaste/CollectRequestForm';
import EmployeeDashboard from './pages/EmpDash';
import EmpPickups from './pages/EmpPickups';
import EmpTeams from './pages/EmpTeams';
import EmpLogs from './pages/EmpLogs';
import Sidebar from './pages/EmpSidebar';
import Inventory from './pages/Inventory/Inventory';
import InventoryDashboard from './pages/Inventory/InventoryDashboard';
import BinManagement from './pages/Inventory/BinManagement ';
import ProfileUI from './components/ProfileUI';
import UserDetailShow from './pages/ProfileData/UserDetailShow';
import UserSmartBinDetailShow from './pages/ProfileData/UserSmartBinDetailShow';
import WasteManagementChatBot from './pages/chatbot/WasteManagementChatBot';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import PrivateRoute from './components/PrivateRoute';
import SmartBinRequestsTable from './pages/Inventory/SmartBinRequestsTable';
import UpdateInventoryForm from './pages/Inventory/UpdateInventoryForm';
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
        <Route path='/EmployeeDashboard' element={<EmployeeDashboard/>} />
        <Route path='/inventory' element={<Inventory/>} />
        <Route path='/inveDash' element={<InventoryDashboard/>} />
        <Route path='/bin' element={<BinManagement/>} />
        <Route path='/CollectRequestForm' element={<CollectRequestForm />} />
        <Route path='/RequestSmartBinForm' element={<RequestSmartBinForm />} />
        <Route path='/pages/RequestSmartBinForm' element={<RequestSmartBinForm />} />
        <Route path='/CardPayment' element={<CardPayment />} />
        <Route path='/ClientBill' element={<ClientBill />} />
        <Route path='/pages/profileData/UserSmartBinDetailShow' element={<UserSmartBinDetailShow />} />
        <Route path='/pages/CollectRequestForm' element={<CollectRequestForm />} />
        <Route path='/EmployeeDashboard' element={<EmployeeDashboard />} />
        <Route path='/profileui' element={<ProfileUI />} />
        <Route path='/pages/ProfileData/UserDetailShow' element={<UserDetailShow />} />
        <Route path='/profileui' element={<ProfileUI/>} />
        <Route element={<PrivateRoute/>}>
         <Route path='/Dashboard' element={<Dashboard />} />
         <Route path='/test' element={<SmartBinRequestsTable />} />
         <Route path="/inventory/update/:id" element={<UpdateInventoryForm />} />

          
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/wastebot' element={<WasteManagementChatBot/>} />
          <Route path='/EmployeeDashboard' element={<EmployeeDashboard />} />
          <Route path='/EmpPickups' element={<EmpPickups />} />
          <Route path='/EmpTeams' element={<EmpTeams />} />
          <Route path='/EmpSidebar' element={<Sidebar />} />
          <Route path='/EmpLogs' element={<EmpLogs />} />
       </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
