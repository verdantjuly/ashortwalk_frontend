import "./App.css";
import Login from "./component/users/Login.jsx";
import PostsPage from "./component/posts/PostsPage.jsx";
import Post from "./component/post/Post.jsx";
import PostWrite from "./component/postWrite/PostWrite.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./component/users/SignUp.jsx";
import EmailLogin from "./component/users/EmailLogin.jsx";
import MyPage from "./component/mypage/MyPage.jsx";
import PostEdit from "./component/postEdit/PostEdit.jsx";
import LandingPage from "./component/landingPage/LandingPage.jsx";
import AdminPage from "./component/adminPage/AdminPage.jsx";
import GroupPage from "./component/groupPage/GroupPage.jsx";
import MusicPage from "./component/musicPage/MusicPage.jsx";
import UserUpdate from "./component/mypage/UserUpdate.jsx";
import SignOut from "./component/users/SignOut.jsx";
import KakaoLogin from "./component/users/KakaoLogin.jsx";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/post/write" element={<PostWrite />} />
          <Route path="/post/edit/:id" element={<PostEdit />} />
          <Route path="/login/email" element={<EmailLogin />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/group" element={<GroupPage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/user/edit" element={<UserUpdate />} />
          <Route path="/user/signout" element={<SignOut />} />
          <Route path="/login/kakao" element={<KakaoLogin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
