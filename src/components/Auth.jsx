import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import supabase from "./supabaseClient";

function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Thêm nhập lại mật khẩu
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Nếu đang đăng ký, kiểm tra mật khẩu nhập lại
    if (!isLogin && password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      setLoading(false);
      return;
    }

    try {
      let response;
      if (isLogin) {
        // Xử lý đăng nhập
        response = await supabase.auth.signInWithPassword({ email, password });
        if (response.error) {
          setError(response.error.message);
        } else {
          navigate("/chat"); // Chuyển sang trang chat nếu đăng nhập thành công
        }
      } else {
        // Xử lý đăng ký
        response = await supabase.auth.signUp({ email, password });
        if (response.error) {
          setError(response.error.message);
        } else {
          setMessage("🎉 Chúc mừng! Đăng ký thành công. Vui lòng kiểm tra email.");
          setIsLogin(true); // Quay lại trạng thái đăng nhập
        }
      }
    } catch (err) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại!");
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
