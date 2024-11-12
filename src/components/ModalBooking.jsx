import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const ModalBooking = ({ isOpen, onClose, data, onConfirm }) => {
  useEffect(() => {
    AOS.init();
  }, []);

  if (!isOpen) return null;

  // Fungsi untuk memformat harga
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        data-aos="zoom-in"
        data-aos-duration="1000"
        className="bg-[#F3E2CE] p-6 rounded-xl w-1/3 h-2/5 shadow-lg relative"
      >
        {/* Icon di atas modal */}
        <div className="absolute -top-32 left-1/2 transform -translate-x-1/2">
          <img
            src="/src/assets/tidyroom.png" // Sesuaikan path icon sesuai struktur folder
            alt="Icon"
            className="w-48 h-full object-contain"
          />
        </div>

        {/* Konten Modal */}
        <div className="mt-4">
          {/* Judul */}
          <h2 className="text-2xl font-bold text-[#5F3E16] text-center font-serif mb-4">
            Konfirmasi Pemesanan
          </h2>

          {/* Informasi Pengguna */}
          <div className="space-y-4">
            <div>
              <p className="text-[#074B5D] font-bold text-2xl">Apakah Anda:</p>
              <p className="text-black text-lg font-serif">
                {data?.userInfo?.username} ({data?.userInfo?.nim})
              </p>
              <p className="text-black text-lg font-serif">
                {data?.userInfo?.address}
              </p>
            </div>

            <div>
              <p className="text-red-600 font-bold text-xl">
                Ingin meminta bantuan kepada:
              </p>
              <p className="text-black text-lg font-serif">
                {data?.username} ({data?.nim})
              </p>
              <p className="text-black text-lg font-serif">
                Pukul {data?.workHours}
              </p>
              <p className="text-black text-lg font-serif">
                Rate {formatCurrency(data?.price)} / Jam
              </p>
            </div>
          </div>

          {/* Tombol Konfirmasi */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={onConfirm}
              className="bg-green-500 text-white px-8 py-2 rounded-full font-bold hover:bg-green-600 transition-colors duration-200"
            >
              Ya
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-8 py-2 rounded-full font-bold hover:bg-red-600 transition-colors duration-200"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBooking;
