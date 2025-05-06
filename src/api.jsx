import axios from "axios";

// 기본 URL 설정
const API_URL = "http://192.168.45.159:5000";  // 백엔드 서버 주소

export const signup = async (username, password) => {
  return await axios.post(`${API_URL}/signup`, {
    username,
    password,
  });
};

export const login = async (username, password) => {
  return await axios.post(`${API_URL}/login`, {
    username,
    password,
  });
};

export const createPost = async (content, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/posts`, // `/create-post` → `/posts`
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Create post error:', error.response || error.message);
    throw error;
  }
};

export const deletePost = async (postId, token) => {
  return await axios.delete(
    `${API_URL}/delete-post/${postId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const likePost = async (postId, token) => {
  return await axios.post(
    `${API_URL}/like-post/${postId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
