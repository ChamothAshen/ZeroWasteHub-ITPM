import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import ProfileSidebar from "../components/ProfileSidebar";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";

const ProfileUI = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user) || {};

  // State
  const [username, setUsername] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(currentUser?.profilePicture || "/default-avatar.png");
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  
  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success"); // "success" or "error"

  // Handle file selection and upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    setImageLoading(true);

    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        showPopupMessage("Could not upload image (File must be less than 2MB)", "error");
        setImageFileUploadProgress(null);
        setImageFileUploading(false);
        setImageLoading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Update the profile pic state immediately
          setProfilePic(downloadURL);
          
          // Update form data with the new URL
          setFormData((prev) => ({ ...prev, profilePicture: downloadURL }));
          
          // Add a small delay before hiding the progress indicator
          setTimeout(() => {
            setImageFileUploadProgress(null);
            setImageFileUploading(false);
            setImageLoading(false);
            showPopupMessage("Image uploaded successfully", "success");
          }, 800); // 800ms delay to ensure the image has time to load
        } catch (error) {
          showPopupMessage("Error retrieving uploaded image URL", "error");
          setImageFileUploading(false);
          setImageLoading(false);
        }
      }
    );
  };

  // Handle image load complete
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (id === "username") setUsername(value);
    if (id === "email") setEmail(value);
    if (id === "password") setPassword(value);
  };

  // Show popup message function
  const showPopupMessage = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(formData).length === 0) {
      showPopupMessage("No changes made", "error");
      return;
    }

    if (imageFileUploading) {
      showPopupMessage("Please wait for the image to upload", "error");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        showPopupMessage(data.message, "error");
      } else {
        dispatch(updateSuccess(data));
        showPopupMessage("Profile updated successfully", "success");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      showPopupMessage(error.message, "error");
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          dispatch(deleteUserFailure(data.message));
          showPopupMessage(data.message, "error");
        } else {
          dispatch(deleteUserSuccess(data));
          showPopupMessage("Account deleted successfully", "success");
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
        showPopupMessage(error.message, "error");
      }
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        showPopupMessage(data.message, "error");
      } else {
        dispatch(signoutSuccess());
        showPopupMessage("Signed out successfully", "success");
        setTimeout(() => {
          navigate("/signin");
        }, 1500);
      }
    } catch (error) {
      showPopupMessage(error.message, "error");
    }
  };

  // Effect to ensure Redux state reflects the current profile pic
  useEffect(() => {
    if (profilePic !== currentUser?.profilePicture && profilePic !== "/default-avatar.png") {
      setFormData((prev) => ({ ...prev, profilePicture: profilePic }));
    }
  }, [profilePic, currentUser]);

  return (
    <div className="flex">
      <ProfileSidebar currentUser={currentUser} />
      <div className="flex-1 flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 relative">
        {/* Popup Message */}
        {showPopup && (
          <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 transition-all duration-300 ${
            popupType === "success" ? "bg-green-100 border-l-4 border-green-500 text-green-700" : "bg-red-100 border-l-4 border-red-500 text-red-700"
          }`}>
            <div className="flex items-center">
              {popupType === "success" ? (
                <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <p className="font-medium">{popupMessage}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 mx-4 border border-green-100">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl font-bold text-green-800 mb-6">Your Profile</h1>
            <div className="relative mb-6">
              <div className="w-28 h-28 rounded-full border-4 border-green-200 overflow-hidden bg-gray-300 relative shadow-md">
                {(imageFileUploadProgress || imageLoading) && (
                  <CircularProgressbar
                    value={imageFileUploadProgress || 0}
                    text={`${imageFileUploadProgress}%`}
                    strokeWidth={5}
                    styles={{
                      path: { stroke: '#10B981' },
                      text: { fill: '#10B981', fontSize: '24px' },
                      root: { position: 'absolute', width: '100%', height: '100%', zIndex: 10 }
                    }}
                  />
                )}
                <img
                  key={profilePic} // Force re-render when URL changes
                  src={profilePic}
                  alt="Profile"
                  onLoad={handleImageLoad}
                  className={`w-full h-full object-cover ${
                    (imageFileUploadProgress && imageFileUploadProgress < 100) || imageLoading ? "opacity-60" : ""
                  }`}
                />
              </div>
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-green-50 transition">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </label>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input 
                type="text" 
                id="username" 
                value={username} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition" 
                placeholder="Username"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition" 
                placeholder="Email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition" 
                placeholder="Update password (leave empty to keep current)"
              />
            </div>

            <button 
              type="submit" 
              disabled={imageFileUploading}
              className={`w-full py-3 ${imageFileUploading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white font-medium rounded-lg transition shadow-md flex justify-center items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {imageFileUploading ? "Uploading Image..." : "Update Profile"}
            </button>

            <div className="flex gap-4 mt-6">
              <Link 
                to="#"
                onClick={handleDeleteUser}
                className="flex-1 py-3 bg-white text-red-600 border border-red-500 font-medium rounded-lg hover:bg-red-50 transition shadow-md flex justify-center items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Account
              </Link>
              
              <Link 
                to="#"
                onClick={handleSignout} 
                className="flex-1 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition shadow-md flex justify-center items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileUI;