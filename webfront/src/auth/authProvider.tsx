import React, { createContext, useContext, useState } from 'react';

// Definición de los tipos de datos
interface UserData {
    accessToken: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    setAuthenticated: (status: boolean) => void;
    getAccessToken: () => string;
    saveUser: (userData: UserData) => void;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

// Crear el contexto de autenticación
const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    setAuthenticated: () => {},
    getAccessToken: () => '',
    saveUser: () => {}
});

// Componente del proveedor de autenticación
export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string>('');

    // Obtener el token de acceso
    function getAccessToken(): string {
        return accessToken;
    }

    // Guardar los datos del usuario (incluido el token de acceso)
    function saveUser(userData: UserData): void {
        // Guardar el token de acceso en las cookies o localStorage
        setAccessToken(userData.accessToken);
        setIsAuthenticated(true);
    }

    // Establecer el estado de autenticación
    function setAuthenticated(status: boolean): void {
        setIsAuthenticated(status);
    }

    // Valor del contexto de autenticación
    const authContextValue: AuthContextType = {
        isAuthenticated,
        setAuthenticated,
        getAccessToken,
        saveUser
    };

    // Renderizar el proveedor de autenticación con el contexto proporcionado
    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para usar el contexto de autenticación
export const useAuth = (): AuthContextType => useContext(AuthContext);
