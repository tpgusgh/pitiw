import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api"; // 회원가입 API 함수
import styled from "styled-components";







const LoginLink = styled.p`
  text-align: center;
  margin-top: 10px;

  a {
    color: #007bff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

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



const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await signup(username, password);
      if (response.data) {
        navigate("/login"); // 회원가입 후 로그인 페이지로 리다이렉트
      }
    } catch (error) {
      setError("Error during sign up.");
    }
  };

  return (
    <FormContainer>
      <FormTitle>Sign Up</FormTitle>
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
        <Button type="submit">Sign Up</Button>
      </Form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <LoginLink>
        Already have an account? <Link to="/login">Login here</Link>
      </LoginLink>
    </FormContainer>
  );
};

export default Signup;
