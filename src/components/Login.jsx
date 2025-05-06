import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { login } from '../api';
import { Container, Button, Input, ErrorMessage, LinkStyled } from './StyledComponents';
import styled from 'styled-components';

const FormContainer = styled(Container)`
  max-width: 400px;
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  text-align: center;
  color: #14171a;
  font-size: 24px;
  margin-bottom: 20px;
`;

const Login = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setAuthenticated(true);
        navigate('/');
      } else {
        setError('No token received.');
      }
    } catch (error) {
      setError('Invalid credentials.');
    }
  };

  return (
    <FormContainer>
      <FormTitle>Sign in to X</FormTitle>
      <form onSubmit={handleSubmit}>
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
        <Button type="submit">Sign In</Button>
      </form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Don't have an account? <LinkStyled to="/signup">Sign up</LinkStyled>
      </p>
    </FormContainer>
  );
};

export default Login;