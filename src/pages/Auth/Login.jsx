import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/group.png"; // Sesuaikan dengan path gambar ikon

const LoginChoice = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#033543] to-[#67B3D3] flex flex-col justify-center items-center relative">
      {/* Tombol Back di pojok kiri atas */}
      <Link
        to="/"
        className="absolute top-4 left-4  text-white  rounded-full   text-xl flex items-center"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2 text-2xl" />
        Back
      </Link>

      {/* Bagian Logo */}
      <div className="mb-6">
        <img src={logo} alt="TidyROOM Logo" className="mx-auto mr-20" />
      </div>

      {/* Judul dan Deskripsi */}
      <p className="text-4xl text-white mb-8 text-center">
        Affordable Dorm Cleaning for Students!
      </p>

      {/* Tombol Pilihan Login */}
      <div className="flex space-x-8 mb-6">
        <Link
          to="/login-angel"
          className="bg-[#7E4A2E] text-white px-24 py-3 rounded-full text-xl font-semibold hover:bg-[#5F3E16]"
        >
          Angels
        </Link>
        <Link
          to="/login-buddy"
          className="bg-[#7E4A2E] text-white px-24 py-3 rounded-full text-xl font-semibold hover:bg-[#5F3E16]"
        >
          Buddies
        </Link>
      </div>

      {/* Ikon sapu di bagian bawah */}
      <div className="mt-4">
        <span className="text-7xl">🧹</span>{" "}
        {/* Ganti dengan ikon sapu yang sesuai */}
      </div>
    </div>
  );
};

export default LoginChoice;
