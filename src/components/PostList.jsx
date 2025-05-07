import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getPosts, deletePost, likePost, createComment, getComments } from '../api';
import styled from 'styled-components';
const API_URL = import.meta.env.VITE_API_URL;

const Timeline = styled.div`
  max-width: 600px;
  margin: 20px auto;
`;

const Tweet = styled.div`
  background-color: #ffffff;
  border: 1px solid #e6ecf0;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
`;

const TweetHeader = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
  cursor: pointer;
`;

const Username = styled.span`
  font-weight: bold;
  color: #14171a;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Nickname = styled.span`
  color: #657786;
  font-size: 14px;
  margin-left: 5px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Timestamp = styled.span`
  color: #657786;
  font-size: 14px;
  margin-left: 10px;
`;

const TweetContent = styled.p`
  margin: 10px 0;
  font-size: 16px;
  color: #14171a;
`;

const TweetImage = styled.img`
  max-width: 100%;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 8px 12px;
  background-color: ${(props) => (props.danger ? '#ff3333' : '#1da1f2')};
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    background-color: ${(props) => (props.danger ? '#cc0000' : '#1991db')};
  }
`;

const LikeButton = styled(Button)`
  display: flex;
  align-items: center;
  background-color: transparent;
  color: ${(props) => (props.isLiked ? '#ff3333' : '#657786')};
  &:hover {
    background-color: #f5f8fa;
    color: ${(props) => (props.isLiked ? '#cc0000' : '#1da1f2')};
  }
`;

const HeartIcon = styled.span`
  margin-right: 5px;
  font-size: 16px;
`;

const CreatePostButton = styled(Button)`
  margin-bottom: 20px;
`;

const CommentInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 20px;
  border: 1px solid #e6ecf0;
  background-color: #f5f8fa;
`;

const CommentSection = styled.div`
  margin-top: 10px;
  border-top: 1px solid #e6ecf0;
  padding-top: 10px;
`;

const Comment = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const CommentContent = styled.p`
  margin: 5px 0;
  font-size: 14px;
  color: #14171a;
  flex: 1;
`;

const ErrorMessage = styled.p`
  color: #ff3333;
  text-align: center;
`;

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUserId = parseInt(localStorage.getItem('user_id'));

  useEffect(() => {
    const fetchPostsAndComments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in.');
          navigate('/login');
          return;
        }
        const fetchedPosts = await getPosts(token);
        console.log('Fetched posts:', fetchedPosts); // 디버깅
        setPosts(Array.isArray(fetchedPosts) ? fetchedPosts : []);

        const commentsData = {};
        for (const post of fetchedPosts) {
          const postComments = await getComments(post.id, token);
          console.log(`Comments for post ${post.id}:`, postComments); // 디버깅
          commentsData[post.id] = Array.isArray(postComments) ? postComments : [];
        }
        setComments(commentsData);
        setError('');
      } catch (error) {
        console.error('Fetch error:', error.response?.data, error.message); // 디버깅
        setError(error.response?.data?.error || 'Failed to fetch posts or comments.');
      }
    };
    fetchPostsAndComments();
  }, [navigate]);

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await deletePost(postId, token);
      setPosts(posts.filter((post) => post.id !== postId));
      setComments((prev) => {
        const updated = { ...prev };
        delete updated[postId];
        return updated;
      });
    } catch (error) {
      console.error('Delete error:', error.response?.data); // 디버깅
      setError(error.response?.data?.error || 'Failed to delete post.');
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      const token = localStorage.getItem('token');
      await likePost(postId, token);
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !isLiked,
                likes: isLiked ? post.likes - 1 : post.likes + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error('Like error:', error.response?.data); // 디버깅
      setError(error.response?.data?.error || 'Failed to toggle like.');
    }
  };

  const handleCommentSubmit = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const content = newComment[postId]?.trim();
      if (!content) {
        setError('Comment cannot be empty.');
        return;
      }
      const createdComment = await createComment(postId, content, token);
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), createdComment],
      }));
      setNewComment((prev) => ({ ...prev, [postId]: '' }));
      setError('');
    } catch (error) {
      console.error('Comment error:', error.response?.data); // 디버깅
      setError(error.response?.data?.error || 'Failed to create comment.');
    }
  };

  return (
    <Timeline>
      <h2>Home</h2>
      <CreatePostButton as={Link} to="/create-post">
      
        Write a post
      </CreatePostButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <Tweet key={post.id}>
            <TweetHeader>
              <Link to={`/profile/${post.user_id}`} onClick={() => console.log('Navigating to profile:', post.user_id)}>
                <ProfileImage
                  src={
                    post.profile_image
                      ? `${API_URL}${post.profile_image}`
                      : 'https://via.placeholder.com/40'
                  }
                  alt="Profile"
                  onError={() => console.log('Profile image failed:', post.profile_image)}
                />
              </Link>
              <Link to={`/profile/${post.user_id}`} onClick={() => console.log('Navigating to profile:', post.user_id)}>
                <Username>{post.nickname || post.username || 'Unknown'}</Username>
                <Nickname>@{post.username || 'unknown'}</Nickname>
              </Link>
              <Timestamp>{new Date(post.created_at).toLocaleString()}</Timestamp>
            </TweetHeader>
            <TweetContent>{post.content || 'No content'}</TweetContent>
            {post.image_url && (
              <TweetImage
                src={`${API_URL}${post.image_url}`}
                alt="Post"
                onError={() => console.log('Post image failed:', post.image_url)}
              />
            )}
            <div>
              <LikeButton
                isLiked={post.isLiked}
                onClick={() => handleLike(post.id, post.isLiked)}
              >
                <HeartIcon>{post.isLiked ? '❤️' : '🤍'}</HeartIcon>
                {post.likes} {post.isLiked ? 'Unlike' : 'Like'}
              </LikeButton>
              {post.user_id === currentUserId && (
                <Button danger onClick={() => handleDelete(post.id)}>
                  Delete
                </Button>
              )}
            </div>
            <CommentSection>
              <CommentInput
                type="text"
                placeholder="Write a comment..."
                value={newComment[post.id] || ''}
                onChange={(e) =>
                  setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))
                }
              />
              <Button onClick={() => handleCommentSubmit(post.id)}>Comment</Button>
              {comments[post.id]?.length > 0 && (
                <div>
                  {comments[post.id].map((comment) => (
                    <Comment key={comment.id}>
                      <Link to={`/profile/${comment.user_id}`} onClick={() => console.log('Navigating to profile:', comment.user_id)}>
                        <ProfileImage
                          src={
                            comment.profile_image
                              ? `${API_URL}${comment.profile_image}`
                              : 'https://via.placeholder.com/40'
                          }
                          alt="Profile"
                          onError={() => console.log('Comment profile image failed:', comment.profile_image)}
                        />
                      </Link>
                      <div>
                        <Link to={`/profile/${comment.user_id}`} onClick={() => console.log('Navigating to profile:', comment.user_id)}>
                          <Username>{comment.nickname || comment.username || 'Unknown'}</Username>
                          <Nickname>@{comment.username || 'unknown'}</Nickname>
                        </Link>
                        <CommentContent>{comment.content}</CommentContent>
                      </div>
                    </Comment>
                  ))}
                </div>
              )}
            </CommentSection>
          </Tweet>
        ))
      )}
    </Timeline>
  );
};

export default PostList;