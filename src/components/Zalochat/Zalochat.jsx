import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaSearch, FaUserPlus, FaUsers, FaRegEdit, FaTrash, FaPlus } from "react-icons/fa";
import { CiUser, CiVideoOn } from "react-icons/ci";
import { IoMdSearch } from "react-icons/io";
import { BsEmojiSmile, BsPaperclip } from "react-icons/bs";
import { MdSend } from "react-icons/md";
import { useState, useEffect } from "react";
import { Form, Button, Card, Image, ListGroup, Modal, InputGroup } from "react-bootstrap";
import io from "socket.io-client";
import { auth, db, storage } from '../ConnectFireBase/firebaseClient';
import { update, ref, get, push, set, onValue, off } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from '../Zalochat/Zalochat.module.css';

const socket = io("http://localhost:4000");

// Component hiển thị tin nhắn
function TinNhan({ id_user, content, time, imageUrl }) {
  const [userName, setUserName] = useState("Unknown");
  const [userAvatar, setUserAvatar] = useState("https://t3.ftcdn.net/jpg/05/47/85/88/360_F_547858830_cnWFvIG7SYsC2GLRDoojuZToysoUna4Y.jpg");

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (id_user) {
        const userRef = ref(db, `users/${id_user}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserName(userData.email || "Unknown");
          setUserAvatar(userData.avatar || "https://t3.ftcdn.net/jpg/05/47/85/88/360_F_547858830_cnWFvIG7SYsC2GLRDoojuZToysoUna4Y.jpg");
        }
      }
    };
    fetchUserInfo();
  }, [id_user]);

  const isMyMessage = id_user === auth.currentUser?.uid;

  return (
    <div className={`${styles.TinNhan_Conten} ${isMyMessage ? styles.minhGui : styles.nguoiKhac} ${isMyMessage ? styles.myMessage : ''}`}>
      <div className={styles.TinNhan_User}>
        <div className={styles.TinNhan_Conten_HinhANh}>
          <img src={userAvatar} alt="Avatar" />
        </div>
        <div className={styles.TinNhan_Conten_Conten}>
          <div className={styles.TinNhan_Conten_Conten_Ten}>{userName}</div>
          <div className={styles.TinNhan_Conten_Conten_Tin}>
            {content}
            {imageUrl && <img src={imageUrl} alt="Attached" style={{ maxWidth: "200px", marginTop: "10px" }} />}
          </div>
          <div className={styles.TinNhan_Conten_Conten_Gio}>{time}</div>
        </div>
      </div>
    </div>
  );
}

// Component header của nội dung trò chuyện
function Header_Conten({ groupName, memberCount, isAdmin, onEditGroup }) {
  return (
    <div className={styles.Header_Conten_Div}>
      <div className={styles.Header_Conten_ThongTin}>
        <div className={styles.Header_Conten_HinhANh}>
          <img src="https://cdn.pixabay.com/photo/2019/08/11/18/48/icon-4399681_1280.png" alt="Avatar" className={styles.avatar} />
        </div>
        <div className={styles.Header_Conten_ThongTin_Ten}>
          <div className={styles.Header_Conten_ThongTin_Ten_De}>
            <p>{groupName}</p>
          </div>
          <div className={styles.Header_Conten_ThongTin_ChuThich}>
            <p>Cộng đồng</p>
            <CiUser />
            <p>{memberCount} thành viên</p>
          </div>
        </div>
      </div>
      {isAdmin && (
        <div className={styles.Header_Conten_Div_ChucNang}>
          <FaRegEdit onClick={onEditGroup} />
          <CiVideoOn />
          <IoMdSearch />
        </div>
      )}
    </div>
  );
}

// Component hiển thị danh sách tin nhắn
function Chat_Conten({ groupId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!groupId) return;

    const messagesRef = ref(db, `groupChats/${groupId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesList = Object.entries(data).map(([key, msg]) => ({
          id: key,
          id_user: msg.senderId,
          content: msg.messageType === "text" ? msg.text : "",
          imageUrl: msg.imageUrl || null,
          time: new Date(msg.timestamp).toLocaleTimeString(),
        }));
        setMessages(messagesList);
      } else {
        setMessages([]);
      }
    });

    return () => off(messagesRef, "value", unsubscribe);
  }, [groupId]);

  return (
    <div className={styles.Chat_Conten}>
      {messages.map((msg) => (
        <TinNhan key={msg.id} id_user={msg.id_user} content={msg.content} time={msg.time} imageUrl={msg.imageUrl} />
      ))}
    </div>
  );
}

