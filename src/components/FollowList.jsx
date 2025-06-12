import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFollowList, followUser, unfollowUser } from '../api';
import styled from 'styled-components';
import backJpeg from '../assets/back.jpeg';

const FollowListContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e6ecf0;
`;

const UserImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.span`
  font-weight: bold;
`;

const FollowButton = styled.button`
  background-color: ${(props) => (props.isFollowing ? '#e6ecf0' : '#1da1f2')};
  color: ${(props) => (props.isFollowing ? '#14171a' : 'white')};
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => (props.isFollowing ? '#d4d9dd' : '#1a91da')};
  }
`;

const FollowList = () => {
  const { userId, type } = useParams(); // type은 'followers' 또는 'following'
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const currentUserId = parseInt(localStorage.getItem('user_id'));

  useEffect(() => {
    const fetchFollowList = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in.');
          return;
        }
        const data = await getFollowList(token, userId, type);
        setUsers(data.map(user => ({ ...user, isFollowing: user.is_following || false })));
        setError('');
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFollowList();
  }, [userId, type]);

  const handleFollowToggle = async (targetUserId) => {
    const token = localStorage.getItem('token');
    if (!token || !targetUserId || targetUserId === currentUserId) return;

    const isFollowing = users.find(u => u.id === targetUserId).isFollowing;
    const newIsFollowing = !isFollowing;
    setUsers(users.map(user =>
      user.id === targetUserId ? { ...user, isFollowing: newIsFollowing } : user
    ));

    try {
      const response = isFollowing
        ? await unfollowUser(token, targetUserId)
        : await followUser(token, targetUserId);
      setUsers(users.map(user =>
        user.id === targetUserId ? { ...user, isFollowing: response.is_following, followers_count: response.followers_count } : user
      ));
      setError('');
    } catch (error) {
      setUsers(users.map(user =>
        user.id === targetUserId ? { ...user, isFollowing: isFollowing } : user
      ));
      setError(error.response?.data?.error || 'Failed to toggle follow.');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <FollowListContainer>
      <h2>{type === 'followers' ? 'Followers' : 'Following'}</h2>
      {users.length === 0 ? (
        <p>No {type} found.</p>
      ) : (
        users.map(user => (
          <UserItem key={user.id}>
            <UserImage
              src={user.profile_image ? `${import.meta.env.VITE_API_URL}${user.profile_image}` :  backJpeg }
              alt={`${user.username}'s profile`}
              onError={(e) => (e.target.src =  backJpeg )}
            />
            <UserInfo>
              <UserName>@{user.username}</UserName>
              <span>{user.nickname || 'No nickname'}</span>
            </UserInfo>
            {user.id !== currentUserId && (
              <FollowButton
                isFollowing={user.isFollowing}
                onClick={() => handleFollowToggle(user.id)}
              >
                {user.isFollowing ? 'Unfollow' : 'Follow'}
              </FollowButton>
            )}
          </UserItem>
        ))
      )}
    </FollowListContainer>
  );
};

export default FollowList;