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
  Calendar,
  Search,
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
  serverTimestamp,
} from "firebase/firestore";
import moment from "moment";

const WorkPage = () => {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [isAvailable, setIsAvailable] = useState(false);
  const [userId, setUserId] = useState(null);
  const [ongoingWorks, setOngoingWorks] = useState([]);
  const [historyWorks, setHistoryWorks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
        const userDocRef = doc(db, "tidyangel", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setIsAvailable(userDoc.data().status || false);
        }
      }
    };
    fetchStatus();
  }, []);

  // Fetch Ongoing Works
  useEffect(() => {
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

            const userRef = doc(db, "tidyuser", bookingData.userId);
            const userSnap = await getDoc(userRef);
            const fullname = userSnap.exists()
              ? userSnap.data().fullname
              : "Unknown User";
            const address = userSnap.exists()
              ? userSnap.data().address
              : "Unknown Address";
            const nim = userSnap.exists() ? userSnap.data().nim : "Unknown NIM";

            const angelRef = doc(db, "tidyangel", bookingData.userIdAngel);
            const angelSnap = await getDoc(angelRef);
            const workHours = angelSnap.exists()
              ? angelSnap.data().workHours
              : "Unknown Hours";
            const price = angelSnap.exists()
              ? angelSnap.data().price
              : "Unknown Price";

            const acceptedAt = bookingData.acceptedAt?.toDate();
            const duration = acceptedAt
              ? moment().diff(moment(acceptedAt), "hours")
              : null;

            const progress = bookingData.progress || "Sedang menuju lokasi";

            return {
              id: docSnapshot.id,
              fullname,
              nim,
              address,
              workHours,
              price,
              duration,
              status: bookingData.status,
              progress, // Progress added here
            };
          })
        );
        setOngoingWorks(works);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  // Fetch History Works
  useEffect(() => {
    if (userId) {
      const q = query(
        collection(db, "book"),
        where("userIdAngel", "==", userId),
        where("status", "==", "complete")
      );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const works = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const bookingData = docSnapshot.data();
            const userRef = doc(db, "tidyuser", bookingData.userId);
            const userSnap = await getDoc(userRef);

            return {
              id: docSnapshot.id,
              date: bookingData.createdAt?.toDate(),
              fullname: userSnap.exists()
                ? userSnap.data().fullname
                : "Unknown User",
              nim: userSnap.exists() ? userSnap.data().nim : "Unknown NIM",
              status: bookingData.status,
              completedAt: bookingData.completedAt?.toDate(),
            };
          })
        );
        setHistoryWorks(works);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  const handleToggle = async () => {
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);

    if (userId) {
      const userDocRef = doc(db, "tidyangel", userId);
      await updateDoc(userDocRef, {
        status: newStatus,
      });
    }
  };

  const handleProgress = async (booking) => {
    try {
      const bookingRef = doc(db, "book", booking.id);

      let newProgress;
      if (booking.progress === "Menuju Konfirmasi") {
        newProgress = "Sedang Menuju Lokasi";
      } else if (booking.progress === "Sedang Menuju Lokasi") {
        newProgress = "Sudah sampai di lokasi dan sedang dikerjakan";
      } else {
        newProgress = "Sudah Selesai";
      }

      // Update progress di Firestore
      await updateDoc(bookingRef, {
        progress: newProgress,
      });

      // Perbarui status dalam UI
      setOngoingWorks((prevWorks) =>
        prevWorks.map((work) =>
          work.id === booking.id ? { ...work, progress: newProgress } : work
        )
      );
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleComplete = async (booking) => {
    try {
      const bookingRef = doc(db, "book", booking.id);
      await updateDoc(bookingRef, {
        status: "complete",
        completedAt: serverTimestamp(),
      });

      setOngoingWorks((prev) => prev.filter((b) => b.id !== booking.id));
    } catch (error) {
      console.error("Error completing booking:", error);
    }
  };

  const filteredHistory = historyWorks.filter(
    (work) =>
      work.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      work.nim.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        {/* Content Section */}
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
                            <User className="w-6 h-6 text-blue-500" />
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
                            <span>{work.price} / jam</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleComplete(work)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <CheckCircle size={34} className="text-green-500" />
                        </button>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{work.progress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={() => handleProgress(work)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <CheckCircle size={34} className="text-green-500" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  Tidak ada pekerjaan aktif saat ini.
                </div>
              )}
            </div>
          ) : (
            // History Section
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="flex items-center gap-4 bg-white rounded-lg p-2 w-full max-w-md">
                <Search className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama atau NIM..."
                  className="flex-1 outline-none text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* History Table */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#074B5D] to-[#137185] text-white">
                      <th className="py-4 px-6 text-left">Tanggal</th>
                      <th className="py-4 px-6 text-left">Nama</th>
                      <th className="py-4 px-6 text-left">NIM</th>
                      <th className="py-4 px-6 text-left">Status</th>
                      <th className="py-4 px-6 text-left">Selesai Pada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredHistory.map((work) => (
                      <tr
                        key={work.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            {moment(work.date).format("DD MMM YYYY")}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            {work.fullname}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-500">{work.nim}</td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {work.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-500">
                          {moment(work.completedAt).format(
                            "DD MMM YYYY, HH:mm"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Empty State */}
                {filteredHistory.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="mb-2">Tidak ada riwayat ditemukan</div>
                    {searchTerm && (
                      <div className="text-sm">
                        Coba sesuaikan kata kunci pencarian
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WorkPage;
