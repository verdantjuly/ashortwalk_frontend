import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";
import PostImgContent from "./PostImgContent";
import PostCommentContent from "./PostCommentContent";

import "./Post.css";
const Post = () => {
  const { id } = useParams(); // URL에서 ID 가져오기
  const [data, setData] = useState(null); // API에서 가져온 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [user, setUser] = useState("");
  const authorization = window.sessionStorage.getItem("Authorization");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true); // 로딩 시작
        const result = await axios.get(
          `https://ashortwalk.store/api/posts/${id}`
        );
        setData(result.data); // 데이터 설정
      } catch (err) {
        setError(err); // 에러 설정
      } finally {
        setLoading(false); // 로딩 종료
      }
    };
    const findUser = async () => {
      const response = await axios.get(`https://ashortwalk.store/api/users`, {
        headers: { authorization },
      });
      setUser(response.data);
    };
    findUser();

    fetchPost();
  }, [id]);

  if (loading) return <p>Loading...</p>; // 로딩 중 화면
  if (error) return <p>Error: {error.message}</p>; // 에러 화면

  return (
    <div className="post">
      <Header />
      <div className="main-content">
        <PostImgContent data={data} user={user} />
        <PostCommentContent user={user} />
      </div>

      <Footer />
    </div>
  );
};

export default Post;
