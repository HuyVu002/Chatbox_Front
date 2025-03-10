
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

import styles from '../Zalochat/Zalochat.module.css'; 
import { FaSearch, FaUserPlus, FaUsers,FaRegEdit } from "react-icons/fa";
import { CiUser,CiVideoOn } from "react-icons/ci";
import { IoMdSearch } from "react-icons/io";
import { BsEmojiSmile, BsPaperclip } from "react-icons/bs";
import { MdSend } from "react-icons/md";

import { useState, useEffect } from "react";

import { Form, Button, Card, Image, ListGroup } from "react-bootstrap";

// import Card from 'react-bootstrap/Card';

import Input from 'react-bootstrap/InputGroup';

///
import io from "socket.io-client";

const socket = io("http://localhost:4000");

import { auth, db, storage } from '../firebaseClient';


///ChucNang

import { getDatabase, ref, get } from "firebase/database";



function TinNhan({id_user,Conten,time}){
    return (
    <div className={`${styles.TinNhan_Conten} ${styles.huongGui}`} >
        <div className={`${styles.TinNhan_User} `} >
            <div className={styles.TinNhan_Conten_HinhANh}>
                <img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTnCKdebIqk_dMxTPXae5wqG-4zodt5V4nz12FS7_jWWZwtU4X0lKIj_rVUX-h609l6xu96mNxd7RjX8Y56QQr1BTBnEGfvO358pvU0e_w" alt="Avatar"  />
            </div>
            <div className={`${styles.TinNhan_Conten_Conten} ${styles.minhGui} `} >
                <div className={styles.TinNhan_Conten_Conten_Ten} >Trinh Duy Kiên</div>
                <div className={styles.TinNhan_Conten_Conten_Tin} >sadsadcasaxasdsaddsadasdsadasdddddddddddddddddddddddddddddddddsaddddddddddddddddsadddddddddddddddddddddddddddddsadcassadasasdsa</div>
                <div className={styles.TinNhan_Conten_Conten_Gio}>15:30</div>
            </div>
        </div>
    </div>)
}


function Header_Conten(){
    return(<>
        <div className={styles.Header_Conten_Div} >
            <div className={styles.Header_Conten_ThongTin} >
                <div className={styles.Header_Conten_HinhANh}>
                    <img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTnCKdebIqk_dMxTPXae5wqG-4zodt5V4nz12FS7_jWWZwtU4X0lKIj_rVUX-h609l6xu96mNxd7RjX8Y56QQr1BTBnEGfvO358pvU0e_w" alt="Avatar" className={styles.avatar} />
                </div>
                <div className={styles.Header_Conten_ThongTin_Ten} >
                    <div className={styles.Header_Conten_ThongTin_Ten_De} >
                         <p>Nhóm Sẽ Gầy</p>
                    </div>
              
                    <div className={styles.Header_Conten_ThongTin_ChuThich}>
                        <p>Cộng đồng</p> 
                         <CiUser /><p> 99 thành viên</p>
                    </div>
                   
                </div>
            </div>
            <div className={styles.Header_Conten_Div_ChucNang}>
                <FaUserPlus />
                <CiVideoOn />
                <IoMdSearch />
            </div>
        </div>
    </>)
}

function Chat_Conten(){


    const [messages, setMessages] = useState([]);
  
    // Lắng nghe tin nhắn từ server
    useEffect(() => {
      socket.on("receive_message", (data) => {
        setMessages((prev) => [...prev, data]);
      });
  
      return () => socket.off("receive_message");
    }, []);

    console.log(messages)

    return(<>
        <div className={styles.Chat_Conten} >
            {messages.map((msg, index) => (
                <TinNhan
                    key={index} // Nên có key để React tối ưu
                    id_user={msg.id_user}
                    Conten={msg.Conten}
                    time={msg.time}
                />
            ))}
        </div>
    </>)
}

function Gui_Conten(){
    const [message, setMessage] = useState("");
    const sendMessage = () => {
        const messageData = {
            room:"room1", // Gửi tin vào nhóm nào
            id_user: "User1",
            Conten: "Hello nhóm!",
            time: new Date().toLocaleTimeString()
        };
        socket.emit("send_message", messageData);
    };

    return(<>
        <div className={styles.Gui_Conten}>
            <div className={styles.messageInputContainer}>
                <button className={styles.iconButton}>
                    <BsEmojiSmile />
                </button>
                <button className={styles.iconButton}>
                    <BsPaperclip />
                </button>
                <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Nhập tin nhắn..."
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage} className={styles.iconButton}>
                    <MdSend />
                </button>
            </div>
        </div>
    </>)
}

function Conten(){
    return<>
       <Row className={styles.ConTen_Div}>
            <Col className={`${styles.ConTen_Head} ${'' } bg-white  p-0`}><Header_Conten/></Col>
            <Col className={`${styles.ConTen_chat}   p-0`}><Chat_Conten/></Col>
            <Col className={`${styles.ConTen_GuiTin} ${styles.GuiTin } bg-white  p-0`}><Gui_Conten/></Col>
        </Row>     
    </>
}



