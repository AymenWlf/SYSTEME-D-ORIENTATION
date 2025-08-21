export interface User {
    id: string;
    email: string;
    role: 'admin' | 'user';
    name: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
}

export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    name: string;
    exp: number;
    iat: number;
}