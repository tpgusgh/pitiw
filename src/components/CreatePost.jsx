import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api';
import { Container, Button, Textarea, ErrorMessage } from './StyledComponents';
import styled from 'styled-components';

const FormContainer = styled(Container)`
  background: white;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e1e8ed;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  border-radius: 12px;
  margin-top: 10px;
`;

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      const response = await createPost(formData, token);
      setContent('');
      setImage(null);
      setImagePreview(null);
      navigate('/');
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to create post. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <FormContainer>
      <h2>What's happening?</h2>
      <form onSubmit={handleSubmit}>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          rows="4"
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && <ImagePreview src={imagePreview} alt="Preview" />}
        <Button type="submit" disabled={!content && !image}>
          Tweet
        </Button>
      </form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormContainer>
  );
};

export default CreatePost;