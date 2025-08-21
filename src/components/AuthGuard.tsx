import React, { useEffect, useState } from 'react';
import { getAuthToken, isTokenValid, getUserFromToken, setAuthToken } from '../utils/auth';  // Ces fonctions devraient être implémentées dans un fichier utilitaire
import UnauthorizedPage from './UnauthorizedPage.tsx';
import LoadingScreen from './LoadingScreen';
import type { User } from '../types/auth';

interface AuthGuardProps {
    children: React.ReactNode;
    onAuthSuccess: (user: User) => void;
}

export default function AuthGuard({ children, onAuthSuccess }: AuthGuardProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            // Vérifier les paramètres de l'URL pour récupérer le token
            const urlParams = new URLSearchParams(window.location.search);
            const tokenFromUrl = urlParams.get('token');

            // Récupérer le token depuis l'URL ou le localStorage
            const token = tokenFromUrl || getAuthToken();

            if (!token) {
                setIsAuthorized(false);
                setIsLoading(false);
                return;
            }

            // Valider le token JWT
            if (!isTokenValid(token)) {
                setIsAuthorized(false);
                setIsLoading(false);
                return;
            }

            // Extraire les informations utilisateur du token
            const user = getUserFromToken(token);
            if (!user || user.role !== 'admin') {
                setIsAuthorized(false);
                setIsLoading(false);
                return;
            }

            // Si le token vient de l'URL, on le sauvegarde dans localStorage
            if (tokenFromUrl) {
                setAuthToken(tokenFromUrl);

                // Nettoyer l'URL sans recharger la page
                const newUrl = window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);
            }

            // Authentification réussie
            setIsAuthorized(true);
            onAuthSuccess(user);
            setIsLoading(false);
        };

        checkAuth();
    }, [onAuthSuccess]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!isAuthorized) {
        return <UnauthorizedPage />;
    }

    return <>{children}</>;
}
