import { Client } from "@stomp/stompjs";
import axios from "config/axios";
import SockJS from "sockjs-client";
class ChatService {
    client;

    connect(onMessageReceived, onPrivateMessageReceived, username) {
        this.client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            connectHeaders: {},
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("Connected");
                this.client.subscribe("/chatroom/public", (message) => {
                    onMessageReceived(JSON.parse(message.body));
                });

                this.client.subscribe(
                    `/user/${username}/private`,
                    (message) => {
                        onPrivateMessageReceived(JSON.parse(message.body));
                    }
                );
            },
            onStompError: (frame) => {
                console.error(
                    "Broker reported error: " + frame.headers["message"]
                );
                console.error("Additional details: " + frame.body);
            },
            onDisconnect: () => {
                console.log("Disconnected");
            },
        });
        this.client.activate();
    }

    sendMessage(message) {
        if (!this.client || !this.client.connected) {
            console.error("lỗi ko thể gửi đc tin nhắn public.");
            return;
        }
        this.client.publish({
            destination: "/app/message",
            body: JSON.stringify(message),
        });
    }
    sendPrivateMessage(message) {
        if (this.client && this.client.connected) {
            this.client.publish({
                destination: "/app/private-message",
                body: JSON.stringify(message),
            });
        } else {
            console.error("lỗi ko thể gửi đc tin nhắn private.");
        }
    }
}

export const postInfoMessages = (data) => {
    return axios({
        url: "/messages",
        method: "post",
        data,
    });
};
export const getAllMessage = () => {
    return axios({
        url: "/messages",
        method: "get",
    });
};
export const deleteMessageById = (id) => {
    return axios({
        url: `/messages/${id}`,
        method: "delete",
    });
};

export default new ChatService();
