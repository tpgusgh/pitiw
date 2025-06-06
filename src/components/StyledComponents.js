import styled from 'styled-components';
import {  Link } from 'react-router-dom';
export const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
`;

export const Card = styled.div`
  background: white;
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const Button = styled.button`
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #1a91da;
  }
  &:disabled {
    background-color: #a1d2f7;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  padding: 12px;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  margin: 10px 0;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #1da1f2;
  }
`;

export const Textarea = styled.textarea`
  padding: 12px;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  margin: 10px 0;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #1da1f2;
  }
`;

export const ErrorMessage = styled.p`
  color: #e0245e;
  font-size: 14px;
  text-align: center;
  margin: 10px 0;
`;

export const LinkStyled = styled(Link)`
  color: #1da1f2;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

export const ProfileLink = styled(LinkStyled)`
  font-size: 14px;
  color: #14171a;
  &:hover {
    color: #1da1f2;
  }
`;