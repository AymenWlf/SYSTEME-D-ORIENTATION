import React from 'react';
import { Shield } from 'lucide-react';

export default function LoadingScreen() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                    <Shield className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Vérification des autorisations</h2>
                <p className="text-gray-600 mb-4">Authentification en cours...</p>
                <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>
        </div>
    );
}