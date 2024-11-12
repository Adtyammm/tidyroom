import React, { useState } from "react";
import { auth, db } from "../../config/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import loginIcon from "../../assets/tidyroom.png";
import backgroundImage from "../../assets/room.png";
import ModalAlert from "../../components/ModalAlert"; // Import komponen ModalAlert

const Loginangel = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // State untuk modal alert
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "tidyangel", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log("Login Berhasil:", user);
        navigate("/home-angel");
      } else {
        setErrorMessage("Akun ini tidak diizinkan masuk.");
        setShowAlert(true); // Tampilkan modal alert jika akun tidak ditemukan
        await auth.signOut();
      }
    } catch (error) {
      console.error("Login Gagal:", error);
      if (error.code === "auth/user-not-found") {
        setErrorMessage("Akun dengan email ini tidak ditemukan.");
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("Password salah. Silakan coba lagi.");
      } else {
        setErrorMessage("Login gagal: Email atau Password salah.");
      }
      setShowAlert(true); // Tampilkan modal alert untuk kesalahan login
    } finally {
      setIsLoading(false);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen flex relative">
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
        <div className="bg-[#F3E2CE] p-10 rounded-lg shadow-2xl w-3/5 h-1/2">
          <div className="mb-6">
            <img
              src={loginIcon}
              alt="Login Icon"
              className="w-56 -mt-48 mx-auto"
            />
          </div>
          <h2 className="text-3xl font-bold text-center text-[#5F3E16] mb-8">
            Angel's Log in Page
          </h2>

          <div className="mb-6 flex">
            <span className="text-4xl mr-3 mt-3">🏠</span>
            <div className="flex items-center bg-gray-200 p-4 rounded-lg w-full">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="write your username here"
                className="w-full bg-transparent border-none outline-none placeholder-gray-500 font-bold pl-2 text-lg"
              />
            </div>
          </div>

          <div className="mb-8 flex">
            <span className="text-4xl mr-3 mt-3">🔑</span>
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
              <Link to="/regis-angel" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

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

      {showAlert && <ModalAlert message={errorMessage} onClose={closeAlert} />}
    </div>
  );
};

export default Loginangel;
