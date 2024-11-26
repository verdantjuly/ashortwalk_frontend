import Footer from "../Footer";
import Header from "../Header";
import "./EmailLogin.css";
import React, { useState } from "react";

export default function EmailLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleInputChange = (e) => {
    if ("email" == e.target.id) {
      setEmail(e.target.value.trim());
    }
    if ("password" == e.target.id) {
      setPassword(e.target.value.trim());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    fetch("http://localhost:8000/api/auth/login", {
      method: "POST", // POST 요청
      headers: {
        "Content-Type": "application/json", // JSON 형식으로 전송
      },
      body: JSON.stringify({ email, password }), // 이메일을 JSON 형태로 전송
    })
      .then((response) => {
        if (response.ok) {
          alert("로그인이 완료되었습니다.");
        } else {
          alert("로그인에 실패하였습니다.");
        }
        return response.json();
      })
      .then((data) => {
        window.sessionStorage.setItem("Authorization", data.accessToken);
        window.location.href = "/posts";
      })
      .catch((error) => {});
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="form-container">
          <h1>로그인</h1>
          <div className="form-row">
            <label>E-mail</label>
            <input
              type="text"
              id="email"
              className="input2"
              onChange={handleInputChange}
            ></input>
          </div>
          <div className="form-row">
            <label>비밀번호</label>
            <input
              type="password"
              id="password"
              className="input2"
              onChange={handleInputChange}
            ></input>
          </div>
          <button onClick={handleSubmit}>전송</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
