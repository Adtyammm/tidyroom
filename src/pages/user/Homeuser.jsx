import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import {
  Clock,
  MapPin,
  CreditCard,
  Activity,
  Calendar,
  User,
  Phone,
} from "lucide-react";

const HomeUser = () => {
  const [activity, setActivity] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [angelDetails, setAngelDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null); // State untuk data angel

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    AOS.init();
    if (auth.currentUser) {
      fetchUserActivity();
      fetchUserHistory();
    }
  }, [auth.currentUser]);

  // Fungsi untuk mengambil data aktivitas (angel yang sedang dibooking) berdasarkan userIdAngel dan progress booking
  const fetchUserActivity = async () => {
    try {
      const userID = auth.currentUser.uid; // Ambil userID pengguna yang sedang login
      const q = query(
        collection(db, "book"),
        where("userId", "==", userID), // Memfilter berdasarkan userID pengguna
        where("status", "in", ["pending", "accepted"]) // Memfilter status booking atau pending
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const activityData = querySnapshot.docs.map((doc) => doc.data());
        setActivity(activityData[0]); // Ambil data pertama (aktivitas pertama yang ditemukan)

        // Ambil detail angel berdasarkan userIdAngel
        const userId = activityData[0].userId;
        fetchUserDetails(userId);

        const userIdAngel = activityData[0].userIdAngel;
        fetchAngelDetails(userIdAngel); // Memanggil fungsi untuk mengambil detail angel
        console.log(userIdAngel);
      } else {
        setActivity(null); // Tidak ada aktivitas yang ditemukan
      }
    } catch (error) {
      console.error("Error fetching user activity:", error);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const userRef = doc(db, "tidyuser", userId); // Mengambil data angel berdasarkan userIdAngel
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUserDetails(userDoc.data()); // Menyimpan data angel ke state
      } else {
        console.log("No such angel!");
      }
    } catch (error) {
      console.error("Error fetching angel details:", error);
    }
  };
  const fetchAngelDetails = async (userIdAngel) => {
    try {
      const angelRef = doc(db, "tidyangel", userIdAngel); // Mengambil data angel berdasarkan userIdAngel
      const angelDoc = await getDoc(angelRef);
      if (angelDoc.exists()) {
        setAngelDetails(angelDoc.data()); // Menyimpan data angel ke state
        return angelDoc.data();
      } else {
        console.log("No such angel!");
      }
    } catch (error) {
      console.error("Error fetching angel details:", error);
    }
  };

  // Fungsi untuk mengambil history booking berdasarkan userID
  const fetchUserHistory = async () => {
    if (!auth.currentUser) return;

    try {
      const userID = auth.currentUser.uid; // Ambil userID pengguna yang sedang login
      const q = query(
        collection(db, "book"),
        where("userId", "==", userID) // Memfilter berdasarkan userID
      );

      const querySnapshot = await getDocs(q);
      const historyData = querySnapshot.docs.map((doc) => doc.data());

      // Ambil detail angel untuk setiap booking
      const historyWithAngelDetails = await Promise.all(
        historyData.map(async (booking) => {
          const angelDetails = await fetchAngelDetails(booking.userIdAngel); // Ambil angel details berdasarkan userIdAngel
          return { ...booking, angelDetails }; // Gabungkan data booking dengan detail angel
        })
      );

      setHistory(historyWithAngelDetails); // Set state dengan data history lengkap
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user history:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-dark-green to-[#0c8599] ">
        {/* Activity Section */}
        <div className="w-full px-4 md:px-6 py-8">
          <div
            className="max-w-4xl mx-auto"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <h2 className="mt-20 text-4xl font-bold mb-8 text-center text-white">
              Current Activity
            </h2>

            {activity ? (
              <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  {/* Angel Info */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                        <User size={32} className="text-teal-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-teal-800">
                          {angelDetails?.fullname || "Angel Name"}
                        </h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                          {activity.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Clock className="w-5 h-5 text-teal-600" />
                        <span>
                          {angelDetails?.workHours || "Work Hours N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Phone className="w-5 h-5 text-teal-600" />
                        <span>{angelDetails?.phone || "Work Hours N/A"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <CreditCard className="w-5 h-5 text-teal-600" />
                        <span>
                          {angelDetails?.price
                            ? `Rp ${Number(angelDetails.price).toLocaleString(
                                "id-ID"
                              )} / jam`
                            : "Price N/A"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="w-5 h-5 text-teal-600" />
                        <span>{userDetails?.address || "Address N/A"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Activity className="w-5 h-5 text-teal-600" />
                        <span>Progress: {activity.progress || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 bg-white/10 backdrop-blur rounded-2xl">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <p className="text-white text-xl">No ongoing activity</p>
              </div>
            )}
          </div>

          {/* History Section */}
          <div
            className="max-w-4xl mx-auto mt-16"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <h2 className="text-4xl font-bold mb-8 text-center text-white">
              Booking History
            </h2>

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/90 backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.angelDetails?.fullname ||
                              "No details available"}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {item.createdAt.toDate().toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          item.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : item.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-white/10 backdrop-blur rounded-2xl">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <p className="text-white text-xl">No booking history found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeUser;
