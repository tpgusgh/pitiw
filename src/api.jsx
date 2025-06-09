import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const signup = async (username, password) => {
  try {
    const payload = { username, password };
    console.log('Signup payload:', payload);
    const response = await axios.post(
      `${API_URL}/signup`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('Signup response:', response.data);
    return response;
  } catch (error) {
    console.error('Signup error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const payload = { username, password };
    console.log('Login payload:', payload);
    const response = await axios.post(
      `${API_URL}/login`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('Login response:', response.data);
    return response;
  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getProfile = async (token, userId = null) => {
  try {
    console.log('Fetching profile with token:', token.slice(0, 10) + '...', 'userId:', userId);
    const url = userId ? `${API_URL}/profile/${userId}` : `${API_URL}/profile`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Get profile response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get profile error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};


export const updateProfile = async (token, nickname, bio, profileImage = null) => {
  try {
    const formData = new FormData();
    formData.append('nickname', nickname || '');
    formData.append('bio', bio || '');
    if (profileImage) {
      formData.append('profile_image', profileImage);
      console.log('Uploading profile image:', profileImage.name);
    }
    console.log('Update profile request:', [...formData.entries()]);
    const response = await axios.post(`${API_URL}/profile`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Update profile response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};


export const getPosts = async (token, userId = null) => {
  try {
    const params = userId ? { user_id: userId } : {};
    console.log('Fetching posts:', { userId });
    const response = await axios.get(`${API_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params,
    });
    console.log('Get posts response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get posts error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getLikedPosts = async (token) => {
  try {
    console.log('Fetching liked posts');
    const response = await axios.get(`${API_URL}/likes`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Get liked posts response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get liked posts error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const createPost = async (content, token, image = null) => {
  try {
    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
      console.log('FormData image:', image.name);
    }
    console.log('Sending create post request:', { content, image: image?.name });
    const response = await axios.post(`${API_URL}/posts`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Create post response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create post error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const deletePost = async (postId, token) => {
  try {
    console.log('Deleting post:', postId);
    const response = await axios.delete(`${API_URL}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Delete post response:', response.data);
    return response;
  } catch (error) {
    console.error('Delete post error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const likePost = async (postId, token) => {
  try {
    console.log('Toggling like for post:', postId);
    const response = await axios.post(
      `${API_URL}/posts/${postId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Like post response:', response.data);
    return response;
  } catch (error) {
    console.error('Like post error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const createComment = async (postId, content, token) => {
  try {
    console.log('Creating comment for post:', postId);
    const response = await axios.post(
      `${API_URL}/posts/${postId}/comments`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Create comment response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create comment error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getComments = async (postId, token) => {
  try {
    console.log('Fetching comments for post:', postId);
    const response = await axios.get(`${API_URL}/posts/${postId}/comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Get comments response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get comments error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};
export const followUser = async (token, userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/${userId}/follow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Follow user error:', error.response?.data);
    throw error;
  }
};

export const unfollowUser = async (token, userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/${userId}/unfollow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Unfollow user error:', error.response?.data);
    throw error;
  }
};

export const getAdminUsers = async (token) => {
  try {
    console.log('Fetching admin users with token:', token.slice(0, 10) + '...');
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Get admin users response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get admin users error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};


export const getFollowList = async (token, userId, type) => {
  try {
    const response = await axios.get(`${API_URL}/profile/${userId}/${type}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error.response?.data || error.message);
    throw error.response?.data?.error || `Failed to fetch ${type}.`;
  }
};