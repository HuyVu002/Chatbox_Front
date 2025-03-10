import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, update } from "firebase/database";
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
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  // Fetch user data from Realtime Database when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setEmail(userData.email);
          setAvatar(userData.photoURL || avatar);
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

  // Handle email update
  const handleUpdateEmail = async () => {
    if (newEmail.trim() === "") return;

    try {
      await update(ref(db, `users/${user.uid}`), { email: newEmail });
      setEmail(newEmail); // Update local state with new email
      alert("Email đã được cập nhật thành công!");
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  // Handle password update
  const handleUpdatePassword = async () => {
    if (newPassword.trim() === "" || currentPassword.trim() === "") return;

    try {
      const userRef = ref(db, `users/${user.uid}`);
      await update(ref(db, `users/${user.uid}`), { password: newPassword });
      alert("Mật khẩu đã được cập nhật thành công!");
      setEditingPassword(false);
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản không?")) {
      try {
        await update(ref(db, `users/${user.uid}`), { isDeleted: true });  // Soft delete the user in DB
        alert("Tài khoản đã bị xóa");
        navigate("/");
      } catch (error) {
        alert("Lỗi: " + error.message);
      }
    }
  };

  // Handle back to chat
  const handleBack = () => {
    navigate("/chat");
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

        {/* Email update */}
        <div className="mb-3">
          <label>Email mới:</label>
          <input
            type="email"
            className="form-control"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button className="btn btn-success mt-2 w-100" onClick={handleUpdateEmail}>Cập nhật email</button>
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
              <button className="btn btn-success mt-2 w-100" onClick={handleUpdatePassword}>Xác nhận thay đổi</button>
            </div>
            <button className="btn btn-secondary w-100" onClick={() => setEditingPassword(false)}>Hủy</button>
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
