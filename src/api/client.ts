import axios from 'axios';
import { keycloak } from '../auth/keycloak';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  if (keycloak.authenticated) {
    try {
      await keycloak.updateToken(30);
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    } catch (err) {
      console.warn('Token refresh failed', err);
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      keycloak.login();
    }
    return Promise.reject(error);
  }
);
