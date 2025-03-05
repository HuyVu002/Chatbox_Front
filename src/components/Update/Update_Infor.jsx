import React, { useState } from "react";
import { getAuth, updatePassword, deleteUser } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Update_Info({ onClose }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const storage = getStorage();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState("");
  const [avatar, setAvatar] = useState(user?.photoURL || "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/09/hinh-anh-dong-52.jpg");
  const [isEditing, setIsEditing] = useState(false);
  
  const handlePasswordChange = async () => {
    if (newPassword.trim() === "") return;
    try {
      await updatePassword(user, newPassword);
      alert("Mật khẩu đã được thay đổi thành công!");
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };
  
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setAvatar(downloadURL);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản không?")) {
      try {
        await deleteUser(user);
        alert("Tài khoản đã bị xóa");
        navigate("/");
      } catch (error) {
        alert("Lỗi: " + error.message);
      }
    }
  };

  return (
    <div className="modal-overlay d-flex justify-content-center align-items-center">
      <div className="modal-content bg-white p-4 rounded shadow" style={{ width: "400px" }}>
        <h2 className="text-center">Thông tin tài khoản</h2>
        <div className="mb-3 text-center">
          <img src={avatar} alt="Avatar" className="rounded-circle" width="100" height="100" />
        </div>
        <p className="text-center"><strong>Email:</strong> {user?.email}</p>
        {!isEditing ? (
          <>
            <button className="btn btn-primary w-100 mt-2" onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
            <button className="btn btn-secondary w-100 mt-2" onClick={onClose}>Quay lại</button>
          </>
        ) : (
          <>
            <div className="mb-3 text-center">
              <label htmlFor="avatarInput">Thay đổi ảnh đại diện:</label>
              <input type="file" id="avatarInput" className="form-control mt-2" accept="image/*" onChange={handleAvatarChange} />
            </div>
            <div className="mb-3">
              <label>Mật khẩu mới:</label>
              <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <button className="btn btn-warning mt-2 w-100" onClick={handlePasswordChange}>Đổi mật khẩu</button>
            </div>
            <button className="btn btn-danger w-100" onClick={handleDeleteAccount}>Xóa tài khoản</button>
            <button className="btn btn-secondary w-100 mt-2" onClick={() => setIsEditing(false)}>Quay lại</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Update_Info;
