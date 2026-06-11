import api from './api';
import Cookies from 'js-cookie';

export const auth = {
  async login(username, password) {
    const data = await api.post('/auth/login', { username, password });
    if (data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      Cookies.set('token', data.data.token, { expires: 7, sameSite: 'Lax' });
      Cookies.set('user', JSON.stringify(data.data.user), { expires: 7, sameSite: 'Lax' });
    }
    return data.data;
  },

  async register({ username, password, storeName }) {
    const data = await api.post('/auth/register', { username, password, storeName });
    if (data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      Cookies.set('token', data.data.token, { expires: 7, sameSite: 'Lax' });
      Cookies.set('user', JSON.stringify(data.data.user), { expires: 7, sameSite: 'Lax' });
    }
    return data.data;
  },

  async adminRegister({ username, password }) {
    const data = await api.post('/admin/register', { username, password });
    if (data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      Cookies.set('token', data.data.token, { expires: 7, sameSite: 'Lax' });
      Cookies.set('user', JSON.stringify(data.data.user), { expires: 7, sameSite: 'Lax' });
    }
    return data.data;
  },

  async getMe() {
    const data = await api.get('/auth/me');
    return data.data;
  },

  async changePassword(oldPassword, newPassword) {
    const data = await api.post('/auth/change-password', { oldPassword, newPassword });
    return data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Cookies.remove('token');
    Cookies.remove('user');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || Cookies.get('token') || null;
    }
    return null;
  },

  getUser() {
    if (typeof window !== 'undefined') {
      try {
        const userStr = localStorage.getItem('user') || Cookies.get('user');
        return userStr ? JSON.parse(userStr) : null;
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  isSeller() {
    const user = this.getUser();
    return user?.role === 'SELLER';
  },

  isAdmin() {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  },
};
