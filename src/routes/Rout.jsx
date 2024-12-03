import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/user/Home";
import Book from "../pages/user/Book";
import LoginChoice from "../pages/Auth/Login";
import Loginuser from "../pages/Auth/Loguser";
import Loginangel from "../pages/Auth/Logangel";
import Regisangel from "../pages/Auth/Registerangel";
import Regisuser from "../pages/Auth/Registeruser";
import HomeAngel from "../pages/angel/HomeAngel";
import WorkPage from "../pages/angel/WorkPage";
import Activity from "../pages/user/Activity";
import Profile from "../pages/user/Profile";
import HomeUser from "../pages/user/Homeuser";
import ProfileAngel from "../pages/angel/ProfileAngel";

const Rout = () => {
  return (
    <>
      <Routes>
        {/* Routes untuk user */}\
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Book />} />
        <Route path="/login" element={<LoginChoice />} />
        <Route path="/login-buddy" element={<Loginuser />} />
        <Route path="/login-angel" element={<Loginangel />} />
        <Route path="/regis-angel" element={<Regisangel />} />
        <Route path="/regis-buddy" element={<Regisuser />} />
        <Route path="/home-angel" element={<HomeAngel />} />
        <Route path="/work-angel" element={<WorkPage />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/profile-user" element={<Profile />} />
        <Route path="/home-user" element={<HomeUser />} />
        <Route path="/profile-angel" element={<ProfileAngel />} />
      </Routes>
    </>
  );
};

export default Rout;
