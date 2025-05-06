import React, { useState, useEffect } from "react";
import { createPost, deletePost, likePost } from "../api";
import styled from "styled-components";

const PostContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #f4f4f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Post = styled.div`
  background-color: #fff;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
`;

const PostContent = styled.p``;

const LikeButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-top: 5px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #e60000;
  }
`;

const Home = ({ token }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    // 서버에서 글 목록을 가져오는 코드
    // 여기서는 dummy data로 대체합니다.
    setPosts([
      { id: 1, content: "Hello, World!", liked: false },
      { id: 2, content: "Another post", liked: false },
    ]);
  }, []);

  const handleCreatePost = async () => {
    try {
      await createPost(newPost, token);
      setPosts([...posts, { id: posts.length + 1, content: newPost }]);
      setNewPost("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId, token);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await likePost(postId, token);
      setPosts(posts.map((post) =>
        post.id === postId ? { ...post, liked: !post.liked } : post
      ));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <PostContainer>
      <input
        type="text"
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="Write a new post"
      />
      <button onClick={handleCreatePost}>Create Post</button>
      {posts.map((post) => (
        <Post key={post.id}>
          <PostContent>{post.content}</PostContent>
          <LikeButton onClick={() => handleLikePost(post.id)}>
            {post.liked ? "Unlike" : "Like"}
          </LikeButton>
          <button onClick={() => handleDeletePost(post.id)}>Delete</button>
        </Post>
      ))}
    </PostContainer>
  );
};

export default Home;
