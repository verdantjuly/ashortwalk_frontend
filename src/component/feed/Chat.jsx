import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./Chat.css";

const SOCKET_URL = "https://ashortwalk.store/api/chat";

const ChatComponent = ({ myGroup }) => {
  const socketRef = useRef(null);
  const messageListRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const { id: groupId } = myGroup;
  const [nickname, setNickname] = useState("");
  const [isMember, setIsMember] = useState(true); // 함수명 수정
  const token = sessionStorage.getItem("Authorization");
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    const findNickname = async () => {
      try {
        const response = await axios.get(`https://ashortwalk.store/api/users`, {
          headers: { authorization: token },
        });
        setNickname(response.data.nickname);
      } catch (err) {
        console.error("Nickname fetch error:", err);
        alert("닉네임을 불러오는 데 실패했습니다.");
      }
    };

    findNickname();

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      query: { groupId },
      withCredentials: true,
    });

    socketRef.current.connect();
    socketRef.current.on("chat:message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socketRef.current.on("error", () => {
      setIsMember(false);
      socketRef.current.disconnect();
    });

    socketRef.current.emit("get:prev", { room: groupId });

    return () => {
      socketRef.current.disconnect();
    };
  }, [groupId, token]);

  function handleSendMessage() {
    if (messageInput && !isComposing) {
      socketRef.current.emit("chat:message", {
        nickname,
        room: groupId,
        message: messageInput,
      });
      setMessageInput(""); // 입력 후 메시지 상태 초기화
      setIsComposing(false);
    }
  }

  // 입력 변경 처리
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  // 조합 시작 처리
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  // 조합 종료 처리
  const handleCompositionEnd = (e) => {
    setIsComposing(false);
    setMessageInput(e.target.value);
  };

  // 메시지 목록이 변경될 때마다 스크롤 최하단으로 이동
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      {isMember ? (
        <div>
          <p className="chat-notice">
            📣 당신과 대화를 나누는 상대는 누군가의 소중한 금지옥엽입니다.
          </p>
          <div
            ref={messageListRef}
            style={{
              height: "550px",
              overflowY: "scroll",
              marginBottom: "10px",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                className={
                  msg.nickname === nickname ? "my-chat-box" : "chat-box"
                }
                key={idx}
              >
                <p>{msg.content}</p>
                <p className="chat-nickname">{msg.nickname}</p>
              </div>
            ))}
          </div>

          <div className="chat-input-box">
            <input
              className="chat-input"
              type="text"
              value={messageInput}
              onChange={handleInputChange} // onChange로 입력 처리
              onCompositionStart={handleCompositionStart} // 한글 조합 시작
              onCompositionEnd={handleCompositionEnd} // 한글 조합 종료
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage(); // Enter키로 메시지 전송
              }}
            />
            <button
              className="chat-button"
              onClick={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              전송
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="chat-notice">
            📣 채팅 서비스는 그룹의 멤버만 참여할 수 있습니다.
          </p>
          <div
            style={{
              height: "400px",
              marginBottom: "10px",
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
