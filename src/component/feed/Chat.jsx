import React, { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import axios from "axios";
const SOCKET_URL = "http://localhost:8000";
//"https://shortwalk-f3byftbfe4czehcg.koreacentral-01.azurewebsites.net/chat";

const ChatComponent = ({ myGroup }) => {
  const socketRef = useRef(null);
  const messageListRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const { groupName, id: groupId } = myGroup;
  const [nickname, setNickname] = useState("");
  const token = sessionStorage.getItem("Authorization");

  useEffect(() => {
    try {
      const findNickname = async () => {
        const response = await axios.get(
          `https://shortwalk-f3byftbfe4czehcg.koreacentral-01.azurewebsites.net/api/users`,
          { headers: { authorization: token } }
        );
        setNickname(response.data.nickname);
      };
      findNickname();
    } catch (err) {}

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      query: { groupId },
      withCredentials: true,
    });

    socketRef.current.connect();
    socketRef.current.on("chat:message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    socketRef.current.emit("get:prev", { room: groupId });

    return () => {
      socketRef.current.disconnect();
    };
  }, [groupId, groupName, nickname, token]);

  function handleSendMessage() {
    if (messageInput) {
      socketRef.current.emit("chat:message", {
        nickname,
        room: groupId,
        message: messageInput,
      });
      setMessageInput("");
    }
  }

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      <h2>Chat - {groupName}</h2>

      <div
        ref={messageListRef}
        style={{ height: "400px", overflowY: "scroll", marginBottom: "10px" }}
      >
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.nickname}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
