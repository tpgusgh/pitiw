import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProfile, updateProfile, getPosts, followUser, unfollowUser } from '../api';
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
`;

const Nickname = styled.h3`
  margin: 5px 0;
`;

const Bio = styled.p`
  margin: 5px 0;
  color: #333;
`;

const FollowStats = styled.div`
  display: flex;
  gap: 20px;
`;

const FollowCounter = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Input = styled.input`
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #e6ecf0;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #e6ecf0;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #1da1f2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #1a91da;
  }
`;

const FollowButton = styled(Button)`
  background-color: ${(props) => (props.isFollowing ? '#e6ecf0' : '#1da1f2')};
  color: ${(props) => (props.isFollowing ? '#14171a' : 'white')};
  &:hover {
    background-color: ${(props) => (props.isFollowing ? '#d4d9dd' : '#1a91da')};
  }
`;

const ErrorMessage = styled.p`
  color: #ff3333;
  text-align: center;
`;

const TweetStyled = styled.div`
  background-color: #fff;
  border: 1px solid #e6ecf0;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
`;

const PostContent = styled.p`
  margin: 10px 0;
`;

const PostImage = styled.img`
  max-width: 100%;
  border-radius: 8px;
`;

const Profile = () => {
  const [profile, setProfile] = useState({
    id: null,
    user_id: null,
    username: '',
    nickname: '',
    bio: '',
    profile_image: null,
    followers_count: 0,
    following_count: 0,
    posts_count: 0,
    is_following: false,
  });
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();
  const currentUserId = parseInt(localStorage.getItem('user_id'));

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in.');
          navigate('/login');
          return;
        }

        console.log('Fetching profile for userId:', userId, 'currentUserId:', currentUserId);
        const profileData = await getProfile(token, userId);
        console.log('Profile data:', profileData);
        setProfile({
          id: profileData.id || profileData.user_id,
          user_id: profileData.user_id || profileData.id,
          username: profileData.username || '',
          nickname: profileData.nickname || '',
          bio: profileData.bio || '',
          profile_image: profileData.profile_image,
          followers_count: profileData.followers_count || 0,
          following_count: profileData.following_count || 0,
          posts_count: profileData.posts_count || 0,
          is_following: profileData.is_following || false,
        });
        setNickname(profileData.nickname || '');
        setBio(profileData.bio || '');

        const userPosts = await getPosts(token, userId || profileData.id);
        console.log('User posts:', userPosts);
        setPosts(Array.isArray(userPosts) ? userPosts : []);
        setError('');
      } catch (error) {
        console.error('Profile fetch error:', error.response?.data || error.message);
        setError(error.response?.data?.error || 'Failed to load profile or posts.');
      }
    };
    fetchProfileAndPosts();
  }, [navigate, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }
      if (userId && parseInt(userId) !== currentUserId) {
        throw new Error('Unauthorized to update this profile.');
      }
      console.log('Submitting profile update:', { nickname, bio, profileImage: profileImage?.name });
      const updatedProfile = await updateProfile(token, nickname, bio, profileImage);
      console.log('Updated profile response:', updatedProfile);
      setProfile({
        id: updatedProfile.id || updatedProfile.user_id,
        user_id: updatedProfile.user_id || updatedProfile.id,
        username: updatedProfile.username || profile.username,
        nickname: updatedProfile.nickname || '',
        bio: updatedProfile.bio || '',
        profile_image: updatedProfile.profile_image,
        followers_count: updatedProfile.followers_count || profile.followers_count,
        following_count: updatedProfile.following_count || profile.following_count,
        posts_count: updatedProfile.posts_count || profile.posts_count,
        is_following: updatedProfile.is_following || profile.is_following,
      });
      setError('');
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to update profile.';
      setError(errorMsg);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        navigate('/login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFollow = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const prevIsFollowing = profile.is_following;
    const prevFollowersCount = profile.followers_count;

    setProfile((prev) => ({
      ...prev,
      is_following: !prevIsFollowing,
      followers_count: prevIsFollowing ? prevFollowersCount - 1 : prevFollowersCount + 1,
    }));

    try {
      const token = localStorage.getItem('token');
      if (!token || !profile.id || profile.id === currentUserId) {
        throw new Error('Cannot follow/unfollow yourself or unauthorized.');
      }
      const response = prevIsFollowing
        ? await unfollowUser(token, profile.id)
        : await followUser(token, profile.id);
      console.log('Follow response:', response);
      setProfile((prev) => ({
        ...prev,
        is_following: response.is_following,
        followers_count: response.followers_count,
      }));
      setError('');
    } catch (error) {
      console.error('Follow error:', error.response?.data || error.message);
      setProfile((prev) => ({
        ...prev,
        is_following: prevIsFollowing,
        followers_count: prevFollowersCount,
      }));
      setError(error.response?.data?.error || 'Failed to toggle follow.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToFollowers = () => {
    navigate(`/profile/${profile.id}/followers`);
  };

  const navigateToFollowing = () => {
    navigate(`/profile/${profile.id}/following`);
  };

  console.log('Rendering profile, isOwnProfile:', !userId || parseInt(userId) === currentUserId);

  return (
    <ProfileContainer>
      <h2>Profile</h2>
      <ProfileHeader>
        <ProfileImage
          src={profile.profile_image ? `${API_URL}${profile.profile_image}` : '/assets/fallback-profile.jpeg'}
          alt="Profile"
          onError={(e) => (e.target.src = '/assets/fallback-profile.jpeg')}
        />
        <ProfileInfo>
          <Username>@{profile.username || 'Unknown'}</Username>
          <Nickname>{profile.nickname || 'No nickname'}</Nickname>
          <Bio>{profile.bio || 'No bio'}</Bio>
          <FollowStats>
            <FollowCounter onClick={navigateToFollowers}>
              {profile.followers_count} Followers
            </FollowCounter>
            <FollowCounter onClick={navigateToFollowing}>
              {profile.following_count} Following
            </FollowCounter>
          </FollowStats>
          {userId && parseInt(userId) !== currentUserId && (
            <FollowButton
              isFollowing={profile.is_following}
              onClick={handleFollow}
              disabled={isSubmitting}
            >
              {profile.is_following ? 'Unfollow' : 'Follow'}
            </FollowButton>
          )}
        </ProfileInfo>
      </ProfileHeader>
      {!userId || parseInt(userId) === currentUserId ? (
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      ) : (
        <p>This is not your profile, so you cannot edit it.</p>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <h3>{!userId || parseInt(userId) === currentUserId ? 'Your Posts' : `${profile.username}'s Posts`}</h3>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <TweetStyled key={post.id}>
            <PostHeader>
              <ProfileImage
                src={post.profile_image ? `${API_URL}${post.profile_image}` : '/assets/fallback-profile.jpeg'}
                alt="Profile"
                onError={(e) => (e.target.src = '/assets/fallback-profile.jpeg')}
                style={{ width: '40px', height: '40px' }}
              />
              <Nickname>{post.nickname || post.username || 'Unknown'}</Nickname>
            </PostHeader>
            <PostContent>{post.content || 'No content'}</PostContent>
            {post.image_url && (
              <PostImage
                src={`${API_URL}${post.image_url}`}
                alt="Post Image"
                onError={(e) => (e.target.src = '/assets/fallback-profile.jpeg')}
              />
            )}
          </TweetStyled>
        ))
      )}
    </ProfileContainer>
  );
};

export default Profile;






