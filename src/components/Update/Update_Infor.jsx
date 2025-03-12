import React, { useState, useEffect } from "react";
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth";
import { getDatabase, ref, get, update, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Update_Info() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const db = getDatabase();

  // States for user info
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/09/hinh-anh-dong-52.jpg");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirming password
  const [currentPassword, setCurrentPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(""); // New state for display name
  const [currentDisplayName, setCurrentDisplayName] = useState(""); // State for current display name
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false); // For toggling between display name edit mode

  // Fetch user data from Realtime Database when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setEmail(userData.email); // Email is fetched but not editable
          setAvatar(userData.photoURL || avatar); // Use existing avatar or default one
          setCurrentDisplayName(userData.displayName || "Tên hiển thị chưa có"); // Default to "Tên hiển thị chưa có" if not set
        } else {
          console.error("User data not found in the database");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, [db, user.uid, avatar]);

  // Handle avatar change
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Validate if the selected file is an image
    if (!file || !file.type.startsWith("image/")) {
      alert("Vui lòng chọn một tệp ảnh hợp lệ!");
      return;
    }

    await handleUpload(file);
  };

  // Handle image upload to Cloudinary
  const handleUpload = async (file) => {
    setIsUploading(true);
    const formDataToUpload = new FormData();
    formDataToUpload.append('file', file);
    formDataToUpload.append('upload_preset', 'coffe_shop');  // Replace with your Cloudinary preset

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dp1fm5pqd/image/upload', {
        method: 'POST',
        body: formDataToUpload,
      });

      if (!response.ok) {
        throw new Error("Lỗi khi tải ảnh lên Cloudinary!");
      }

      const data = await response.json();
      if (data.secure_url) {
        setAvatar(data.secure_url);
        await update(ref(db, `users/${user.uid}`), { photoURL: data.secure_url });
        alert("Ảnh đại diện đã được cập nhật!");
      } else {
        alert("Không có URL nào được trả về từ Cloudinary!");
      }
    } catch (error) {
      console.error("Lỗi khi tải lên:", error);
      alert("Đã có lỗi xảy ra khi tải lên tệp.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle password update in Firebase Authentication (no password in DB)
  const handleUpdatePassword = async () => {
    if (newPassword.trim() === "" || confirmPassword.trim() === "" || currentPassword.trim() === "") {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới và mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      // Reauthenticate the user before updating the password in Firebase Authentication
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password in Firebase Authentication
      await updatePassword(user, newPassword);

      alert("Mật khẩu đã được cập nhật thành công!");
      setEditingPassword(false); // Hide password edit form
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        alert("Mật khẩu hiện tại không đúng! Vui lòng nhập lại.");
      } else {
        alert("Lỗi: " + error.message);
      }
    }
  };

  // Handle display name update
  const handleUpdateDisplayName = async () => {
    if (newDisplayName.trim() === "") return;

    try {
      // Update the display name in Firebase Realtime Database
      await update(ref(db, `users/${user.uid}`), { displayName: newDisplayName });

      // Update the display name locally
      setCurrentDisplayName(newDisplayName);
      alert("Tên hiển thị đã được cập nhật thành công!");
      setNewDisplayName(""); // Clear input field after update
      setIsEditingDisplayName(false); // Exit edit mode
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  // Handle account deletion (remove user data and authentication)
  const handleDeleteAccount = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản không?")) {
      try {
        // Remove user data from Realtime Database
        await remove(ref(db, `users/${user.uid}`));

        // Delete the user from Firebase Authentication
        await deleteUser(user);

        alert("Tài khoản đã bị xóa");
        navigate("/"); // Redirect to home or login page
      } catch (error) {
        alert("Lỗi: " + error.message);
      }
    }
  };

  // Handle back to chat_main
  const handleBack = () => {
    navigate("/chat_main"); // Navigate to the /chat_main route
  };

  return (
    <div className="modal-overlay d-flex justify-content-center align-items-center">
      <div className="modal-content bg-white p-4 rounded shadow" style={{ width: "400px" }}>
        <h2 className="text-center">Thông tin tài khoản</h2>

        {/* Avatar */}
        <div className="mb-3 text-center">
          <img src={avatar} alt="Avatar" className="rounded-circle" width="100" height="100" />
        </div>

        {/* Email */}
        <p className="text-center"><strong>Email:</strong> {email}</p>

        {/* Avatar upload input */}
        <div className="mb-3 text-center">
          <label htmlFor="avatarInput" className="form-label">Thay đổi ảnh đại diện:</label>
          <input
            type="file"
            id="avatarInput"
            className="form-control mt-2"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={isUploading}  // Disable while uploading
          />
        </div>

        {/* Display name */}
        <div className="mb-3">
          <label><strong>Tên hiển thị:</strong></label>
          <p>{currentDisplayName}</p>
          
          {/* Button to edit display name */}
          {!isEditingDisplayName ? (
            <button className="btn btn-primary w-100 mt-2" onClick={() => setIsEditingDisplayName(true)}>
              Thay đổi tên hiển thị
            </button>
          ) : (
            <div>
              <input
                type="text"
                className="form-control"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                placeholder="Nhập tên hiển thị mới"
              />
              <button className="btn btn-success mt-2 w-100" onClick={handleUpdateDisplayName}>Cập nhật tên hiển thị</button>
              <button className="btn btn-secondary mt-2 w-100" onClick={() => setIsEditingDisplayName(false)}>Hủy</button>
            </div>
          )}
        </div>

        {/* Change password button */}
        {!editingPassword ? (
          <button className="btn btn-warning w-100" onClick={() => setEditingPassword(true)}>Thay đổi mật khẩu</button>
        ) : (
          <div>
            <div className="mb-3">
              <label>Mật khẩu hiện tại:</label>
              <input
                type="password"
                className="form-control"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Mật khẩu mới:</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Xác nhận mật khẩu mới:</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-success mt-2 w-100" onClick={handleUpdatePassword}>Xác nhận thay đổi</button>
            <button className="btn btn-secondary w-100 mt-2" onClick={() => setEditingPassword(false)}>Hủy</button>
          </div>
        )}

        {/* Delete account button */}
        <button className="btn btn-danger w-100 mt-2" onClick={handleDeleteAccount}>Xóa tài khoản</button>

        {/* Back to chat button */}
        <button className="btn btn-secondary w-100 mt-2" onClick={handleBack}>Quay lại</button>
      </div>
    </div>
  );
}

export default Update_Info;
