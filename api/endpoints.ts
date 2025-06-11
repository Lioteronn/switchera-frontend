export const API_BASE_URL = 'http://localhost:8000/api';

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/token/`,
  REFRESH: `${API_BASE_URL}/token/refresh/`,
  REGISTER: `${API_BASE_URL}/users/register/`,
};

export const SERVICE_ENDPOINTS = {
  SERVICES: `${API_BASE_URL}/users/services/`, // get all services or post a new service
  SERVICE_BY_ID: (serviceId: number) => `${API_BASE_URL}/users/services/${serviceId}/`, // get, update, patch, put or delete a service by its id
  SERVICE_REGISTER: (serviceId: number) => `${API_BASE_URL}/users/services/${serviceId}/register/`, // register user for a service
  SERVICE_UNREGISTER: (serviceId: number) => `${API_BASE_URL}/users/services/${serviceId}/unregister/`, // unregister user from a service
};

export const REGISTRATION_ENDPOINTS = {
  REGISTRATIONS: `${API_BASE_URL}/users/registrations/`, // get all registrations or create a new one
  REGISTRATION_BY_ID: (registrationId: string) => `${API_BASE_URL}/users/registrations/${registrationId}/`, // get, update, patch, put or delete a registration by its id
};

// Service categories enum
export const SERVICE_CATEGORIES = {
  EDUCATION: 'EDUCATION',
  HEALTH: 'HEALTH',
  TECHNOLOGY: 'TECHNOLOGY',
  ARTS: 'ARTS',
  SPORTS: 'SPORTS',
  OTHER: 'OTHER'
} as const;

// Service modalities enum
export const SERVICE_MODALITIES = {
  ONLINE: 'ONLINE',
  IN_PERSON: 'IN_PERSON',
  HYBRID: 'HYBRID'
} as const;

// Registration status enum
export const REGISTRATION_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
} as const;