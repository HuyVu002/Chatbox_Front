import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("📩 Email đặt lại mật khẩu đã được gửi. Kiểm tra hộp thư đến!");
    } catch (error) {
      setError("❌ Email không hợp lệ hoặc chưa đăng ký.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container d-flex justify-content-center bg-primary-subtle align-items-center vh-100">
      <div className="auth-box p-5 rounded shadow bg-white text-center" style={{ width: "500px", height: "550px" }}>
        <h2 className="text-primary">Zalo</h2>
        <p className="text-muted">Quên mật khẩu</p>
        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}

        <form onSubmit={handleResetPassword}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi yêu cầu đặt lại mật khẩu"}
          </button>
        </form>

        <p className="mt-3">
          <span
            className="text-primary cursor-pointer"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Quay lại đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
