import { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  CheckCircle,
  X,
  Info,
  User,
  Calendar,
  Phone,
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
import moment from "moment";
import AcceptModal from "../../components/ModalAccept";

const HomeAngel = () => {
  const [activeWorks, setActiveWorks] = useState([]);
  const [activity, setActivity] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [angelId, setAngelId] = useState(null);
  const [reload, setReload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [acceptedBooking, setAcceptedBooking] = useState(null);

  const handleAuthState = () => {
    onAuthStateChanged(auth, (user) => {
      setAngelId(user ? user.uid : null);
    });
  };

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

            const userRef = firestoreDoc(db, "tidyuser", bookingData.userId);
            const userSnap = await getDoc(userRef);
            const fullname = userSnap.exists()
              ? userSnap.data().fullname
              : "Unknown User";
            const address = userSnap.exists()
              ? userSnap.data().address
              : "Unknown Address";
            const phone = userSnap.exists()
              ? userSnap.data().phone
              : "Unknown Phone";
            const nim = userSnap.exists() ? userSnap.data().nim : "Unknown NIM";

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
              fullname,
              address,
              phone,
              nim,
              workHours,
            };
          })
        );

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
      await updateDoc(
        bookingRef,
        { status: "accepted" },
        { progress: "Menunggu konfirmasi" }
      );

      const existingBooking = activity.find((b) => b.id === booking.id);
      if (!existingBooking) {
        setActiveWorks((prev) => prev.filter((b) => b.id !== booking.id));
        setActivity((prev) => [...prev, { ...booking, status: "accepted" }]);
      }
      setIsAcceptModalOpen(true);
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      const bookingRef = firestoreDoc(db, "book", bookingId);
      await updateDoc(bookingRef, { status: "rejected" });

      const rejectedBooking = activeWorks.find((b) => b.id === bookingId);
      if (rejectedBooking) {
        setHistoryData((prev) => [
          ...prev,
          { ...rejectedBooking, status: "rejected" },
          window.location.reload(),
        ]);
      }

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

  const closeAcceptModal = () => {
    setAcceptedBooking(null);
    setIsAcceptModalOpen(false);
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
  }, [angelId, reload]);

  const filteredHistory = historyData.filter(
    (item) =>
      item.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.nim && item.nim.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <NavbarAngel />
      <div className="min-h-screen h-full w-full bg-gradient-to-br from-[#084556] to-[#052E3A] p-8">
        <div className="w-full mx-auto mt-28">
          <h1 className="text-3xl font-bold text-white mb-6">Hi, Angel</h1>

          <div className="bg-[#F3E2CE] bg-opacity-90 rounded-xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-[#084556]">
              Active Works
            </h2>
            <div className="space-y-4">
              {activeWorks.length > 0 ? (
                activeWorks.map((act) => (
                  <div
                    key={act.id}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="w-12 h-12 bg-[#084556] bg-opacity-10 rounded-full flex justify-center items-center">
                          <User size={32} className="text-[#084556]" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-4">
                            <span className="text-xl font-medium text-[#084556]">
                              {act.fullname}
                            </span>
                            <span className="text-lg text-gray-500">
                              {act.nim}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 text-gray-600 mt-2">
                            <MapPin size={18} />
                            <span>{act.address}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-gray-600 mt-2">
                            <Phone size={18} />
                            <span>{act.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => openModal(act)}
                          className="p-2 hover:bg-[#084556] hover:bg-opacity-10 rounded-lg transition-colors"
                        >
                          <Info size={24} className="text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleAccept(act)}
                          className="p-2 hover:bg-[#084556] hover:bg-opacity-10 rounded-lg transition-colors"
                        >
                          <CheckCircle size={24} className="text-green-500" />
                        </button>
                        <button
                          onClick={() => handleReject(act.id)}
                          className="p-2 hover:bg-[#084556] hover:bg-opacity-10 rounded-lg transition-colors"
                        >
                          <X size={24} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No active bookings available.
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-[#F3E2CE] bg-opacity-90 rounded-xl shadow-lg p-6">
              <h2 className="text-3xl font-bold mb-6 text-[#084556] text-center">
                History
              </h2>

              <div className="bg-white rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#084556] text-white">
                      <th className="py-4 px-6 text-left text-xl">Date</th>
                      <th className="py-4 px-6 text-left text-xl">Name</th>
                      <th className="py-4 px-6 text-left text-xl">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {historyData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3 text-lg">
                            <Calendar size={20} className="text-gray-400" />
                            {moment(item.date).format("DD MMM YYYY")}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3 text-lg">
                            <User size={20} className="text-gray-400" />
                            {item.fullname}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-4 py-2 rounded-full text-lg font-medium ${
                              item.status === "complete"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {historyData.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-xl">
                    No history available
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#F3E2CE] bg-opacity-90 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 text-[#084556]">
                Current Activity
              </h2>
              <div className="space-y-4">
                {activity.length > 0 ? (
                  activity.map((act) => (
                    <div
                      key={act.id}
                      className="bg-[#084556] rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex justify-center items-center">
                          <User size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-medium text-white mb-2">
                            {act.fullname}
                          </h3>
                          <div className="space-y-2 text-gray-300">
                            <p className="flex items-center gap-2">
                              <User size={16} />
                              {act.nim}
                            </p>
                            <p className="flex items-center gap-2">
                              <MapPin size={16} />
                              {act.address}
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone size={18} />
                              {act.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No active activities.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accept Modal */}
      <AcceptModal
        isOpen={isAcceptModalOpen}
        onClose={closeAcceptModal}
        booking={acceptedBooking}
      />
    </>
  );
};

export default HomeAngel;
