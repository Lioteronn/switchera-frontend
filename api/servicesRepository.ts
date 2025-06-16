import { profileApi } from '@/api/profile';
import axiosInstance from './axiosInstance';
import { handleApiError } from './utils';

const SERVICES_ENDPOINTS_LIST = {
  READ: `/users/services/`, // GET users_services_list - Obtiene la lista de servicios
  UPDATE: `/users/services`, // POST users_services_create - Actualiza un servicio
  READ_ID: (id: string) => `/users/services/${id}/`, // GET users_services_detail - Obtiene un servicio por ID
  UPDATE_ID: (id: string) => `/users/services/${id}/`, // PUT users_services_update - Actualiza un servicio por ID
  PARTIAL_UPDATE: (id: string) => `/users/services/${id}`, // PATCH users_services_partial_update - Actualiza parcialmente un servicio por ID
};

const SERVICES_ENDPOINT_CREATION = {
  CREATE: `/users/services/create/`, // POST users_services_create_create - Crea un servicio
  DELETE: (id: string) => `/users/services/${id}/` // DELETE users_services_delete - Elimina un servicio por ID
};

const SERVICES_ENDPOINT_REGISTRATION = {
  REGISTER: (id: string) => `/users/services/${id}/register/`, // POST users_services_register - Registra un servicio a un usuario por ID
  UNREGISTER: (id: string) => `/users/services/${id}/unregister/` // POST users_services_unregister - Desregistra un servicio a un usuario por ID
};

export interface CreateServiceRequest {
  title: string;
  description: string;
  price: number;
  duration: 30 | 45 | 60 | 90;
  modality: 'online' | 'in-person' | 'both';
  tags: string[];
  category: string;

  //Datos obetnidos del usuario autenticado
  id?: string; // ID del servicio (opcional, para actualizaciones)
  user_id?: string; // ID del usuario (opcional, para actualizaciones)
  user_image?: string; // Imagen del usuario (opcional, para actualizaciones)
  user_name?: string; // Nombre del usuario (opcional, para actualizaciones)
  rating?: number; // Calificación del servicio (opcional, para actualizaciones)
  ratings_count?: number; // Cantidad de calificaciones del servicio (opcional, para actualizaciones)
  image_url?: string; // URL de la imagen del servicio (opcional, para actualizaciones)
  status?: string; // Estado del servicio (opcional, para actualizaciones)
  is_booked?: boolean; // Indica si el servicio está reservado (opcional, para actualizaciones)
  is_saved?: boolean; // Indica si el servicio está guardado (opcional, para actualizaciones)
  time_availability?: string; // Disponibilidad horaria del servicio (opcional, para actualizaciones)

} 

export interface Service {
  id: string;
  user_id: string;
  user_image: string;
  user_name: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  ratings_count: number;
  duration: 30 | 45 | 60 | 90;
  modality: 'online' | 'in-person' | 'both';
  tags: string[];
  category: string;
  image_url: string;
  status: string;
  is_booked: boolean;
  is_registered: boolean;
  time_availability: string;
}

export const ServicesRepository = {
  // Crear un nuevo servicio
  create: async (serviceData: CreateServiceRequest) => {
    try {
      // Obtener datos del usuario autenticado
      const userProfileResponse = await profileApi.getMyProfile();
      if (!userProfileResponse?.data) {
        throw new Error('Failed to get user profile');
      }
      const userProfile = userProfileResponse.data;

      // Completar el objeto con datos reales del usuario
      const completeServiceData = {
        title: serviceData.title,
        description: serviceData.description,
        price: serviceData.price,
        duration: serviceData.duration,
        modality: serviceData.modality,
        tags: serviceData.tags,
        category: serviceData.category,
        time_availability: serviceData.time_availability || '',
        id: serviceData.id || '', // ID del servicio (opcional, para actualizaciones)
        user_id: userProfile.id?.toString() || '',
        user_name: userProfile.name || userProfile.name || 'Usuario',
        user_image: userProfile.profile_image || userProfile.image || '',
        rating: 0,
        ratings_count: 0,
        image_url: serviceData.image_url || '',
        status: 'active',
        is_booked: false,
        is_saved: false,
      };

      return handleApiError(async () => {
        const response = await axiosInstance.post(SERVICES_ENDPOINT_CREATION.CREATE, completeServiceData);
        return response;
      });
    } catch (error) {
      throw error;
    }
  },

  // Obtener lista de servicios
  getAll: async (params?: { category?: string; search?: string; page?: number }) => {
    return handleApiError(async () => {
      return await axiosInstance.get(SERVICES_ENDPOINTS_LIST.READ, { params });
    });
  },

  // Obtener servicio por ID
  getById: async (id: string) => {
    return handleApiError(async () => {
      return await axiosInstance.get(SERVICES_ENDPOINTS_LIST.READ_ID(id));
    });
  },

  // Actualizar servicio (identificado por ID)
  update: async (id: string, serviceData: Partial<CreateServiceRequest>) => {
    return handleApiError(async () => {
      return await axiosInstance.put(SERVICES_ENDPOINTS_LIST.UPDATE_ID(id), serviceData);
    });
  },

  // Eliminar servicio (identificado por ID)
  delete: async (id: string) => {
    return handleApiError(async () => {
      return await axiosInstance.delete(SERVICES_ENDPOINT_CREATION.DELETE(id));
    });
  },

  // Obtener mis servicios (del usuario autenticado)
  getMyServices: async () => {
    return handleApiError(async () => {
      return await axiosInstance.get(SERVICES_ENDPOINTS_LIST.READ + `?owner=me`);
    });
  },

  // Alias para getAll
  listServices: async (params?: { category?: string; search?: string; page?: number }) => {
    return ServicesRepository.getAll(params);
  },

  // Alias para create
  createService: async (serviceData: CreateServiceRequest) => {
    return ServicesRepository.create(serviceData);
  },

  // Registrar usuario a un servicio
  registerForService: async (serviceId: string) => {
    return handleApiError(async () => {
      return await axiosInstance.post(SERVICES_ENDPOINT_REGISTRATION.REGISTER(serviceId));
    });
  },

  // Desregistrar usuario de un servicio
  unregisterFromService: async (serviceId: string) => {
    return handleApiError(async () => {
      return await axiosInstance.post(SERVICES_ENDPOINT_REGISTRATION.UNREGISTER(serviceId));
    });
  },
};
