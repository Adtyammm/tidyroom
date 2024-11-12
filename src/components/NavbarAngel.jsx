import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../config/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Menu, Transition } from "@headlessui/react";
import {
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import logo from "../assets/tidyroom.png";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, "tidyangel", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUsername(userDoc.data().username || "User");
          } else {
            console.log("Dokumen pengguna tidak ditemukan di Firestore.");
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
        }
      } else {
        setUsername("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUsername("");
      navigate("/"); // Pindah ke halaman setelah logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between bg-gray-200 bg-opacity-75 p-2 shadow-lg shadow-slate-400 z-50">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-15 w-20 mr-4" />
      </div>

      <div className="flex items-center space-x-4 text-3xl font-bold mr-12 gap-6">
        <Link to="/home-angel" className="text-dark-green hover:text-gray-600">
          Home
        </Link>
        <Link to="/work-angel" className="text-dark-green hover:text-gray-600">
          Work
        </Link>

        {user ? (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="text-dark-green px-4 py-2 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ease-in-out duration-150">
              Hi, {username || "Loading..."}
            </Menu.Button>

            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-200 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                <div className="p-4">
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {username}
                  </p>
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/profile"
                      className={`${
                        active
                          ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
                          : "text-gray-700"
                      } flex items-center px-4 py-2 text-sm rounded-md transition-colors duration-150`}
                    >
                      <UserIcon className="w-5 h-5 mr-2" />
                      Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/settings"
                      className={`${
                        active
                          ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                          : "text-gray-700"
                      } flex items-center px-4 py-2 text-sm rounded-md transition-colors duration-150`}
                    >
                      <Cog6ToothIcon className="w-5 h-5 mr-2" />
                      Settings
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active
                          ? "bg-gradient-to-r from-red-400 to-red-500 text-white"
                          : "text-red-600"
                      } flex items-center w-full px-4 py-2 text-sm rounded-md transition-colors duration-150`}
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <Link
            to="/login"
            className="bg-dark-green text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
