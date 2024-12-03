import Navbar from "../../components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-dark-green min-h-screen flex flex-col items-center">
        {/* Main Content Section */}
        <main className="flex flex-col items-center text-center mt-40 px-4">
          <div
            data-aos="fade-up"
            data-aos-anchor-placement="bottom-bottom"
            data-aos-duration="2000"
            className="scale-150"
          >
            <img
              src="/src/assets/tidyroom.png" // Ganti dengan path ikon yang sesuai
              alt="TinyRoom Icon"
              className="rounded-full"
            />
          </div>
          <h1
            data-aos="fade-up"
            data-aos-anchor-placement="bottom-bottom"
            data-aos-duration="2000"
            className="text-white text-4xl font-semibold mt-20"
          >
            TidyRoom: Layanan Bersih Kamar Kost untuk Mahasiswa
          </h1>
          <p
            data-aos="fade-up"
            data-aos-anchor-placement="bottom-bottom"
            data-aos-duration="2000"
            className="text-gray-300 text-xl max-w-4xl mt-4"
          >
            TinyRoom menyediakan jasa pembersihan kamar kost yang cepat,
            terjangkau, dan profesional. Dengan beberapa klik, kamar Anda akan
            kembali rapi dan nyaman, sehingga Anda bisa fokus pada hal-hal
            penting lainnya.
          </p>
        </main>
      </div>
    </>
  );
};

export default Home;
