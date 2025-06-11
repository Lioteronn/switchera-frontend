export const API_BASE_URL = 'http://localhost:8080/api/';

export const AUTH_ENDPOINTS = {
  REFRESH: `${API_BASE_URL}/token/refresh`,
  LOGIN: `${API_BASE_URL}/token`,
  //Logout vacia el token del localStorage
  REGISTER: `${API_BASE_URL}/register`,
};
