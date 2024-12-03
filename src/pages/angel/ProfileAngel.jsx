import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { UserCircle, Camera } from "lucide-react";
import NavbarAngel from "../../components/NavbarAngel";
import { toast } from "react-hot-toast";

const ProfileAngel = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "", // Tidak akan ditampilkan atau diubah langsung dari UI
    fullname: "",
    phone: "",
    nim: "",
    workHours: "",
    price: "",
    image: "", // Menyimpan nama file gambar
  });
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);

  const auth = getAuth();
  const db = getFirestore();

  // Ambil data pengguna saat komponen dimuat
  useEffect(() => {
    if (auth.currentUser) {
      fetchUserData();
    }
  }, [auth.currentUser]);

  // Fungsi untuk mengambil data pengguna
  const fetchUserData = async () => {
    try {
      if (auth.currentUser) {
        const docRef = doc(db, "tidyangel", auth.currentUser.uid); // Mengambil data dari koleksi "users"
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data()); // Menyimpan data pengguna ke state
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    }
  };

  // Menghandle perubahan file gambar
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const preview = URL.createObjectURL(selectedFile);
      setPreviewURL(preview);
    }
  };

  // Menghandle submit untuk update data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let updateData = { ...userData };

    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        // Mengirim gambar ke server
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        const fileName = data.filePath.split("/").pop(); // Mendapatkan nama file gambar

        updateData = { ...updateData, image: fileName }; // Menambahkan nama gambar yang sudah diupload
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
      }
    }

    try {
      // Update data pengguna ke Firestore
      const userRef = doc(db, "tidyangel", auth.currentUser.uid); // Update data di koleksi "users"
      await updateDoc(userRef, updateData);

      // Memperbarui state dengan data terbaru
      setUserData(updateData);
      setIsEditing(false);
      setPreviewURL(null);
      setFile(null);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }

    setLoading(false);
  };

  // Menghandle cancel untuk membatalkan edit
  const handleCancel = () => {
    setIsEditing(false);
    setPreviewURL(null);
    fetchUserData(); // Reset data ke kondisi awal
  };

  return (
    <>
      <NavbarAngel />
      <div className="min-h-screen bg-[#074B5D] py-12 px-4">
        <div
          className="mt-20 max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <div className="bg-gradient-to-r from-[#065666] to-[#0E7490] p-8">
            <h1 className="text-3xl text-white font-bold text-center mb-6">
              My Profile
            </h1>
            <div className="flex justify-center">
              <div className="relative group">
                {previewURL || userData.image ? (
                  <img
                    src={
                      previewURL ||
                      `http://localhost:5000/images/${userData.image}`
                    }
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg transition-transform group-hover:scale-105"
                  />
                ) : (
                  <UserCircle className="w-40 h-40 text-white opacity-75" />
                )}
                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-white rounded-full p-3 cursor-pointer shadow-lg transition-all hover:bg-gray-100">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Camera className="w-6 h-6 text-[#0E7490]" />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={userData.fullname}
                    onChange={(e) =>
                      setUserData({ ...userData, fullname: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#0E7490] focus:ring-2 focus:ring-[#0E7490] focus:ring-opacity-20 transition-all disabled:bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    No. Telepon
                  </label>
                  <input
                    type="text"
                    value={userData.phone}
                    onChange={(e) =>
                      setUserData({ ...userData, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#0E7490] focus:ring-2 focus:ring-[#0E7490] focus:ring-opacity-20 transition-all disabled:bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    NIM
                  </label>
                  <input
                    type="text"
                    value={userData.nim}
                    onChange={(e) =>
                      setUserData({ ...userData, nim: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#0E7490] focus:ring-2 focus:ring-[#0E7490] focus:ring-opacity-20 transition-all disabled:bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    value={userData.username}
                    onChange={(e) =>
                      setUserData({ ...userData, username: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#0E7490] focus:ring-2 focus:ring-[#0E7490] focus:ring-opacity-20 transition-all disabled:bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Work Hours
                  </label>
                  <input
                    type="text"
                    value={userData.workHours}
                    onChange={(e) =>
                      setUserData({ ...userData, workHours: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#0E7490] focus:ring-2 focus:ring-[#0E7490] focus:ring-opacity-20 transition-all disabled:bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Price
                  </label>
                  <input
                    type="text"
                    value={userData.price}
                    onChange={(e) =>
                      setUserData({ ...userData, price: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#0E7490] focus:ring-2 focus:ring-[#0E7490] focus:ring-opacity-20 transition-all disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#065666] to-[#0E7490] text-white font-semibold rounded-lg shadow-md hover:from-[#0E7490] hover:to-[#065666] transition-all duration-300 transform hover:scale-105"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#065666] to-[#0E7490] text-white font-semibold rounded-lg shadow-md hover:from-[#0E7490] hover:to-[#065666] transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileAngel;
