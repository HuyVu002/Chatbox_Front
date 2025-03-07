import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./components/ConnectFireBase/firebaseClient";
import Auth from "./components/Login_Logout/Auth";
import ChatApp from "./components/ChatApp";
import { onAuthStateChanged } from "firebase/auth";
import Zalo_Main from "./components/Zalochat/Zalochat";
import Update_Infor from "./components/Update/Update_Infor";


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
        <Route path="/chat_main" element={<Zalo_Main />} />
        {/* Nếu đăng nhập rồi thì vào chat, nếu chưa thì về đăng nhập */}
        <Route path="/chat" element={user ? <ChatApp /> : <Navigate to="/" />} />
        <Route path="/update_infor" element={user ? <Update_Infor /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;