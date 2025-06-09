import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import CreatePost from './components/CreatePost';
import PostList from './components/PostList';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Likes from './components/Likes';
import AdminPanel from './components/AdminPanel'; 
import FollowList from './components/FollowList.jsx';

const AppContainer = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #f5f8fa;
  min-height: 100vh;
`;

const Navbar = styled.nav`
  background-color: #ffffff;
  border-bottom: 1px solid #e6ecf0;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Brand = styled.h1`
  font-size: 20px;
  color: #1da1f2;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: #1da1f2;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthenticated(!!token)
    if (token) {
      const isAdminValue = localStorage.getItem('is_admin');
      setAuthenticated(true);
      setIsAdmin(isAdminValue === 'true');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('username');
    setAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AppContainer>
      <Router>
        <Navbar>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Brand>H</Brand>
          </Link>

          {authenticated ? (
            <>
              <NavButton onClick={handleLogout}>Logout</NavButton>
              {isAdmin && <NavButton as={Link} to="/admin">Admin</NavButton>}
            </>
          ) : (
            <NavButton as="a" href="/login">Login</NavButton>
          )}
        </Navbar>
        <Routes>
          <Route
            path="/"
            element={authenticated ? <PostList setAuthenticated={setAuthenticated} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/create-post"
            element={authenticated ? <CreatePost /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={authenticated ? <Profile /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile/:userId"
            element={authenticated ? <Profile /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/likes"
            element={authenticated ? <Likes /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/login"
            element={<Login setAuthenticated={setAuthenticated} />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/admin"
            element={authenticated && isAdmin ? <AdminPanel /> : <Navigate to="/login" replace />}
          />
          <Route path="/profile/:userId/:type" element={<FollowList />} />
          <Route path="/profile/:userId/:type" element={<FollowList />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppContainer>
  );
}

export default App;