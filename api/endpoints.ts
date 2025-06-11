export const API_BASE_URL = 'http://localhost:8000/api';

export const AUTH_ENDPOINTS = {
  REFRESH: `${API_BASE_URL}/token/refresh/`,
  LOGIN: `${API_BASE_URL}/token/`,
  REGISTER: `${API_BASE_URL}/register/`,
};

export const SERVICE_ENDPOINTS = {
  SERVICES: `${API_BASE_URL}/users/services/`, // get all services or post a new service
  SERVICE_BY_ID: (serviceId: string) => `${API_BASE_URL}/users/services/${serviceId}/`, // get, update, patch, put or delete a service by its id
}