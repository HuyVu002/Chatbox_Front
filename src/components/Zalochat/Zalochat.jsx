
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

import styles from '../Zalochat/Zalochat.module.css'; 
import { FaSearch, FaUserPlus, FaUsers,FaRegEdit } from "react-icons/fa";
import { CiUser,CiVideoOn } from "react-icons/ci";
import { IoMdSearch } from "react-icons/io";
import { BsEmojiSmile, BsPaperclip } from "react-icons/bs";
import { MdSend } from "react-icons/md";



///ChucNang


function TinNhan(){
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
    return(<>
        <div className={styles.Chat_Conten} >
            <TinNhan/>
            <TinNhan/>
            <TinNhan/>
            <TinNhan/>
            <TinNhan/>
            <TinNhan/>
            <TinNhan/>
            <TinNhan/>
            <TinNhan/>
            <TinNhan/>  
        </div>
    </>)
}

function Gui_Conten(){
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
                />
                <button className={styles.iconButton}>
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