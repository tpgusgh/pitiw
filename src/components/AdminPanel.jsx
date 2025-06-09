import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminUsers } from '../api';  // api.js에서 추가된 함수 사용
import styled from 'styled-components';

const AdminContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('is_admin');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const data = await getAdminUsers(token);  // api.js 함수 사용
        setUsers(Array.isArray(data) ? data : []);
        setError('');
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please try again.');
      }
    };

    fetchUsers();
  }, [navigate]);

  return (
    <AdminContainer>
      <h2>Admin Panel</h2>
      {error && <p style={{ color: '#ff3333' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Nickname</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.nickname}</td>
              <td>{user.is_admin ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminContainer>
  );
};

export default AdminPanel;