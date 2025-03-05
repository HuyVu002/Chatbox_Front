import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import "./firebaseClient"; // Đảm bảo Firebase đã được khởi tạo

function Auth() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          setError("Bạn cần xác thực email trước khi đăng nhập.");
          return;
        }
        navigate("/chat");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        setMessage("🎉 Chúc mừng! Vui lòng kiểm tra email để xác thực tài khoản.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container d-flex justify-content-center bg-primary-subtle align-items-center vh-100">
      <div className="auth-box p-5 rounded shadow bg-white text-center" style={{ width: "500px", height: "500px" }}>
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
