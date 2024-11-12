import { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  X,
  Info,
  User,
} from "lucide-react";
import NavbarAngel from "../../components/NavbarAngel";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc as firestoreDoc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../config/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import InfoModal from "../../components/ModalInfo";

const HomeAngel = () => {
  const [activeWorks, setActiveWorks] = useState([]);
  const [activity, setActivity] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [angelId, setAngelId] = useState(null);
  const [reload, setReload] = useState(false); // State for triggering reload
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Function to handle auth and set angelId
  const handleAuthState = () => {
    onAuthStateChanged(auth, (user) => {
      setAngelId(user ? user.uid : null);
    });
  };

  // Function to fetch active works data
  const fetchActiveWorks = async (userId) => {
    try {
      const q = query(
        collection(db, "book"),
        where("userIdAngel", "==", userId),
        where("status", "in", ["pending", "accepted", "rejected", "complete"])
      );

      onSnapshot(q, async (snapshot) => {
        const bookings = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const bookingData = docSnapshot.data();

            // Fetch user details from `tidyuser` collection
            const userRef = firestoreDoc(db, "tidyuser", bookingData.userId);
            const userSnap = await getDoc(userRef);
            const username = userSnap.exists()
              ? userSnap.data().username
              : "Unknown User";
            const address = userSnap.exists()
              ? userSnap.data().address
              : "Unknown Address";
            const phone = userSnap.exists()
              ? userSnap.data().phone
              : "Unknown Phone";
            const nim = userSnap.exists() ? userSnap.data().nim : "Unknown NIM"; // NIM

            // Fetch work hours from `tidyangel` collection
            const angelRef = firestoreDoc(
              db,
              "tidyangel",
              bookingData.userIdAngel
            );
            const angelSnap = await getDoc(angelRef);
            const workHours = angelSnap.exists()
              ? angelSnap.data().workHours
              : "Unknown Hours";

            return {
              id: docSnapshot.id,
              ...bookingData,
              username,
              address,
              phone,
              nim, // Adding NIM
              workHours,
            };
          })
        );

        // Separate data based on status
        const active = bookings.filter((b) => b.status === "pending");
        const accepted = bookings.filter((b) => b.status === "accepted");
        const rejectedOrComplete = bookings.filter((b) =>
          ["rejected", "complete"].includes(b.status)
        );

        setActiveWorks(active);
        setActivity(accepted);
        setHistoryData(rejectedOrComplete);
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleAccept = async (booking) => {
    try {
      const bookingRef = firestoreDoc(db, "book", booking.id);
      await updateDoc(bookingRef, { status: "accepted" });

      // Add booking to activity only if it is not already present
      const existingBooking = activity.find((b) => b.id === booking.id);
      if (!existingBooking) {
        setActiveWorks((prev) => prev.filter((b) => b.id !== booking.id));
        setActivity((prev) => [...prev, { ...booking, status: "accepted" }]);
      }

      // Trigger reload
      setReload((prev) => !prev);
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      const bookingRef = firestoreDoc(db, "book", bookingId);
      // Update status booking menjadi rejected
      await updateDoc(bookingRef, { status: "rejected" });

      // Find the rejected booking and add it to historyData
      const rejectedBooking = activeWorks.find((b) => b.id === bookingId);
      if (rejectedBooking) {
        setHistoryData((prev) => [
          ...prev,
          { ...rejectedBooking, status: "rejected" },
        ]);
      }

      // Remove rejected booking from activeWorks
      setActiveWorks((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (error) {
      console.error("Error rejecting booking:", error);
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "canceled":
        return "text-red-600";
      case "rejected":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  useEffect(() => {
    handleAuthState();
  }, []);

  useEffect(() => {
    if (angelId) {
      fetchActiveWorks(angelId);
    }
  }, [angelId, reload]); // Re-fetch when reload changes

  return (
    <>
      <NavbarAngel />
      <div className="min-h-screen h-full w-full bg-[#084556] p-8">
        <div className="w-full mx-auto mt-28">
          <h1 className="text-3xl font-bold text-white mb-4">Hi, Angel</h1>

          {/* Active Works Section */}
          <div className="space-y-4">
            {activeWorks.length > 0 ? (
              activeWorks.map((act) => (
                <div
                  key={act.id}
                  className="bg-[#F3E2CE] rounded-lg p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex justify-center items-center">
                        {/* Placeholder for Profile Picture */}
                        <User size={32} className="text-gray-500" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-4">
                          <span className="text-xl text-gray-700">
                            {act.username}
                          </span>
                          <span className="text-lg text-gray-500">
                            {act.nim} {/* Display NIM */}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-xl text-gray-600 mt-2">
                          <MapPin size={18} />
                          <span>{act.address}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-xl text-gray-600 mt-2">
                          <Clock size={20} />
                          <span>{act.workHours}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => openModal(act)}
                        className="p-2 scale-125 hover:bg-[#FFD28F] rounded-lg"
                      >
                        <Info size={28} className="text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleAccept(act)}
                        className="p-2 scale-125 hover:bg-[#FFD28F] rounded-lg"
                      >
                        <CheckCircle size={28} className="text-green-500" />
                      </button>
                      <button
                        onClick={() => handleReject(act.id)}
                        className="p-2 scale-125 hover:bg-[#FFD28F] rounded-lg"
                      >
                        <X size={28} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#F3E2CE] rounded-lg p-6 shadow-lg text-center text-gray-500">
                No active bookings.
              </div>
            )}
          </div>

          {/* Info Modal */}
          <InfoModal
            isOpen={isModalOpen}
            onClose={closeModal}
            booking={selectedBooking}
          />

          {/* History Section */}
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="bg-[#F3E2CE] rounded-lg p-6 shadow-lg">
              <h2 className=" text-4xl font-semibold mx-auto mb-6 text-center">
                HISTORY
              </h2>
              <div className="space-y-0">
                {historyData.length > 0 ? (
                  historyData.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between text-lg py-3 ${
                        index !== historyData.length - 1
                          ? "border-b border-gray-300"
                          : ""
                      }`}
                    >
                      <span className="text-gray-600">{item.date}</span>
                      <span>{item.username}</span>
                      <span className="text-gray-500">{item.code}</span>
                      <span className={getStatusColor(item.status)}>
                        {item.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500">
                    No history available.
                  </div>
                )}
              </div>
            </div>

            {/* Activity Section */}
            <div className="bg-[#F3E2CE] rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-center mb-6">
                Activity
              </h2>
              {activity.length > 0 ? (
                activity.map((act) => (
                  <div
                    key={act.id}
                    className="bg-[#084556] text-white p-6 rounded-lg mb-4"
                  >
                    <h3 className="text-xl font-medium">{act.username}</h3>
                    <p className="text-lg mt-2">{act.nim}</p>
                    <p className="text-lg mt-2">{act.phone}</p>
                    <p className="text-lg mt-2">{act.address}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No active activities.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeAngel;
