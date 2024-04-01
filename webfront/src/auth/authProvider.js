import { useContext, createContext, useState, useEffect } from 'react';

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => ''
})

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState('');

    function getAccessToken() {
        return accessToken
    }

    function saveUser(userData){
        setAccessToken();
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );  
}

export const useAuth = () => useContext(AuthContext);