import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, getPosts } from '../api';
import styled from 'styled-components';
const API_URL = import.meta.env.VITE_API_URL;

const ProfileContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 20px;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Username = styled.h2`
  margin: 0;
  color: #14171a;
`;

const Nickname = styled.h3`
  margin: 5px 0;
  color: #657786;
`;

const Bio = styled.p`
  margin: 5px 0;
  color: #14171a;
`;

const Input = styled.input`
  padding: 12px;
  margin: 10px 0;
  border-radius: 20px;
  border: 1px solid #e6ecf0;
  background-color: #f5f8fa;
  width: 100%;
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

const Profile = () => {
  const [profile, setProfile] = useState({ username: '', nickname: '', bio: '', profile_image: null });
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const profileData = await getProfile(token);
        setProfile(profileData);
        setNickname(profileData.nickname || '');
        setBio(profileData.bio || '');

        const userPosts = await getPosts(token, profileData.user_id);
        setPosts(Array.isArray(userPosts) ? userPosts : []);
      } catch (error) {
        setError('Failed to load profile or posts.');
      }
    };
    fetchProfileAndPosts();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await updateProfile(token, nickname, bio, profileImage);
      const updatedProfile = await getProfile(token);
      setProfile(updatedProfile);
      setError('');
      alert('Profile updated successfully!');
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile.');
    }
  };

  return (
    <ProfileContainer>
      <h2>Profile</h2>
      <ProfileHeader>
        <ProfileImage
          src={profile.profile_image ? `${API_URL}${profile.profile_image}` : 'https://via.placeholder.com/80'}
          alt="Profile"
        />
        <ProfileInfo>
          <Username>@{profile.username}</Username>
          <Nickname>{profile.nickname || 'No nickname'}</Nickname>
          <Bio>{profile.bio || 'No bio'}</Bio>
        </ProfileInfo>
      </ProfileHeader>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <TextArea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setProfileImage(e.target.files[0])}
        />
        <Button type="submit">Save Profile</Button>
      </form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <h3>Your Posts</h3>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <Tweet key={post.id}>
            <TweetHeader>
              <ProfileImage
                src={profile.profile_image ? `${API_URL}${profile.profile_image}` : 'https://via.placeholder.com/40'}
                alt="Profile"
                style={{ width: '40px', height: '40px' }}
              />
              <Nickname>{profile.nickname || profile.username}</Nickname>
            </TweetHeader>
            <TweetContent>{post.content}</TweetContent>
            {post.image_url && (
              <TweetImage src={`${API_URL}${post.image_url}`} alt="Post" />
            )}
          </Tweet>
        ))
      )}
    </ProfileContainer>
  );
};

export default Profile;