import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api"; // 회원가입 API 함수
import styled from "styled-components";

// 스타일 정의
const FormContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #f4f4f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  text-align: center;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const Button = styled.button`
  padding: 10px;
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

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
        navigate("/"); // 회원가입 후 로그인 페이지로 리다이렉트
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
        Already have an account? <Link to="/">Login here</Link>
      </LoginLink>
    </FormContainer>
  );
};

export default Signup;
