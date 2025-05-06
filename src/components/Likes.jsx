import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLikedPosts } from '../api';
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

const ErrorMessage = styled.p`
  color: #ff3333;
  text-align: center;
`;

const Likes = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in.');
          navigate('/login');
          return;
        }
        const likedPosts = await getLikedPosts(token);
        setPosts(Array.isArray(likedPosts) ? likedPosts : []);
        setError('');
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch liked posts.');
      }
    };
    fetchLikedPosts();
  }, [navigate]);

  return (
    <Timeline>
      <h2>Liked Posts</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {posts.length === 0 ? (
        <p>No liked posts available.</p>
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
              <TweetImage src={`${API_URL}${post.image_url}`} alt="Post" />
            )}
          </Tweet>
        ))
      )}
    </Timeline>
  );
};

export default Likes;