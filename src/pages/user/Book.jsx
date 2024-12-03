import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import ModalBooking from "../../components/ModalBooking";
import AOS from "aos";
import "aos/dist/aos.css";
import { db, auth } from "../../config/Firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

const Book = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false); // Modal peringatan
  const [isLoading, setIsLoading] = useState(false);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [angels, setAngels] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [hasPendingBooking, setHasPendingBooking] = useState(false); // Status booking user

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "tidyangel"),
          where("status", "==", true)
        );
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAngels(fetchedData);
      } catch (error) {
        alert("Error fetching angels data");
      }
    };

    const fetchUserInfo = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "tidyuser", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserInfo({ ...userDoc.data(), id: user.uid });
          } else {
            alert("No user data found for the current user.");
          }
        }
      } catch (error) {
        alert("Error fetching user info");
      }
    };

    const checkPendingBooking = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const bookingQuery = query(
            collection(db, "book"),
            where("userId", "==", user.uid),
            where("status", "==", "pending")
          );
          const querySnapshot = await getDocs(bookingQuery);
          setHasPendingBooking(!querySnapshot.empty); // True jika ada booking pending
        }
      } catch (error) {
        alert("Error checking pending bookings.");
      }
    };

    fetchData();
    fetchUserInfo();
    checkPendingBooking();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleBookingClick = (item) => {
    if (hasPendingBooking) {
      setIsWarningModalOpen(true); // Tampilkan modal peringatan jika ada booking pending
    } else {
      setSelectedData(item);
      setIsModalOpen(true);
    }
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    if (userInfo && selectedData) {
      try {
        await addDoc(collection(db, "book"), {
          address: userInfo.address,
          nim: userInfo.nim,
          price: selectedData.price,
          status: "pending",
          progress: "Menuju Konfirmasi",
          userId: userInfo.id,
          userIdAngel: selectedData.id,
          createdAt: new Date(),
        });
        setIsBookingSuccess(true); // Tampilkan modal sukses
        setIsModalOpen(false); // Tutup modal booking setelah sukses
        setHasPendingBooking(true); // Update status booking
      } catch (error) {
        alert("Terjadi kesalahan saat melakukan booking. Coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Informasi pengguna atau data booking tidak lengkap.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#074B5D] pt-8 px-16">
        <h1
          data-aos="fade-up"
          data-aos-anchor-placement="bottom-bottom"
          data-aos-duration="2000"
          className="text-4xl font-serif italic text-white mb-8 mt-28"
        >
          List of Ready Angels
        </h1>

        <div
          data-aos="fade-up"
          data-aos-anchor-placement="bottom-bottom"
          data-aos-duration="2000"
          className="bg-[#B5C7D3] bg-opacity-80 rounded-2xl p-8 shadow-2xl relative"
        >
          <div className="overflow-hidden">
            <div className="grid grid-cols-5 gap-4 text-2xl font-medium text-[#612908] pb-4">
              <div className="pl-4">NAMA</div>
              <div>NIM</div>
              <div>Jam Kerja</div>
              <div>Rate</div>
              <div>Booking</div>
            </div>

            <div className="divide-y divide-[#074B5D]/20">
              {angels.map((angel) => (
                <div
                  key={angel.id}
                  className="grid grid-cols-5 gap-4 items-center py-6"
                >
                  <div className="flex items-center gap-4 pl-4">
                    <div className="overflow-hidden w-20 h-20 rounded-full">
                      <img
                        src={`http://localhost:5000/images/${angel.image}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xl font-medium text-[#074B5D]">
                      {angel.username}
                    </span>
                  </div>
                  <div className="text-xl font-medium text-[#074B5D]">
                    {angel.nim}
                  </div>
                  <div className="text-xl font-medium text-[#074B5D]">
                    {angel.workHours}
                  </div>
                  <div className="flex text-xl font-medium text-[#074B5D]">
                    {formatCurrency(angel.price)} <p className="ml-2">/ Jam</p>
                  </div>
                  <div className="flex justify-center w-1/3">
                    <button
                      onClick={() => handleBookingClick(angel)}
                      className="bg-[#69C2E8] text-black font-medium px-4 py-2 rounded hover:bg-[#4AA2D8] transition-colors duration-200 text-sm"
                    >
                      Booking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-1 bg-[#074B5D] rounded-full opacity-50"></div>
          </div>
        </div>

        <ModalBooking
          isOpen={isModalOpen && !isBookingSuccess}
          onClose={() => setIsModalOpen(false)}
          data={{ ...selectedData, userInfo }}
          onConfirm={handleConfirmBooking}
        />

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

        {isBookingSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-80 md:w-[400px] text-center relative">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="green"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Booking Berhasil!
              </h2>
              <p className="text-gray-600">
                Terima kasih! Pesanan Anda telah berhasil diproses.
              </p>

              <div className="mt-6">
                <button
                  onClick={() => {
                    setIsBookingSuccess(false);
                    setIsModalOpen(false);
                  }}
                  className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition duration-200"
                >
                  Tutup
                </button>
              </div>

              <div className="absolute -top-4 -right-4 w-20 h-20 bg-green-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-green-300 rounded-full opacity-10"></div>
            </div>
          </div>
        )}

        {isWarningModalOpen && (
          <div
            data-aos="zoom-in"
            data-aos-duration="500"
            className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50"
          >
            <div className="bg-white rounded-xl shadow-2xl p-8 w-80 md:w-[400px] text-center relative">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="red"
                    className="w-12 h-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3m0 4h.01M4.293 4.293a1 1 0 011.414 0l13 13a1 1 0 01-1.414 1.414l-13-13a1 1 0 010-1.414z"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Booking Gagal
              </h2>
              <p className="text-gray-600">
                Anda sudah melakukan booking. Tunggu konfirmasi dari angel
                terlebih dahulu.
              </p>

              <div className="mt-6">
                <button
                  onClick={() => setIsWarningModalOpen(false)}
                  className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition duration-200"
                >
                  Tutup
                </button>
              </div>

              <div className="absolute -top-4 -right-4 w-20 h-20 bg-red-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-red-300 rounded-full opacity-10"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Book;
