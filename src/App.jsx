import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { FaAddressBook, FaCog } from "react-icons/fa";

const contacts = [
  { id: 1, name: "Nguyễn Văn A", avatar: "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/09/hinh-anh-dong-52.jpg" },
  { id: 2, name: "Trần Thị B", avatar: "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/09/hinh-anh-dong-52.jpg" },
  { id: 3, name: "Lê Văn C", avatar: "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/09/hinh-anh-dong-52.jpg" }
];

function App() {
  const [selectedChat, setSelectedChat] = useState(() => {
    const savedChat = JSON.parse(localStorage.getItem("selectedChat"));
    return savedChat || contacts[0];
  });
  const [avatar, setAvatar] = useState("https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/09/hinh-anh-dong-52.jpg");
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState(() => {
    return JSON.parse(localStorage.getItem("messages")) || {};
  });
  const [inputMessage, setInputMessage] = useState("");
  const settingsRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("selectedChat", JSON.stringify(selectedChat));
  }, [selectedChat]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = () => {
    if (inputMessage.trim() === "") return;
    const newMessages = {
      ...messages,
      [selectedChat.id]: [...(messages[selectedChat.id] || []), { text: inputMessage, sender: "me" }]
    };
    setMessages(newMessages);
    setInputMessage("");
  };

  return (
    <div className="full-screen-container d-flex">
      {/* Sidebar (30%) */}
      <div className="d-flex" style={{ width: "30%", height: "100vh" }}>
        {/* Taskbar */}
        <div className="taskbar d-flex flex-column align-items-center p-4 bg-primary text-white position-relative" style={{ width: "55px", height: "100vh" }}>
          <label htmlFor="avatarInput">
            <img src={avatar} className="rounded-circle me-2" width="50" height="40px" alt="Avatar" style={{ cursor: "pointer" }} />
          </label>
          <input type="file" id="avatarInput" style={{ display: "none" }} accept="image/*" onChange={handleAvatarChange} />
          <button className="btn text-white mt-3 mb-3">
            <FaAddressBook size={24} />
          </button>
          <button className="btn text-white position-relative" onClick={() => setShowSettings(!showSettings)}>
            <FaCog size={24} />
          </button>
          {showSettings && (
            <div ref={settingsRef} className="settings-menu position-absolute bg-white text-dark p-2 rounded shadow" style={{ top: "calc(100% + 5px)", left: "50%", transform: "translateX(-50%)", minWidth: "140px", zIndex: 10 }}>
              <p className="mb-2 m-0 p-2 bg-light rounded">Thông tin tài khoản</p>
              <p className="mb-0 m-0 p-2 bg-light rounded">Đăng xuất</p>
            </div>
          )}
        </div>
        {/* Contacts List */}
        <div className="contacts-list overflow-auto flex-grow-1 bg-light" style={{ width: "calc(100% - 60px)", height: "100vh" }}>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`contact-item d-flex align-items-center p-2 border-bottom ${selectedChat.id === contact.id ? "bg-lightblue" : ""}`}
              onClick={() => setSelectedChat(contact)}
              style={{ cursor: "pointer", backgroundColor: selectedChat.id === contact.id ? "#d0e8ff" : "transparent" }}
            >
              <img src={contact.avatar} className="rounded-circle me-2" width="50" height="40px" alt={contact.name} />
              <div>
                <strong>{contact.name}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Chat Window (70%) */}
      <div className="chat-window flex-grow-1 d-flex flex-column bg-white p-3" style={{ width: "70%" }}>
        <h5>{selectedChat.name}</h5>
        <div className="chat-content flex-grow-1 p-2 border rounded mt-2" style={{ minHeight: "300px", overflowY: "auto" }}>
          {(messages[selectedChat.id] || []).map((msg, index) => (
            <div key={index} className={`p-2 my-1 rounded ${msg.sender === "me" ? "bg-primary text-white ms-auto" : "bg-light"}`} style={{ maxWidth: "70%", alignSelf: msg.sender === "me" ? "flex-end" : "flex-start" }}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="d-flex mt-3">
          <input type="text" className="form-control" placeholder="Nhập tin nhắn..." value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
          <button className="btn btn-primary ms-2" onClick={sendMessage}>Gửi</button>
        </div>
      </div>
    </div>
  );
}

export default App;
