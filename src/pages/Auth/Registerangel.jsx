import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../../config/Firebase"; // Pastikan path Firebase config benar
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import loginIcon from "../../assets/tidyroom.png";
import backgroundImage from "../../assets/room.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Regisangel = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [nim, setNim] = useState("");
  const [workHours, setWorkHours] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (
      !email ||
      !username ||
      !password ||
      !fullname ||
      !phone ||
      !nim ||
      !workHours ||
      !price
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "tidyangel", user.uid), {
        uid: user.uid,
        email,
        username,
        fullname,
        phone,
        nim,
        workHours,
        price,
      });

      alert("Registration successful!");
      navigate("/login-angel");
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      <Link
        to="/login-angel"
        className="absolute top-4 left-4 text-white rounded-full text-xl flex items-center"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2 text-2xl" />
        Back
      </Link>
      <div
        className="w-1/3 h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="w-2/3 flex flex-col justify-center items-center bg-[#033543] p-12">
        <div className="bg-[#F3E2CE] p-10 rounded-lg shadow-2xl w-7/12 h-10/12 mt-20 ">
          <div className="mb-4">
            <img
              src={loginIcon}
              alt="Login Icon"
              className="w-44 -mt-40 mx-auto"
            />
          </div>
          <h2 className="text-2xl font-bold text-center text-[#5F3E16] mb-6">
            Angel's Register Page
          </h2>

          <div className="mb-4 flex">
            <span className="text-2xl mr-3 mt-3">🏠</span>
            <div className="flex items-center bg-gray-200 p-3 rounded-lg w-full">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="write your username here"
                className="w-full bg-transparent border-none outline-none placeholder-gray-500 font-bold pl-2 text-md"
              />
            </div>
          </div>

          <div className="mb-4 flex">
            <span className="text-2xl mr-3 mt-3">📧</span>
            <div className="flex items-center bg-gray-200 p-3 rounded-lg w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="write your email here"
                className="w-full bg-transparent border-none outline-none placeholder-gray-500 font-bold pl-2 text-md"
              />
            </div>
          </div>

          <div className="mb-4 flex">
            <span className="text-2xl mr-3 mt-3">🔑</span>
            <div className="flex items-center bg-gray-200 p-3 rounded-lg w-full">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="write your password here"
                className="w-full font-bold bg-transparent border-none outline-none placeholder-gray-500 pl-2 text-lg"
              />
            </div>
          </div>

          <div className="mb-4 flex">
            <span className="text-2xl mr-3 mt-3">🙍‍♂️</span>
            <div className="flex items-center bg-gray-200 p-3 rounded-lg w-full">
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="write your fullname here"
                className="w-full font-bold bg-transparent border-none outline-none placeholder-gray-500 pl-2 text-md"
              />
            </div>
          </div>

          <div className="mb-4 flex">
            <span className="text-2xl mr-3 mt-3">📞</span>
            <div className="flex items-center bg-gray-200 p-3 rounded-lg w-full">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="write your phone here"
                className="w-full font-bold bg-transparent border-none outline-none placeholder-gray-500 pl-2 text-md"
              />
            </div>
          </div>

          <div className="mb-4 flex">
            <span className="text-2xl mr-3 mt-3">🆔</span>
            <div className="flex items-center bg-gray-200 p-3 rounded-lg w-full">
              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="write your NIM here"
                className="w-full font-bold bg-transparent border-none outline-none placeholder-gray-500 pl-2 text-md"
              />
            </div>
          </div>

          <div className="mb-4 flex">
            <span className="text-2xl mr-3 mt-3">🕒</span>
            <div className="flex items-center bg-gray-200 p-3 rounded-lg w-full">
              <input
                type="text"
                value={workHours}
                onChange={(e) => setWorkHours(e.target.value)}
                placeholder="write your work hours here"
                className="w-full font-bold bg-transparent border-none outline-none placeholder-gray-500 pl-2 text-md"
              />
            </div>
          </div>

          <div className="mb-6 flex">
            <span className="text-2xl mr-3 mt-3">💲</span>
            <div className="flex items-center bg-gray-200 p-3 rounded-lg w-full">
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="write your price here"
                className="w-full font-bold bg-transparent border-none outline-none placeholder-gray-500 pl-2 text-md"
              />
            </div>
          </div>

          <button
            onClick={handleRegister}
            className="w-full bg-[#612908] text-white py-3 rounded-lg hover:bg-[#5F3E16] text-lg font-semibold mb-6"
          >
            Register
          </button>

          <div className="text-center font-bold flex justify-center">
            <p> Already have an account? </p>
            <p className="text-blue-700 mb-2">
              <Link to="/login-angel" className="ml-2 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Regisangel;
