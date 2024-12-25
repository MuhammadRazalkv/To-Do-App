
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login"
import SignUp from "./Pages/Login/SignUp";
import Profile from "./Pages/Profile/Profile";

import AdminLogin from "./Components/Admin/AdminLogin.tsx";

import './App.css'
import Home from "./Pages/Home/Home";
import AdminHomePage from "./Components/Admin/AdminHomePage";
import EditUser from "./Components/Admin/editUser";
import AddUser from "./Components/Admin/AddUser.tsx";
import ProtectedRoute from "./Components/AuthProtection/ProtectedRoutes.tsx";
import { AdminProtected } from "./Components/AuthProtection/AdminProtected.tsx";

const App = () => {

  return (
    <BrowserRouter>
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route  element={<ProtectedRoute />} >
        <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route  element={<AdminProtected />} > 

        <Route path="/admin/home" element={<AdminHomePage />} />
        <Route path="/admin/editUser/:id" element={<EditUser />} />
        <Route path="/admin/addUser" element={<AddUser />} />
        </Route>
      </Routes>
     
    </BrowserRouter>
  )
}

export default App
