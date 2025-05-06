import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import styled from 'styled-components';

const FormContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  text-align: center;
  color: #1da1f2;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 12px;
  margin: 10px 0;
  border-radius: 20px;
  border: 1px solid #e6ecf0;
  background-color: #f5f8fa;
  color: #14171a;
  &:focus {
    outline: none;
    border-color: #1da1f2;
  }
`;

const Button = styled.button`
  padding: 12px;
  margin-top: 10px;
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
  font-size: 14px;
`;

const SignupLink = styled.p`
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #14171a;
  a {
    color: #1da1f2;
    text-decoration: none;
    font-weight: bold;
  }
  a:hover {
    text-decoration: underline;
  }
`;
const Login = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      console.log('Sending login request:', { username, password }); // 디버깅
      const response = await login(username, password);
      console.log('Login response:', response.data); // 디버깅
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setAuthenticated(true);
        navigate('/');
      } else {
        setError('No token received from server.');
      }
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      setError(
        error.response?.data?.error || 'Invalid credentials. Please try again.'
      );
    }
  };

  return (
    <FormContainer>
      <FormTitle>Login to X</FormTitle>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Login</Button>
      </Form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <SignupLink>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </SignupLink>
    </FormContainer>
  );
};

export default Login;