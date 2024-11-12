import React, { useState, useEffect } from "react";
import NavbarAngel from "../../components/NavbarAngel";
import {
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  X,
  Info,
  User,
} from "lucide-react";
import { db, auth } from "../../config/Firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import moment from "moment";

const WorkPage = () => {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [isAvailable, setIsAvailable] = useState(false);
  const [userId, setUserId] = useState(null);
  const [ongoingWorks, setOngoingWorks] = useState([]); // Data Pekerjaan Aktif

  useEffect(() => {
    // Mendapatkan userId saat ini dan status kerja dari Firestore
    const fetchStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
        const userDocRef = doc(db, "tidyangel", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setIsAvailable(userDoc.data().status || false); // Mengatur status awal dari Firestore
        }
      }
    };
    fetchStatus();
  }, []);

  useEffect(() => {
    // Fetch data booking dengan status 'accepted'
    if (userId) {
      const q = query(
        collection(db, "book"),
        where("userIdAngel", "==", userId),
        where("status", "==", "accepted")
      );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const works = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const bookingData = docSnapshot.data();

            // Mendapatkan data pengguna dari tidyuser berdasarkan userId
            const userRef = doc(db, "tidyuser", bookingData.userId);
            const userSnap = await getDoc(userRef);
            const fullname = userSnap.exists()
              ? userSnap.data().fullname
              : "Unknown User";
            const address = userSnap.exists()
              ? userSnap.data().address
              : "Unknown Address";
            const nim = userSnap.exists() ? userSnap.data().nim : "Unknown NIM";

            // Mendapatkan data angel dari tidyangel berdasarkan userIdAngel
            const angelRef = doc(db, "tidyangel", bookingData.userIdAngel);
            const angelSnap = await getDoc(angelRef);
            const workHours = angelSnap.exists()
              ? angelSnap.data().work_hours
              : "Unknown Hours";
            const price = angelSnap.exists()
              ? angelSnap.data().price
              : "Unknown Price";

            // Hitung durasi sejak accepted
            const acceptedAt = bookingData.acceptedAt?.toDate(); // assuming acceptedAt is set in Firestore
            const duration = acceptedAt
              ? moment().diff(moment(acceptedAt), "hours")
              : null;

            return {
              id: docSnapshot.id,
              fullname,
              nim,
              address,
              workHours,
              price,
              duration,
              status: bookingData.status,
            };
          })
        );
        setOngoingWorks(works);
      });

      // Cleanup listener
      return () => unsubscribe();
    }
  }, [userId]);

  const handleToggle = async () => {
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);

    // Memperbarui status di Firestore
    if (userId) {
      const userDocRef = doc(db, "tidyangel", userId);
      await updateDoc(userDocRef, {
        status: newStatus,
      });
    }
  };

  // Handle completion of the booking
  const handleComplete = async (booking) => {
    try {
      const bookingRef = doc(db, "book", booking.id);
      await updateDoc(bookingRef, { status: "complete" });

      // Update ongoingWorks to remove the completed booking
      setOngoingWorks((prev) => prev.filter((b) => b.id !== booking.id));
    } catch (error) {
      console.error("Error completing booking:", error);
    }
  };

  return (
    <>
      <NavbarAngel />
      <div className="min-h-screen bg-[#074B5D] pt-8 px-16">
        {/* Header with Status Toggle */}
        <div className="flex justify-between items-center mb-8 mt-24">
          <div className="flex-1">
            <h1 className="text-4xl font-serif italic text-white">
              Work Dashboard
            </h1>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-4 bg-[#B5C7D3] px-6 py-3 rounded-xl">
            <span className="text-[#074B5D] font-medium">Status Kerja:</span>
            <button
              onClick={handleToggle}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ${
                isAvailable ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                  isAvailable ? "translate-x-9" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`font-medium ${
                isAvailable ? "text-green-600" : "text-gray-600"
              }`}
            >
              {isAvailable ? "Ready" : "Not Available"}
            </span>
          </div>
        </div>

        {/* Status Message */}
        {!isAvailable && (
          <div className="bg-yellow-100 text-yellow-800 px-6 py-3 rounded-lg mb-6">
            ⚠️ Anda sedang tidak aktif. Aktifkan status untuk menerima pekerjaan
            baru.
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "ongoing"
                ? "bg-[#69C2E8] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("ongoing")}
          >
            Pekerjaan Aktif
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "history"
                ? "bg-[#69C2E8] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Riwayat Pekerjaan
          </button>
        </div>

        {/* Content Section - Ongoing Works */}
        <div className="bg-[#B5C7D3] bg-opacity-80 rounded-2xl p-8 shadow-2xl">
          {activeTab === "ongoing" ? (
            <div className="space-y-4">
              {ongoingWorks.length > 0 ? (
                ongoingWorks.map((work) => (
                  <div
                    key={work.id}
                    className="bg-white rounded-xl p-6 shadow-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <img
                              src="/path/to/customer/avatar.jpg"
                              alt=""
                              className="w-8 h-8 rounded-full"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">
                              {work.fullname}
                            </h3>
                            <p className="text-gray-600">{work.nim}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin size={18} />
                            <span>{work.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={18} />
                            <span>{work.workHours}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign size={18} />
                            <span>{work.price} /jam</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Info size={24} className="text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleComplete(work)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <CheckCircle size={24} className="text-green-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <X size={24} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>
                          {work.duration
                            ? `${work.duration} jam tersisa`
                            : "Waktu tidak tersedia"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(work.duration / 2) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No active bookings.
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#FFE6C9] rounded-xl overflow-hidden shadow-lg">
              {/* History Table (add here if needed) */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WorkPage;
