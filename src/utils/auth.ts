import Cookies from 'js-cookie';
import type { User, JWTPayload } from '../types/auth';

const TOKEN_KEY = 'admin_token';

export const decodeJWT = (token: string): JWTPayload | null => {
    try {
        // Simple JWT decode (in production, use a proper JWT library)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

export const isTokenValid = (token: string): boolean => {
    const payload = decodeJWT(token);
    if (!payload) return false;

    // Vérifier si le token est expiré
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) return false;

    // Vérifier si l'utilisateur a le rôle 'ROLE_ADMIN'
    if (!payload.roles || !payload.roles.includes('ROLE_ADMIN')) {
        return false;
    }

    return true;
};

export const getUserFromToken = (token: string): User | null => {
    const payload = decodeJWT(token);
    if (!payload) return null;

    return {
        // Le champ userId n'existe plus, donc on remplace par username
        id: payload.username,  // Ici on utilise `username` qui est dans le payload
        email: payload.email,  // L'email est récupéré depuis le payload (si disponible)
        role: payload.roles.includes('ROLE_ADMIN') ? 'admin' : 'user',  // Assignation du rôle basé sur les rôles
        name: payload.username,  // Vous pouvez ajouter ici d'autres informations comme le nom, selon ce qui est stocké dans le token
    };
};

export const setAuthToken = (token: string): void => {
    Cookies.set(TOKEN_KEY, token, { expires: 7, secure: true, sameSite: 'strict' });
};

export const getAuthToken = (): string | null => {
    return Cookies.get(TOKEN_KEY) || null;
};

export const removeAuthToken = (): void => {
    Cookies.remove(TOKEN_KEY);
};

export const logout = (): void => {
    removeAuthToken();
    window.location.href = '/unauthorized';
};
