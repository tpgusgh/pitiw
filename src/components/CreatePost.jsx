import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api';
import styled from 'styled-components';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 12px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #e6ecf0;
  resize: none;
`;

const Input = styled.input`
  padding: 12px;
  margin: 10px 0;
  border-radius: 20px;
  border: 1px solid #e6ecf0;
  background-color: #f5f8fa;
`;

const Button = styled.button`
  padding: 12px;
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #1991db;
  }
`;

const ErrorMessage = styled.p`
  color: #ff3333;
  text-align: center;
`;

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Content is required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        navigate('/login');
        return;
      }
      console.log('Creating post:', { content, image: image?.name }); // 디버깅
      await createPost(content, token, image);
      console.log('Post created successfully');
      navigate('/');
    } catch (error) {
      console.error('Create post error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      setError(error.response?.data?.error || 'Failed to create post.');
    }
  };

  return (
    <FormContainer>
      <h2>Create a Tweet</h2>
      <form onSubmit={handleSubmit}>
        <TextArea
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            console.log('Selected file:', file?.name); // 디버깅
            setImage(file);
          }}
        />
        <Button type="submit">Tweet</Button>
      </form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormContainer>
  );
};

export default CreatePost;