/////


function FromTaoNhom(){

    const users = [
        { id: 1, name: "Mẹ", avatar: "https://cdn.popsww.com/blog/sites/2/2022/02/megumin.jpg" },
        { id: 2, name: "August Ng", avatar: "https://cdn.popsww.com/blog/sites/2/2022/02/megumin.jpg" },
        { id: 3, name: "Châu Nguyễn", avatar: "https://cdn.popsww.com/blog/sites/2/2022/02/megumin.jpg" },
        { id: 4, name: "Ngọc Anh", avatar: "https://cdn.popsww.com/blog/sites/2/2022/02/megumin.jpg" },
        { id: 5, name: "Chị Phượng", avatar: "https://cdn.popsww.com/blog/sites/2/2022/02/megumin.jpg" },
        { id: 6, name: "Anh Trần", avatar: "https://cdn.popsww.com/blog/sites/2/2022/02/megumin.jpg" },
      ];


    const [groupName, setGroupName] = useState("");
    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);

    const toggleUserSelection = (id) => {
    setSelectedUsers((prev) =>
        prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
    };
  
    return(<>
        <Card className="p-3" style={{ width: "400px" }}>
            <Form.Group className="mb-3">
                <Form.Control
                type="text"
                placeholder="Nhập tên nhóm..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control
                type="text"
                placeholder="Nhập tên, số điện thoại, hoặc danh sách số điện thoại"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
            </Form.Group>
            <ListGroup className="mb-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
                {users
                .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
                .map((user) => (
                    <ListGroup.Item key={user.id} className="d-flex align-items-center">
                    <Form.Check
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                    />
                    <Image   src={user.avatar} roundedCircle width={30} height={30} style={{ objectFit: "cover" }} className="ms-2" />
                    <span className="ms-3">{user.name}</span>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary">Hủy</Button>
                <Button variant="primary" disabled={selectedUsers.length === 0}>
                Tạo nhóm
                </Button>
            </div>
            </Card>
    </>)
}

function From_KetBan(){

    const [users,setusers] = useState([]);
    const [List_users,setList_users] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    
    const toggleUserSelection = (id) => {
    setSelectedUsers((prev) =>
        prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
    };
    
    
    console.log(List_users.map(user => user.id));
    const Call_Gmail = async (input) => {
        // const db = getDatabase();
        const snapshot = await get(ref(db, "users"));

        if (snapshot.exists()) {
          let foundUser = null;
          
          snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            if (userData.email === input) {
              foundUser = { id: childSnapshot.key, ...userData };
              setList_users(foundUser.value)
            }
          });
      
          if (foundUser) {
            console.log("Gmail found:", foundUser);
          } else {
            console.log("Gmail not found");
          }
        } else {
          console.log("No users found in database");
        }
      };


    return(<>
        <Card className="p-3" style={{ width: "400px" }}>
            <Form.Group className="mb-3">
                <Form.Control
                type="text"
                placeholder="Nhập gmail..."
                // value={groupName}
                onChange={(e) => Call_Gmail(e.target.value)}
                />
            </Form.Group>
           
            <ListGroup className="mb-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
                {List_users
                .map((user) => (
                    <ListGroup.Item key={user.id} className="d-flex align-items-center">
                        <Button key={user.id} variant="info" >Thêm Bạn</Button>
                        {/* <Image   src={user.avatar} roundedCircle width={30} height={30} style={{ objectFit: "cover" }} className="ms-2" /> */}
                        <span className="ms-3">{user.name}</span>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary">Thoát</Button>
            </div>
            </Card>
    </>)
}

function TimKiem(){

    return(
    <>
       <div className={styles.TimKiem_Chucnang}>
            {/* Ô tìm kiếm */}
            <div className={styles.SearchBox}>
                <FaSearch />
                <input type="text" placeholder="Tìm kiếm" />
            </div>
            {/* Icon chức năng */}
            <div className={styles.IconWrapper}>
                <FaUserPlus />
                <FaUsers />
            </div>

            <div className={styles.ChucNangCoBan} >
                {/* <div className={styles.TaoNhom}>
                    <FromTaoNhom/>
                </div> */}
                <div className={styles.TaoNhom}>
                    <From_KetBan/>
                </div>
            </div>
        </div>
    </>)
}


function The_User({ avatar, name, lastMessage, time, unread }) {
    return (
      <div className={styles.userContainer}>
        <div className={styles.avatarWrapper}>
          <img src={avatar} alt="Avatar" className={styles.avatar} />
        </div>
        <div className={styles.chatDetails}>
          <div className={styles.chatHeader}>
            <span className={styles.userName}>
              <FaUsers className={styles.groupIcon} /> {name}
            </span>
            <span className={styles.time}>{time}</span>
          </div>
          <div className={styles.messagePreview}>
            {lastMessage}
            {unread > 0 && <span className={styles.unreadCount}>{unread}</span>}
          </div>
        </div>
        {/* <FaRegEdit className={styles.editIcon} /> */}
      </div>
    );
}
  
function ListNguoiNhan() {
const users = [
    {
    avatar: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTnCKdebIqk_dMxTPXae5wqG-4zodt5V4nz12FS7_jWWZwtU4X0lKIj_rVUX-h609l6xu96mNxd7RjX8Y56QQr1BTBnEGfvO358pvU0e_w", // Thay bằng ảnh thực tế
    name: "PG,PB Miền Bắc",
    lastMessage: "👉 Tuyển job t...",
    time: "2 phút",
    unread: 5,
    },
    {
    avatar: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTnCKdebIqk_dMxTPXae5wqG-4zodt5V4nz12FS7_jWWZwtU4X0lKIj_rVUX-h609l6xu96mNxd7RjX8Y56QQr1BTBnEGfvO358pvU0e_w", // Thay bằng ảnh thực tế
    name: "PG,PB Miền Bắc",
    lastMessage: "👉 Tuyển job t...",
    time: "2 phút",
    unread: 5,
    },
    {
    avatar: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTnCKdebIqk_dMxTPXae5wqG-4zodt5V4nz12FS7_jWWZwtU4X0lKIj_rVUX-h609l6xu96mNxd7RjX8Y56QQr1BTBnEGfvO358pvU0e_w", // Thay bằng ảnh thực tế
    name: "PG,PB Miền Bắc",
    lastMessage: "👉 Tuyển job t...",
    time: "2 phút",
    unread: 5,
    },
    {
    avatar: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTnCKdebIqk_dMxTPXae5wqG-4zodt5V4nz12FS7_jWWZwtU4X0lKIj_rVUX-h609l6xu96mNxd7RjX8Y56QQr1BTBnEGfvO358pvU0e_w", // Thay bằng ảnh thực tế
    name: "PG,PB Miền Bắc",
    lastMessage: "👉 Tuyển job t...",
    time: "2 phút",
    unread: 5,
    },
    {
    avatar: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTnCKdebIqk_dMxTPXae5wqG-4zodt5V4nz12FS7_jWWZwtU4X0lKIj_rVUX-h609l6xu96mNxd7RjX8Y56QQr1BTBnEGfvO358pvU0e_w", // Thay bằng ảnh thực tế
    name: "PG,PB Miền Bắc",
    lastMessage: "👉 Tuyển job t...",
    time: "2 phút",
    unread: 5,
    },
    {
    avatar: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTnCKdebIqk_dMxTPXae5wqG-4zodt5V4nz12FS7_jWWZwtU4X0lKIj_rVUX-h609l6xu96mNxd7RjX8Y56QQr1BTBnEGfvO358pvU0e_w", // Thay bằng ảnh thực tế
    name: "PG,PB Miền Bắc",
    lastMessage: "👉 Tuyển job t...",
    time: "2 phút",
    unread: 5,
    },
    {
    avatar: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTnCKdebIqk_dMxTPXae5wqG-4zodt5V4nz12FS7_jWWZwtU4X0lKIj_rVUX-h609l6xu96mNxd7RjX8Y56QQr1BTBnEGfvO358pvU0e_w", // Thay bằng ảnh thực tế
    name: "PG,PB Miền Bắc",
    lastMessage: "👉 Tuyển job t...",
    time: "2 phút",
    unread: 5,
    },
    {
    avatar: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTnCKdebIqk_dMxTPXae5wqG-4zodt5V4nz12FS7_jWWZwtU4X0lKIj_rVUX-h609l6xu96mNxd7RjX8Y56QQr1BTBnEGfvO358pvU0e_w", // Thay bằng ảnh thực tế
    name: "PG,PB Miền Bắc",
    lastMessage: "👉 Tuyển job t...",
    time: "2 phút",
    unread: 5,
    },


];



return (
    <div className={styles.listContainer}>
    {users.map((user, index) => (
        <The_User key={index} {...user} />
    ))}
    </div>
);
}
  

//Layout

function Slider_kien(){
    return(<>
  
        <Row className={styles.TimKiem_Div}>
            <Col className={`${styles.small_col} ${styles.Timkiem } bg-white  p-3`}><TimKiem/></Col>
            <Col className={`${styles.flex_grow_1} bg-white  p-0`}><ListNguoiNhan/></Col>

        </Row>      
   
    </>)
}


function Layout(){
    
    const [room, setRoom] = useState("room1"); 

    useEffect(() => {
        socket.emit("join_room", room);
    }, [room]);




    return(
        <>
                <Container fluid >
                    <Row className={styles.Container_cc} >
                        <Col xs={3} className="bg-primary  "><Slider_kien/></Col>
                        <Col xs={7} className="bg-gray  "><Conten/></Col>
                        <Col xs={2} className="bg-danger  ">ThongTin</Col>
                    </Row>
                </Container>
                
        </>
    )
}




function Zalo_Main(){
    return(<>
        <Layout/>

    </>)
}





export default Zalo_Main;