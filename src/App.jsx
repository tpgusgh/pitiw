import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      <div>
        <Routes>
          {/* 로그인 상태에 따라 페이지를 보여주도록 설정 */}
          {authenticated ? (
            <>
              <Route path="/" element={<PostList setAuthenticated={setAuthenticated}/>} /> {/* 홈 페이지 */}
              <Route path="/create" element={<CreatePost />} /> {/* 글 작성 페이지 */}
            </>
          ) : (
            <>
              <Route path="/" element={<Login setAuthenticated={setAuthenticated} />} /> {/* 로그인 페이지 */}
              <Route path="/signup" element={<Signup />} /> {/* 회원가입 페이지 */}
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
