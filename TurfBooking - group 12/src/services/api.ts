import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ensure data is serializable before sending
const serializeData = (data: any) => {
  return JSON.parse(JSON.stringify(data));
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data) {
    config.data = serializeData(config.data);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data) {
      return { ...response, data: serializeData(response.data) };
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User activity interface
export interface ActivityData {
  day: string;
  date: string;
  bookings: number;
}

// Booking interface
export interface Booking {
  id: string;
  turf: {
    name: string;
    location: string;
  };
  date: string;
  timeSlot: string;
  price: number;
  createdAt: string;
}

export const getUserActivity = async (): Promise<ActivityData[]> => {
  try {
    const response = await api.get('/users/activity');
    return response.data;
  } catch (error) {
    console.error('Error fetching user activity:', error);
    return [];
  }
};

export const getUserBookings = async (): Promise<Booking[]> => {
  try {
    const response = await api.get('/bookings/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return [];
  }
};

// Rest of your API functions remain the same
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateUserProfile = async (data: any) => {
  const response = await api.put('/users/profile', data);
  return response.data;
};

export const getTurfs = async () => {
  const response = await api.get('/turfs');
  return response.data;
};

export const createTurf = async (data: any) => {
  const response = await api.post('/turfs', data);
  return response.data;
};

export const updateTurf = async (id: string, data: any) => {
  const response = await api.put(`/turfs/${id}`, data);
  return response.data;
};

export const deleteTurf = async (id: string) => {
  const response = await api.delete(`/turfs/${id}`);
  return response.data;
};

export const bookTurf = async (turfId: string, date: string, timeSlot: string) => {
  const response = await api.post('/bookings', { turfId, date, timeSlot });
  return response.data;
};

export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getBookingAnalytics = async () => {
  const response = await api.get('/admin/analytics/bookings');
  return response.data;
};

export const getRevenueAnalytics = async () => {
  const response = await api.get('/admin/analytics/revenue');
  return response.data;
};

export const getUserAnalytics = async () => {
  const response = await api.get('/admin/analytics/users');
  return response.data;
};

export const getTurfAnalytics = async () => {
  const response = await api.get('/admin/analytics/turfs');
  return response.data;
};

export default api;