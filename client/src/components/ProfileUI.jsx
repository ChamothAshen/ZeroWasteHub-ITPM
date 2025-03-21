import React, { useState, useEffect } from "react";
import ProfileSidebar from "../components/ProfileSidebar";
import { useSelector } from "react-redux";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";  // Ensure this file is correctly configured
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ProfileUI = () => {
  // Get user details from Redux state safely
  const { currentUser } = useSelector((state) => state.user) || {};
  
  // State for user info
  const [username, setUsername] = useState(currentUser?.username || "Guest");
  const [email, setEmail] = useState(currentUser?.email || "example@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [profilePic, setProfilePic] = useState(currentUser?.profilePicture || "/default-avatar.png");

  // State for image upload
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);

  // Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  // Upload image when selected
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  // Image upload function
  const uploadImage = async () => {
    if (!imageFile) return;
    
    setImageFileUploading(true);
    setImageFileUploadError(null);

    try {
      const storage = getStorage(app);
      const fileName = `${new Date().getTime()}_${imageFile.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageFileUploadError("Could not upload image (File must be less than 2MB)");
          setImageFileUploadProgress(null);
          setImageFile(null);
          setImageFileUrl(null);
          setImageFileUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setProfilePic(downloadURL);
            setImageFileUploading(false);
          });
        }
      );
    } catch (error) {
      console.error("Upload failed:", error);
      setImageFileUploadError("Upload failed. Try again.");
      setImageFileUploading(false);
    }
  };

  return (
    <div className="flex">
      <ProfileSidebar currentUser={currentUser} />
      <div className="flex-1 flex justify-center items-center min-h-screen bg-green-50">
        <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 mx-4">
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-2xl font-bold text-green-800 mb-4">Profile</h1>
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full border-4 border-green-200 overflow-hidden bg-gray-300 relative">
                {imageFileUploadProgress && (
                  <CircularProgressbar
                    value={imageFileUploadProgress || 0}
                    text={`${imageFileUploadProgress}%`}
                    strokeWidth={5}
                    styles={{
                      root: {
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      },
                      path: {
                        stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                      },
                    }}
                  />
                )}

                <img
                  src={imageFileUrl || profilePic}
                  alt="Profile"
                  className={`w-full h-full object-cover ${
                    imageFileUploadProgress && imageFileUploadProgress < 100 ? "opacity-60" : ""
                  }`}
                />
              </div>

              <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-green-800"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-green-800"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-green-800"
            />

            {imageFileUploading && <p className="text-sm text-green-600">Uploading: {imageFileUploadProgress}%</p>}
            {imageFileUploadError && <p className="text-sm text-red-500">{imageFileUploadError}</p>}

            <button className="w-full py-3 bg-gradient-to-r from-green-500 to-green-400 text-white font-medium rounded-md hover:opacity-90 transition duration-300">
              Update
            </button>
            <div className="flex justify-between mt-4 text-sm">
              <button className="text-red-500 font-medium">Delete Account</button>
              <button className="text-green-600 font-medium">Sign out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUI;
