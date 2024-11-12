import React, { useState } from "react";
import { auth, db } from "../../config/Firebase"; // Pastikan path Firebase config benar
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import loginIcon from "../../assets/tidyroom.png";
import backgroundImage from "../../assets/room.png";

const Loginuser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State untuk loading modal
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true); // Mulai animasi loading
    try {
      // Login menggunakan email dan password di Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Login Berhasil:", user);

      // Mengambil data pengguna tambahan dari Firestore berdasarkan UID
      const userDocRef = doc(db, "tidyuser", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User data from Firestore:", userData);
      } else {
        console.log("No user document found in Firestore.");
      }

      navigate("/"); // Arahkan ke halaman utama setelah login berhasil
    } catch (error) {
      console.error("Login Gagal:", error);
      setErrorMessage("Login gagal: Email atau Password salah.");
    } finally {
      setIsLoading(false); // Hentikan animasi loading
    }
  };

  return (
    <div className="min-h-screen flex relative">
      <Link
        to="/"
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
        <div className="bg-[#F3E2CE] p-10 rounded-lg shadow-2xl w-3/5 h-1/2">
          <div className="mb-6">
            <img
              src={loginIcon}
              alt="Login Icon"
              className="w-56 -mt-48 mx-auto"
            />
          </div>
          <h2 className="text-3xl font-bold text-center text-[#5F3E16] mb-8">
            Budy's Log in Page
          </h2>

          {/* Tampilkan pesan error jika login gagal */}
          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}

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
          <div className="mb-8 flex">
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

          <button
            onClick={handleLogin}
            className="w-full bg-[#612908] text-white py-3 rounded-lg hover:bg-[#5F3E16] text-lg font-semibold mb-6"
          >
            Login
          </button>

          <div className="text-center font-bold">
            <p className="text-gray-700 mb-2">
              <Link to="#" className="hover:underline">
                Forgot password?
              </Link>{" "}
              or{" "}
              <Link to="/regis-buddy" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Modal Loading */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
            <div className="flex space-x-2">
              <div className="h-5 w-5 bg-[#033543] rounded-full animate-bounce" />
              <div className="h-5 w-5 bg-[#612908] rounded-full animate-bounce delay-150" />
              <div className="h-5 w-5 bg-[#F3E2CE] rounded-full animate-bounce delay-300" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loginuser;