// Component gửi tin nhắn
function Gui_Conten({ groupId }) {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);

  const sendMessage = async () => {
    if (!message.trim() && !image) return;

    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) return;

    const messageData = {
      messageId: Date.now().toString(),
      messageType: image ? "image" : "text",
      senderId: currentUserId,
      timestamp: new Date().toISOString(),
      text: message,
      imageUrl: null,
    };

    if (image) {
      const storageReference = storageRef(storage, `chat_images/${groupId}/${Date.now()}_${image.name}`);
      await uploadBytes(storageReference, image);
      messageData.imageUrl = await getDownloadURL(storageReference);
    }

    const messagesRef = ref(db, `groupChats/${groupId}/messages/${messageData.messageId}`);
    await set(messagesRef, messageData);

    socket.emit("send_message", { room: groupId, ...messageData });

    setMessage("");
    setImage(null);
  };

  const handleImageUpload = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  return (
    <div className={styles.Gui_Conten}>
      <div className={styles.messageInputContainer}>
        <button className={styles.iconButton}><BsEmojiSmile /></button>
        <label htmlFor="file-upload" className={styles.iconButton}><BsPaperclip /></label>
        <input id="file-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
        <input
          type="text"
          className={styles.inputField}
          placeholder="Nhập tin nhắn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage} className={styles.iconButton}><MdSend /></button>
      </div>
    </div>
  );
}

// Component chính của nội dung trò chuyện
function Conten({ groupId }) {
  const [groupName, setGroupName] = useState("Default Group");
  const [memberCount, setMemberCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  useEffect(() => {
    if (!groupId) return;

    const groupRef = ref(db, `groupChats/${groupId}`);
    const unsubscribe = onValue(groupRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGroupName(data.groupName || "Default Group");
        setMemberCount(Object.keys(data.members || {}).length);
        setIsAdmin(data.members && data.members[auth.currentUser?.uid] === "admin");
      }
    });

    return () => off(groupRef, "value", unsubscribe);
  }, [groupId]);

  const handleEditGroup = () => setShowEditModal(true);
  const saveGroupName = async () => {
    if (newGroupName && isAdmin) {
      await update(ref(db, `groupChats/${groupId}`), { groupName: newGroupName });
      setShowEditModal(false);
      setNewGroupName("");
    }
  };

  return (
    <Row className={styles.ConTen_Div}>
      <Col className={`${styles.ConTen_Head} bg-white p-0`}>
        <Header_Conten groupName={groupName} memberCount={memberCount} isAdmin={isAdmin} onEditGroup={handleEditGroup} />
      </Col>
      <Col className={`${styles.ConTen_chat} p-0`}>
        <Chat_Conten groupId={groupId} />
      </Col>
      <Col className={`${styles.ConTen_GuiTin} ${styles.GuiTin} bg-white p-0`}>
        <Gui_Conten groupId={groupId} />
      </Col>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa nhóm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Nhập tên nhóm mới..."
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={saveGroupName}>Lưu</Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
}

