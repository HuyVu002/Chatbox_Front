import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./components/firebaseClient";
import Auth from "./components/Auth";
import ChatApp from "./components/ChatApp";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Mặc định vào sẽ là trang đăng nhập/đăng ký */}
        <Route path="/" element={<Auth />} />
        {/* Nếu đăng nhập rồi thì vào chat, nếu chưa thì về đăng nhập */}
        <Route path="/chat" element={user ? <ChatApp /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;