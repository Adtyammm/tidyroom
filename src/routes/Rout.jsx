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
      </Routes>
    </>
  );
};

export default Rout;
