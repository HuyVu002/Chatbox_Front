import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { get, child } from "firebase/database";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import "../ConnectFireBase/firebaseClient";

function Auth() {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getDatabase();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
  
    if (!isLogin && password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      setLoading(false);
      return;
    }
  
    try {
      if (isLogin) {
        // Kiểm tra email có tồn tại trong Firebase Database không
        const usersRef = ref(db, "users");
        const snapshot = await get(usersRef);
  
        if (!snapshot.exists()) {
          setError("Email chưa được đăng ký.");
          setLoading(false);
          return;
        }
  
        const usersData = snapshot.val();
        const userEntry = Object.values(usersData).find((user) => user.email === email);
  
        if (!userEntry) {
          setError("Email chưa được đăng ký.");
          setLoading(false);
          return;
        }
  
        // Tiến hành đăng nhập với Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        if (!userCredential.user.emailVerified) {
          setError("Bạn cần xác thực email trước khi đăng nhập.");
          setLoading(false);
          return;
        }
  
        navigate("/chat");
  
      } else {
        // Kiểm tra xem email đã tồn tại chưa trước khi đăng ký
        const usersRef = ref(db, "users");
        const snapshot = await get(usersRef);
  
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const emailExists = Object.values(usersData).some((user) => user.email === email);
  
          if (emailExists) {
            setError("Email đã được sử dụng. Vui lòng chọn email khác.");
            setLoading(false);
            return;
          }
        }
  
        // Tạo tài khoản nếu chưa tồn tại
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
  
        // Lưu thông tin user vào Firebase Realtime Database
        await set(ref(db, `users/${userCredential.user.uid}`), {
          email: email,
          displayName: nickname,
          createdAt: new Date().toISOString(),
          listfriend: "null",
          add_friend: "null"
        });
  
        setMessage("🎉 Vui lòng kiểm tra email để xác thực tài khoản.");
        setIsLogin(true);
      }
    }catch (err) {
      console.log("Firebase Error:", err.code, err.message); 
    
      if (err.code === "auth/user-not-found") {
        setError("Email chưa được đăng ký.");
      }else if (err.code === "auth/invalid-credential") {
        setError("Tài khoản hoặc mật khẩu không đúng.");
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="auth-container d-flex justify-content-center bg-primary-subtle align-items-center vh-100">
      <div className="auth-box p-5 rounded shadow bg-white text-center" style={{ width: "500px", height: "550px" }}>
        <h2 className="text-primary">Zalo</h2>
        <p className="text-muted">{isLogin ? "Đăng nhập" : "Đăng ký"} tài khoản Zalo</p>
        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleAuth}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>
        <p className="mt-3">
          {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <span
            className="text-primary cursor-pointer"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setMessage("");
            }}
          >
            {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;