// Component form tạo nhóm
function FromTaoNhom({ show, onHide }) {
  const [users, setUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toggleUserSelection = (id) => {
    setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]));
  };

  const Call_DanhSachBanBe = async (user_id) => {
    if (!auth.currentUser) return [];
    const link_banbe = ref(db, `users/${user_id}/listfriend`);
    const snapshot = await get(link_banbe);
    return snapshot.exists() ? snapshot.val() || [] : [];
  };

  const getUserEmails = async (friendIDs) => {
    const friendDetails = await Promise.all(
      friendIDs.map(async (friendID) => {
        const userRef = ref(db, `users/${friendID}`);
        const snapshot = await get(userRef);
        return snapshot.exists() ? { id: friendID, email: snapshot.val().email } : null;
      })
    );
    return friendDetails.filter((friend) => friend !== null);
  };

  useEffect(() => {
    const fetchFriends = async () => {
      if (auth.currentUser) {
        const friendIDs = await Call_DanhSachBanBe(auth.currentUser.uid);
        const friendDetails = await getUserEmails(friendIDs);
        setUsers(friendDetails);
      }
    };
    fetchFriends();
  }, []);

  const createGroup = async () => {
    if (!auth.currentUser || !groupName || selectedUsers.length === 0) {
      alert("Vui lòng nhập tên nhóm và chọn ít nhất một thành viên!");
      return;
    }

    try {
      const groupChatsRef = ref(db, "groupChats");
      const newGroupRef = push(groupChatsRef);
      const groupId = newGroupRef.key;

      const groupData = {
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser.uid,
        groupName,
        members: {
          [auth.currentUser.uid]: "admin",
          ...selectedUsers.reduce((acc, userId) => ({ ...acc, [userId]: "member" }), {}),
        },
        messages: {},
      };

      // Update groupChats
      await set(newGroupRef, groupData);

      // Update userGroups for the creator and selected members
      const userGroupUpdates = {
        [`userGroups/${auth.currentUser.uid}/${groupId}`]: { role: "admin" },
        ...selectedUsers.reduce((acc, userId) => ({
          ...acc,
          [`userGroups/${userId}/${groupId}`]: { role: "member" },
        }), {}),
      };
      await update(ref(db), userGroupUpdates);

      alert(`Nhóm ${groupName} đã được tạo thành công!`);
      onHide();
      setGroupName("");
      setSelectedUsers([]);
    } catch (error) {
      console.error("Lỗi khi tạo nhóm:", error);
      alert("Có lỗi xảy ra khi tạo nhóm!");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Tạo Nhóm Mới</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Tên Nhóm</Form.Label>
          <InputGroup>
            <InputGroup.Text><FaUsers /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Nhập tên nhóm..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="rounded-end"
            />
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Tìm Kiếm Bạn Bè</Form.Label>
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm bạn bè..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-end"
            />
          </InputGroup>
        </Form.Group>
        <ListGroup style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "5px" }}>
          {users.length > 0 ? (
            users
              .filter((user) => user.email.toLowerCase().includes(search.toLowerCase()))
              .map((user) => (
                <ListGroup.Item
                  key={user.id}
                  className="d-flex align-items-center p-3"
                  style={{ borderBottom: "1px solid #eee", cursor: "pointer", backgroundColor: selectedUsers.includes(user.id) ? "#e9f7ff" : "white" }}
                  onClick={() => toggleUserSelection(user.id)}
                >
                  <Form.Check
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    className="me-3"
                  />
                  <span>{user.email}</span>
                </ListGroup.Item>
              ))
          ) : (
            <ListGroup.Item className="text-center text-muted p-3">Không có bạn bè để hiển thị.</ListGroup.Item>
          )}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Hủy</Button>
        <Button variant="primary" disabled={selectedUsers.length === 0 || !groupName} onClick={createGroup}>Tạo Nhóm</Button>
      </Modal.Footer>
    </Modal>
  );
}

