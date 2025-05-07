import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProfile, updateProfile, getPosts } from '../api';
import styled from 'styled-components';

const API_URL = import.meta.env.VITE_API_URL;

// 스타일 컴포넌트
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

const FollowInfo = styled.div`
  display: flex;
  margin: 10px 0;
`;

const FollowCount = styled.span`
  margin-right: 15px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
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

const FollowButton = styled(Button)`
  background-color: ${props => props.isFollowing ? '#ff3333' : '#1da1f2'};
  &:hover {
    background-color: ${props => props.isFollowing ? '#cc0000' : '#1991db'};
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
  const [profile, setProfile] = useState({ 
    username: '', 
    nickname: '', 
    bio: '', 
    profile_image: null,
    followers_count: 0,
    following_count: 0,
    is_following: false,
    user_id: null
  });
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { userId } = useParams();
  const currentUserId = parseInt(localStorage.getItem('user_id'));

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const profileData = await getProfile(token, userId);
        setProfile(profileData);
        setNickname(profileData.nickname || '');
        setBio(profileData.bio || '');

        const userPosts = await getPosts(token, userId || profileData.user_id);
        setPosts(Array.isArray(userPosts) ? userPosts : []);
      } catch (error) {
        console.error('Profile fetch error:', error.response?.data);
        setError('Failed to load profile or posts.');
      }
    };
    fetchProfileAndPosts();
  }, [navigate, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token || userId !== currentUserId.toString()) {
        setError('Unauthorized to update this profile.');
        return;
      }
      await updateProfile(token, nickname, bio, profileImage);
      const updatedProfile = await getProfile(token);
      setProfile(updatedProfile);
      setError('');
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error.response?.data);
      setError(error.response?.data?.error || 'Failed to update profile.');
    }
  };

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/follow/${profile.user_id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle follow');
      }
      
      const data = await response.json();
      setProfile(prev => ({
        ...prev,
        is_following: data.is_following,
        followers_count: data.followers_count
      }));
    } catch (error) {
      console.error('Follow error:', error);
      setError('Failed to toggle follow.');
    }
  };

  const navigateToFollowers = () => {
    navigate(`/profile/${profile.user_id}/followers`);
  };

  const navigateToFollowing = () => {
    navigate(`/profile/${profile.user_id}/following`);
  };

  return (
    <ProfileContainer>
      <h2>Profile</h2>
      <ProfileHeader>
        <ProfileImage
          src={profile.profile_image ? `${API_URL}${profile.profile_image}` : 'https://via.placeholder.com/80'}
          alt="Profile"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/80';
          }}
        />
        <ProfileInfo>
          <Username>@{profile.username || 'Unknown'}</Username>
          <Nickname>{profile.nickname || 'No nickname'}</Nickname>
          <Bio>{profile.bio || 'No bio'}</Bio>
          
          <FollowInfo>
            <FollowCount onClick={navigateToFollowers}>
              {profile.followers_count} Followers
            </FollowCount>
            <FollowCount onClick={navigateToFollowing}>
              {profile.following_count} Following
            </FollowCount>
          </FollowInfo>
          
          {userId && userId != currentUserId && (
            <FollowButton 
              isFollowing={profile.is_following}
              onClick={handleFollow}
            >
              {profile.is_following ? 'Unfollow' : 'Follow'}
            </FollowButton>
          )}
        </ProfileInfo>
      </ProfileHeader>

      {userId == currentUserId && (
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
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <h3>{userId == currentUserId ? 'Your Posts' : `${profile.username}'s Posts`}</h3>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <Tweet key={post.id}>
            <TweetHeader>
              <ProfileImage
                src={post.profile_image ? `${API_URL}${post.profile_image}` : 'https://via.placeholder.com/40'}
                alt="Profile"
                style={{ width: '40px', height: '40px' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/40';
                }}
              />
              <Nickname>{post.nickname || post.username || 'Unknown'}</Nickname>
            </TweetHeader>
            <TweetContent>{post.content || 'No content'}</TweetContent>
            {post.image_url && (
              <TweetImage
                src={`${API_URL}${post.image_url}`}
                alt="Post"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400';
                }}
              />
            )}
          </Tweet>
        ))
      )}
    </ProfileContainer>
  );
};

export default Profile;