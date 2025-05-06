import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
const API_URL = import.meta.env.VITE_API_URL;
const Timeline = styled.div`
  max-width: 600px;
  margin: 20px auto;
`;

const Tweet = styled.div`
  background-color: #ffffff;
  border: 1px solid #e6ecf0;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
`;

const TweetHeader = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background-color: #1da1f2;
  border-radius: 50%;
  margin-right: 10px;
`;

const Username = styled.span`
  font-weight: bold;
  color: #14171a;
`;

const Timestamp = styled.span`
  color: #657786;
  font-size: 14px;
  margin-left: 10px;
`;

const TweetContent = styled.p`
  margin: 10px 0;
  font-size: 16px;
  color: #14171a;
`;

const TweetImage = styled.img`
  max-width: 100%;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const TweetActions = styled.div`
  display: flex;
  gap: 20px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #657786;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  &:hover {
    color: #1da1f2;
  }
`;

const ErrorMessage = styled.p`
  color: #ff3333;
  text-align: center;
`;

const CreateButton = styled.button`
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
  &:hover {
    background-color: #1991db;
  }
`;

const PostList = ({ setAuthenticated }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchPosts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setAuthenticated(false);
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Fetched posts:', response.data);
      setPosts(Array.isArray(response.data) ? response.data : []);
      setError('');
    } catch (error) {
      console.error('Fetch posts error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        setAuthenticated(false);
        navigate('/login');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to fetch posts. Please try again.');
      }
      setPosts([]);
    }
  };

  const handleToggleLike = async (postId, isLiked) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setAuthenticated(false);
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      fetchPosts();
    } catch (error) {
      console.error('Toggle like error:', error.response || error);
      setError(isLiked ? 'Failed to unlike post' : 'Failed to like post');
    }
  };

  const handleDelete = async (postId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setAuthenticated(false);
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      fetchPosts();
    } catch (error) {
      console.error('Delete post error:', error.response || error);
      setError('Failed to delete post');
    }
  };

  const navigateToCreatePost = () => {
    navigate('/create');
  };

  const navigateToProfile = () => {
    navigate('/profile');
  };
  const navigateToLikes = () => {
    navigate('/likes');
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Timeline>
      <CreateButton onClick={navigateToCreatePost}>Tweet</CreateButton>
      <CreateButton onClick={navigateToProfile}>Profile</CreateButton>
      <CreateButton onClick={navigateToLikes}>likes</CreateButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {posts.length === 0 ? (
        <p style={{ color: '#14171a' }}>No posts available.</p>
      ) : (
        posts.map((post) => (
          <Tweet key={post.id}>
            <TweetHeader>
              <Avatar />
              <Username>{post.username}</Username>
              <Timestamp>{new Date(post.created_at).toLocaleString()}</Timestamp>
            </TweetHeader>
            <TweetContent>{post.content}</TweetContent>
            {post.image_url && (
              <TweetImage
                src={`${API_URL}${post.image_url}`}
                alt="Post"
              />
            )}
            <TweetActions>
              <ActionButton
                onClick={() => handleToggleLike(post.id, post.isLiked)}
              >
                {post.isLiked ? 'Unlike' : 'Like'} ({post.likes})
              </ActionButton>
              <ActionButton onClick={() => handleDelete(post.id)}>
                Delete
              </ActionButton>
            </TweetActions>
          </Tweet>
        ))
      )}
    </Timeline>
  );
};

export default PostList;