// Component form kết bạn
function From_KetBan({ show, onHide }) {
  const [users, setUsers] = useState({});
  const [search, setSearch] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);

  const getFriendRequests = async (userId) => {
    const userRef = ref(db, `users/${userId}/add_friend`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const friendList = snapshot.val() || [];
      const friendDetails = await Promise.all(
        friendList.map(async (friendID) => {
          const friendRef = ref(db, `users/${friendID}`);
          const friendSnapshot = await get(friendRef);
          return friendSnapshot.exists() ? { id: friendID, email: friendSnapshot.val().email } : null;
        })
      );
      return friendDetails.filter((friend) => friend !== null);
    }
    return [];
  };

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (auth.currentUser) {
        const requests = await getFriendRequests(auth.currentUser.uid);
        setFriendRequests(requests);
      }
    };
    fetchFriendRequests();
  }, []);

  const sendFriendRequest = async (userId) => {
    if (!auth.currentUser) return;

    const currentUserID = auth.currentUser.uid;
    const userRef = ref(db, `users/${userId}/add_friend`);
    const snapshot = await get(userRef);
    let currentFriends = snapshot.exists() ? snapshot.val() : [];

    if (!Array.isArray(currentFriends)) currentFriends = [];
    if (!currentFriends.includes(currentUserID)) {
      currentFriends.push(currentUserID);
      await update(ref(db, `users/${userId}`), { add_friend: currentFriends });
      alert("Đã gửi lời mời kết bạn!");
    } else {
      alert("Bạn đã gửi lời mời kết bạn trước đó!");
    }
  };

  const acceptFriendRequest = async (userId) => {
    if (!auth.currentUser) return;

    const currentUserID = auth.currentUser.uid;
    const link_add_friend = ref(db, `users/${currentUserID}/add_friend`);
    const link_list_Friend = ref(db, `users/${currentUserID}/listfriend`);
    const friend_list_Friend = ref(db, `users/${userId}/listfriend`);

    const addFriendSnapshot = await get(link_add_friend);
    let addFriendList = addFriendSnapshot.exists() ? addFriendSnapshot.val() : [];
    if (!Array.isArray(addFriendList)) addFriendList = [];
    if (addFriendList.includes(userId)) {
      const updatedAddFriendList = addFriendList.filter((id) => id !== userId);
      await update(ref(db, `users/${currentUserID}`), { add_friend: updatedAddFriendList });
    }

    const listFriendSnapshot = await get(link_list_Friend);
    let listFriend = listFriendSnapshot.exists() ? listFriendSnapshot.val() : [];
    if (!Array.isArray(listFriend)) listFriend = [];
    if (!listFriend.includes(userId)) {
      listFriend.push(userId);
      await update(ref(db, `users/${currentUserID}`), { listfriend: listFriend });
    }

    const friendListSnapshot = await get(friend_list_Friend);
    let friendList = friendListSnapshot.exists() ? friendListSnapshot.val() : [];
    if (!Array.isArray(friendList)) friendList = [];
    if (!friendList.includes(currentUserID)) {
      friendList.push(currentUserID);
      await update(ref(db, `users/${userId}`), { listfriend: friendList });
    }

    alert("Đã xác nhận kết bạn thành công!");
    setFriendRequests(friendRequests.filter((friend) => friend.id !== userId));
  };

  const searchUserByEmail = async (email) => {
    const snapshot = await get(ref(db, "users"));
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (userData.email === email && childSnapshot.key !== auth.currentUser?.uid) {
          setUsers({ id: childSnapshot.key, email: userData.email });
        }
      });
    }
  };

  useEffect(() => {
    if (search) searchUserByEmail(search);
  }, [search]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Kết Bạn</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">Tìm Kiếm Người Dùng</Form.Label>
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Nhập email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-end"
            />
          </InputGroup>
        </Form.Group>

        {Object.keys(users).length > 0 && users.id !== auth.currentUser?.uid && (
          <Card className="mb-4 shadow-sm">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <span>{users.email}</span>
              <Button variant="info" onClick={() => sendFriendRequest(users.id)}>
                <FaUserPlus /> Thêm Bạn
              </Button>
            </Card.Body>
          </Card>
        )}

        <Form.Label className="fw-bold">Lời Mời Kết Bạn</Form.Label>
        <ListGroup style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "5px" }}>
          {friendRequests.length > 0 ? (
            friendRequests.map((friend) => (
              <ListGroup.Item
                key={friend.id}
                className="d-flex justify-content-between align-items-center p-3"
                style={{ borderBottom: "1px solid #eee" }}
              >
                <span>{friend.email}</span>
                <Button variant="success" onClick={() => acceptFriendRequest(friend.id)}>Chấp Nhận</Button>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item className="text-center text-muted p-3">Không có lời mời kết bạn.</ListGroup.Item>
          )}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Thoát</Button>
      </Modal.Footer>
    </Modal>
  );
}

// Component tìm kiếm và chức năng
function TimKiem({ onCreateGroup, onAddFriend }) {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);

  return (
    <div className={styles.TimKiem_Chucnang}>
      <div className={styles.SearchBox}>
        <FaSearch />
        <input type="text" placeholder="Tìm kiếm" />
      </div>
      <div className={styles.IconWrapper}>
        <FaUserPlus onClick={() => setShowAddFriend(true)} />
        <FaUsers onClick={() => setShowCreateGroup(true)} />
      </div>
      {showCreateGroup && <FromTaoNhom show={showCreateGroup} onHide={() => setShowCreateGroup(false)} />}
      {showAddFriend && <From_KetBan show={showAddFriend} onHide={() => setShowAddFriend(false)} />}
    </div>
  );
}

// Component hiển thị một nhóm trong danh sách
function The_User({ id, groupName, onSelect }) {
  return (
    <div className={styles.userContainer} onClick={() => onSelect(id)}>
      <div className={styles.chatDetails}>
        <div className={styles.chatHeader}>
          <span className={styles.userName}>
            <FaUsers className={styles.groupIcon} /> {groupName}
          </span>
        </div>
      </div>
    </div>
  );
}

// Component danh sách nhóm
function ListNguoiNhan({ onSelectGroup }) {
  const [nhom, setNhom] = useState([]);

  const Call_nhom = (user_id) => {
    const userGroupsPath = ref(db, `userGroups/${user_id}`);
    onValue(userGroupsPath, (snapshot) => {
      const userGroupsData = snapshot.val();
      if (userGroupsData) {
        const groupIDs = Object.keys(userGroupsData);
        const groupDetails = [];
        let completedQueries = 0;

        groupIDs.forEach((groupID) => {
          const groupPath = ref(db, `groupChats/${groupID}`);
          onValue(groupPath, (groupSnapshot) => {
            const groupData = groupSnapshot.val();
            if (groupData && groupData.groupName) {
              groupDetails.push({ id: groupID, name: groupData.groupName });
            }
            completedQueries++;
            if (completedQueries === groupIDs.length) {
              setNhom(groupDetails);
            }
          }, { onlyOnce: true });
        });
      } else {
        setNhom([]);
      }
    });
  };

  useEffect(() => {
    if (auth.currentUser) Call_nhom(auth.currentUser.uid);
  }, []);

  return (
    <div className={styles.listContainer}>
      {nhom.map((group) => (
        <The_User key={group.id} id={group.id} groupName={group.name} onSelect={onSelectGroup} />
      ))}
    </div>
  );
}

