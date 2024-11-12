import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../../config/Firebase"; // Pastikan path Firebase config benar
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import loginIcon from "../../assets/tidyroom.png";
import backgroundImage from "../../assets/room.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Registeruser = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [nim, setNim] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (
      !email ||
      !username ||
      !password ||
      !fullname ||
      !phone ||
      !nim ||
      !address
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Buat akun di Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Simpan data pengguna di Firestore dengan UID sebagai ID dokumen
      await setDoc(doc(db, "tidyuser", user.uid), {
        uid: user.uid,
        email,
        username,
        fullname,
        phone,
        nim,
        address,
      });

      alert("Registration successful!");
      navigate("/login"); // Arahkan ke halaman login setelah berhasil mendaftar
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      <Link
        to="/login"
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
        <div className="bg-[#F3E2CE] p-10 rounded-lg shadow-2xl w-3/5 h-full">
          <div className="mb-6">
            <img
              src={loginIcon}
              alt="Login Icon"
              className="w-56 -mt-48 mx-auto"
            />
          </div>
          <h2 className="text-3xl font-bold text-center text-[#5F3E16] mb-4">
            Budy's Register Page
          </h2>

          {/* Username Input */}
          <div className="mb-6 flex">
            <span className="text-4xl mr-3 mt-3">🏠</span>
            <div className="flex items-center bg-gray-200 p-4 rounded-lg w-full">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-transparent border-none outline-none placeholder-gray-500 font-bold pl-2 text-lg"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-6 flex">
            <span className="text-4xl mr-3 mt-3">📧</span>
            <div className="flex items-center bg-gray-200 p-4 rounded-lg w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent border-none outline-none placeholder-gray-500 font-bold pl-2 text-lg"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6 flex">
            <span className="text-4xl mr-3 mt-3">🔑</span>
            <div className="flex items-center bg-gray-200 p-3 rounded-lg w-full">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full font-bold bg-transparent border-none outline-none placeholder-gray-500 pl-2 text-lg"
              />
            </div>
          </div>

          {/* Fullname Input */}
          <div className="mb-6 flex">
            <span className="text-4xl mr-3 mt-3">🙍‍♂️</span>
            <div className="flex items-center bg-gray-200 p-3 rounded-lg w-full">
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Enter your fullname"
                className="w-full font-bold bg-transparent border-none outline-none placeholder-gray-500 pl-2 text-lg"
              />
            </div>
          </div>

          {/* Phone Number Input */}
          <div className="mb-6 flex">
            <span className="text-4xl mr-3 mt-3">📞</span>
            <div className="flex items-center bg-gray-200 p-3 rounded-lg w-full">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full font-bold bg-transparent border-none outline-none placeholder-gray-500 pl-2 text-lg"
              />
            </div>
          </div>

          {/* NIM Input */}
          <div className="mb-6 flex">
            <span className="text-4xl mr-3 mt-3">🆔</span>
            <div className="flex items-center bg-gray-200 p-3 rounded-lg w-full">
              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Enter your NIM"
                className="w-full font-bold bg-transparent border-none outline-none placeholder-gray-500 pl-2 text-lg"
              />
            </div>
          </div>

          {/* Address Input */}
          <div className="mb-8 flex">
            <span className="text-4xl mr-3 mt-3">📍</span>
            <div className="flex items-center bg-gray-200 p-3 rounded-lg w-full">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
                className="w-full font-bold bg-transparent border-none outline-none placeholder-gray-500 pl-2 text-lg"
              />
            </div>
          </div>

          <button
            onClick={handleRegister}
            className="w-full bg-[#612908] text-white py-3 rounded-lg hover:bg-[#5F3E16] text-lg font-semibold mb-6"
          >
            Register
          </button>

          <div className="flex justify-center">
            <div className=" font-bold flex">
              <p>Already have an account?</p>
              <p className="text-gray-700 mb-2">
                <Link
                  to="/login"
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registeruser;
