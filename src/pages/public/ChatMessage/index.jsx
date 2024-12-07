import React, { useState, useEffect } from "react";
import ChatService, { deleteMessageById, getAllMessage, postInfoMessages } from "apis/websocket.api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import paths from "constant/paths";
import "./index.css";
import { notification } from "antd";
import Icons from "utils/icons";
import { MdDeleteForever } from "react-icons/md";


const ChatMessage = () => {
    const isLoggedIn = useSelector((state) => state.auth.isLogged);
    const userInfo = useSelector((state) => state.auth.userInfo.data);


    const navigate = useNavigate();
    const [isChatVisible, setChatVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [privateMessages, setPrivateMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [userList, setUserList] = useState([
        { username: "employee1", avatar: "https://via.placeholder.com/40" },
        { username: "employee2", avatar: "https://via.placeholder.com/40" },
    ]);

    useEffect(() => {
        if (userInfo?.username) {
            ChatService.connect(
                (msg) => {
                    console.log("public message: ", msg);
                    setChatMessages((prev) => [...prev, msg])
                },
                (privateMsg) => {
                    console.log("Private message: ", privateMsg);
                    setPrivateMessages((prev) => [...prev, privateMsg]);
                },
                userInfo.username
            );
        }
    }, [userInfo?.username]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await getAllMessage();
                setChatMessages(response.filter(msg => !msg.receiverName));
                setPrivateMessages(response.filter(msg => msg.receiverName));
            } catch (error) {
                console.error("Lỗi khi useeffect messsage", error);
            }
        };
        fetchMessages();
    }, []);

    const handleDeleteMessageById = async (id) => {
        try {
            await deleteMessageById(id);
            notification.success({ message: "delete thanh cong!" });
            setChatMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
        } catch (error) {
            console.log("lỗi khi xóa tin nhắn", error);

        }
    }

    const toggleChat = () => {
        setChatVisible(!isChatVisible);
    };

    const saveMessageToDB = async (message) => {
        try {
            await postInfoMessages(message)
            console.log("lưu tin nhắn vào db thành công");
        } catch (error) {
            console.log("lỗi khi lưu tin nhắn vào db", error);
        }
    }

    const sendMessage = () => {
        if (!message?.trim()) return;
        const newMessage = {
            senderName: userInfo?.username,
            content: message,
            time: new Date().toISOString(),
        };
        ChatService.sendMessage(newMessage);
        saveMessageToDB(newMessage)
        setMessage("");
    };
    const sendPrivateMessage = () => {
        if (!message?.trim() || !selectedUser) return;
        const newMessage = {
            senderName: userInfo?.username,
            receiverName: "Van quyet",
            content: message,
            time: new Date().toISOString(),
        };
        ChatService.sendPrivateMessage(newMessage);
        saveMessageToDB(newMessage)
        setMessage("");
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <div
                className="bg-blue-500 text-white rounded-lg shadow-lg flex flex-col items-center cursor-pointer px-4 py-2 space-y-2"
                onClick={toggleChat}
            >
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 text-blue-500"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v6m0 0v6m0-6H6m6 0h6"
                            />
                        </svg>
                    </div>
                    <span className="text-sm">Trợ lý</span>
                </div>
            </div>

            {isChatVisible && (
                <div className="fixed bottom-20 right-8 w-[800px] h-[600px] bg-white shadow-lg rounded-lg p-4">
                    {!isLoggedIn ? (

                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-12 h-12 text-gray-400"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 10h11M9 21v-4M16.5 14h1.5a2.5 2.5 0 0 0 0-5h-1.5m0 0a2.5 2.5 0 1 0 0 5m-6-5V6m0 0V3.5m0 2.5h3m-3 0H7"
                                    />
                                </svg>
                            </div>
                            <p className="text-gray-600 text-center mb-4">
                                Bạn cần đăng nhập để sử dụng tính năng này
                            </p>
                            <button className="text-blue-500 hover:underline mt-4" onClick={() => navigate(paths.LOGIN)} >
                                Login / Sign up
                            </button>
                        </div>
                    ) : (
                        // <div className="flex h-full">
                        //     <div className="w-3/12 bg-gray-100">
                        //         <h2 className="text-lg font-semibold">Message</h2>
                        //         <div className="flex items-center mt-5">
                        //             <div className="w-10 rounded-full ring ring-offset-2">
                        //                 <img
                        //                     src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        //                     className="rounded-full h-[40px] w-[40px]"
                        //                 />
                        //             </div>
                        //             <span className="ml-3 text-sm font-semibold">Tên người dùng</span>
                        //         </div>
                        //     </div>
                        //     <div className="flex flex-col w-9/12 h-full">
                        //         <div className="flex justify-between items-center p-2">
                        //             <h2 className="text-lg font-semibold"></h2>
                        //             <button
                        //                 className="text-gray-500 hover:text-gray-800"
                        //                 onClick={toggleChat}
                        //             >
                        //                 &times;
                        //             </button>
                        //         </div>
                        //         <div className="flex-grow overflow-y-auto border p-2 mb-2">
                        //             {chatMessages.map((msg, idx) => (
                        //                 <div key={idx} className="mb-2">
                        //                     <strong>{msg.senderName}:</strong> {msg.content}
                        //                 </div>
                        //             ))}
                        //         </div>
                        //         <div className="flex mt-auto p-2">
                        //             <input
                        //                 className="flex-grow border rounded-l-lg p-2"
                        //                 type="text"
                        //                 value={message}
                        //                 onChange={(e) => setMessage(e.target.value)}
                        //                 placeholder="Type a message..."
                        //             />
                        //             <button
                        //                 className="bg-blue-500 text-white p-2 rounded-r-lg"
                        //                 onClick={sendMessage}
                        //             >
                        //                 Send
                        //             </button>
                        //         </div>
                        //     </div>
                        // </div>
                        <div className="chat-container">
                            <div className="user-list">
                                {/* <h3>Users</h3> */}
                                <div
                                    onClick={() => setSelectedUser(null)}
                                    className={`user-item ${selectedUser === null ? "active" : ""}`}
                                >
                                    <button>Public Chat</button>
                                </div>
                                {userList.map((user, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedUser(user.username)}
                                        className={`user-item ${selectedUser === user.username ? "active" : ""}`}
                                    >
                                        <img src={user.avatar} alt="avatar" />
                                        <span>{user.username}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="chat-box">
                                <h3>{selectedUser ? `Chat with ${selectedUser}` : "Public Chat"}</h3>
                                <div className="messages">
                                    {selectedUser
                                        ? privateMessages.map((msg, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <strong>{msg.senderName}:</strong>
                                                    <span>{msg.content}</span>
                                                </div>
                                                {userInfo?.username === msg.senderName && ( 
                                                    <button
                                                        onClick={() => handleDeleteMessageById(msg.id)}
                                                        className="ml-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <MdDeleteForever className="text-xl" />
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                        : chatMessages.map((msg, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <strong>{msg.senderName}:</strong>
                                                    <span>{msg.content}</span>
                                                </div>
                                                {userInfo?.username === msg.senderName && (
                                                    <button
                                                        onClick={() => handleDeleteMessageById(msg.id)}
                                                        className="ml-2 text-red-500 hover:text-red-700"
                                                    >
                                                        <MdDeleteForever className="text-xl" />
                                                    </button>
                                                )}
                                            </div>

                                        ))}
                                </div>
                                <div className="input-box">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Gửi tin nhắn đến nhóm..."
                                    />
                                    <button onClick={selectedUser ? sendPrivateMessage : sendMessage}>Send</button>
                                </div>
                            </div>
                        </div>


                    )}
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
