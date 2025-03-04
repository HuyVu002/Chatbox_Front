import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import supabase from "./components/supabaseClient";
import Auth from "./components/Auth";
import ChatApp from "./components/ChatApp";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Mặc định vào sẽ là trang đăng nhập/đăng ký */}
        <Route path="/" element={<Auth />} />
        {/* Nếu đăng nhập rồi thì vào chat, nếu chưa thì về đăng nhập */}
        <Route path="/chat" element={session ? <ChatApp /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