// Component sidebar
function Slider_kien({ setSelectedGroupId }) {
  return (
    <Row className={styles.TimKiem_Div}>
      <Col className={`${styles.small_col} ${styles.Timkiem} bg-white p-3`}>
        <TimKiem />
      </Col>
      <Col className={`${styles.flex_grow_1} bg-white p-0`}>
        <ListNguoiNhan onSelectGroup={setSelectedGroupId} />
      </Col>
    </Row>
  );
}

// Component thông tin nhóm
function ThongTin({ groupId, isAdmin }) {
  const [members, setMembers] = useState([]);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [searchMember, setSearchMember] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (!groupId) return;

    const groupRef = ref(db, `groupChats/${groupId}`);
    const unsubscribe = onValue(groupRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.members) {
        const memberList = Object.entries(data.members).map(([userId, role]) => ({
          id: userId,
          role,
          email: "Unknown", // Thay bằng cách lấy email thực tế từ users
        }));
        setMembers(memberList);
      }
    });

    return () => off(groupRef, "value", unsubscribe);
  }, [groupId]);

  const kickMember = async (memberId) => {
    if (isAdmin && memberId !== auth.currentUser?.uid) {
      await update(ref(db, `groupChats/${groupId}/members`), { [memberId]: null });
      await update(ref(db, `userGroups/${memberId}/${groupId}`), null);
      alert("Đã kick thành viên!");
    }
  };

  const addMember = async () => {
    if (isAdmin && selectedMember) {
      await update(ref(db, `groupChats/${groupId}/members`), { [selectedMember]: "member" });
      const userGroupRef = ref(db, `userGroups/${selectedMember}/${groupId}`);
      await set(userGroupRef, { role: "member" });
      setShowAddMemberModal(false);
      setSearchMember("");
      setSelectedMember(null);
      alert("Đã thêm thành viên!");
    }
  };

  const searchUserByEmailForAdd = async (email) => {
    const snapshot = await get(ref(db, "users"));
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (userData.email === email && !members.find((m) => m.id === childSnapshot.key)) {
          setSelectedMember(childSnapshot.key);
        }
      });
    }
  };

  return (
    <Col xs={2} className={`${styles.ThongTin} bg-danger p-3`}>
      <h4>Thông Tin Nhóm</h4>
      <ListGroup>
        {members.map((member) => (
          <ListGroup.Item key={member.id} className="d-flex justify-content-between align-items-center">
            <span>{member.email} ({member.role})</span>
            {isAdmin && member.id !== auth.currentUser?.uid && (
              <Button variant="danger" size="sm" onClick={() => kickMember(member.id)}><FaTrash /></Button>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
      {isAdmin && (
        <>
          <Button variant="success" onClick={() => setShowAddMemberModal(true)} className="mt-3">
            <FaPlus /> Thêm Thành Viên
          </Button>
          <Modal show={showAddMemberModal} onHide={() => setShowAddMemberModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Thêm Thành Viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Nhập email thành viên..."
                  value={searchMember}
                  onChange={(e) => {
                    setSearchMember(e.target.value);
                    searchUserByEmailForAdd(e.target.value);
                  }}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAddMemberModal(false)}>Hủy</Button>
              <Button variant="primary" onClick={addMember} disabled={!selectedMember}>Thêm</Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </Col>
  );
}

// Component layout chính
function Layout() {
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  useEffect(() => {
    if (selectedGroupId) socket.emit("join_room", selectedGroupId);
  }, [selectedGroupId]);

  return (
    <Container fluid>
      <Row className={styles.Container_cc}>
        <Col xs={3} className="bg-primary">
          <Slider_kien setSelectedGroupId={setSelectedGroupId} />
        </Col>
        <Col xs={7} className="bg-gray">
          {selectedGroupId ? <Conten groupId={selectedGroupId} /> : <p>Chọn nhóm để bắt đầu trò chuyện</p>}
        </Col>
        {selectedGroupId && <ThongTin groupId={selectedGroupId} />}
      </Row>
    </Container>
  );
}

// Component chính
function Zalo_Main() {
  return <Layout />;
}

export default Zalo_Main;