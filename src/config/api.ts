import axios from 'axios';

// Configuration de base d'Axios
//export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://educalogy.fr/apis';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/apis';

// Instance Axios configurée
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        console.log(token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expiré ou invalide
            localStorage.removeItem('admin_token');
            window.location.href = '/unauthorized';
        }
        return Promise.reject(error);
    }
);

// Types pour les réponses API
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: string[];
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Gestion des erreurs API
export const handleApiError = (error: any): string => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.response?.data?.errors?.length > 0) {
        return error.response.data.errors.join(', ');
    }
    if (error.message) {
        return error.message;
    }
    return 'Une erreur inattendue s\'est produite';
};