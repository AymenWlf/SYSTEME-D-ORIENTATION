import React from 'react';
import { ShieldX, ArrowLeft, Mail } from 'lucide-react';

export default function UnauthorizedPage() {
    const handleGoBack = () => {
        window.history.back();
    };

    const handleContactAdmin = () => {
        window.location.href = 'mailto:admin@example.com?subject=Demande d\'accès à la plateforme d\'administration';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                    <ShieldX className="w-10 h-10 text-red-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Accès Non Autorisé
                </h1>

                <p className="text-gray-600 mb-2">
                    Vous n'avez pas les autorisations nécessaires pour accéder à cette plateforme d'administration.
                </p>

                <p className="text-sm text-gray-500 mb-8">
                    Seuls les administrateurs avec un token JWT valide peuvent accéder à cette interface.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={handleGoBack}
                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour
                    </button>

                    <button
                        onClick={() => {
                            // Activer le mode test pour bypasser l'authentification
                            localStorage.setItem('test_mode_bypass', 'true');

                            // Recharger la page pour déclencher l'authentification
                            window.location.reload();
                        }}
                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                        🧪 Bouton Test (Développement)
                    </button>

                    <button
                        onClick={handleContactAdmin}
                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Mail className="w-4 h-4 mr-2" />
                        Contacter l'administrateur
                    </button>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">
                        Comment accéder à la plateforme ?
                    </h3>
                    <p className="text-xs text-blue-700">
                        Utilisez le lien fourni par votre administrateur système qui contient votre token d'authentification.
                    </p>
                </div>

                <div className="mt-6 text-xs text-gray-400">
                    <p>Code d'erreur: 401 - Unauthorized Access</p>
                    <p>Plateforme d'Administration des Notifications</p>
                </div>
            </div>
        </div>
    );
}