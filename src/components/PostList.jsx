import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, ErrorMessage, ProfileLink } from './StyledComponents';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PostContent = styled.p`
  font-size: 16px;
  color: #14171a;
  margin: 10px 0;
`;

const PostMeta = styled.div`
  font-size: 14px;
  color: #657786;
  margin-bottom: 10px;
`;

const PostActions = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const PostImage = styled.img`
  max-width: 100%;
  border-radius: 12px;
  margin-top: 10px;
`;

const PostList = ({ setAuthenticated }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setError('Failed to fetch posts');
      setPosts([]);
    }
  };

  const handleToggleLike = async (postId, isLiked) => {
    try {
      await axios.post(
        `/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchPosts();
    } catch (error) {
      setError(isLiked ? 'Failed to unlike post' : 'Failed to like post');
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchPosts();
    } catch (error) {
      setError('Failed to delete post');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
    navigate('/');
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Container>
      <Header>
        <h2>Home</h2>
        <Button onClick={handleLogout}>Log out</Button>
      </Header>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button onClick={() => navigate('/create')} style={{ width: '100%', marginBottom: '20px' }}>
        Tweet
      </Button>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <Card key={post.id}>
            <PostMeta>
              <ProfileLink to={`/profile/${post.username}`}>{post.username}</ProfileLink> •{' '}
              {new Date(post.created_at).toLocaleString()}
            </PostMeta>
            <PostContent>{post.content}</PostContent>
            {post.image_url && <PostImage src={post.image_url} alt="Post" />}
            <PostActions>
              <Button onClick={() => handleToggleLike(post.id, post.isLiked)}>
                {post.isLiked ? 'Unlike' : 'Like'}
              </Button>
              <span>{post.likes} Likes</span>
              <Button onClick={() => handleDelete(post.id)}>Delete</Button>
            </PostActions>
          </Card>
        ))
      )}
    </Container>
  );
};

export default PostList;