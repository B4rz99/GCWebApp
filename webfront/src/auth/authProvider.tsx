import { useContext, createContext, useState, useEffect } from 'react';
import type { AuthResponse, AccessTokenResponse, User } from './types';
import { API_URL } from './constants';

interface AuthProviderProps {
    children: React.ReactNode;
    }

const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => {},
    saveEmail: (emailData: AuthResponse) => {},
    getRefreshToken: () => {},
    getEmail: () => undefined,
    signOut: () => {},
});

export function AuthProvider ({children}: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string>('');
    const [email, setEmail] = useState<User>();

    useEffect(() => {}, []);

    async function requestNewAccessToken(refreshToken: string) {
        try {
            const response = await fetch(`${API_URL}/token/refreshToken`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ' ${refreshToken}`,
                },
            });

            if(response.ok) {
                const json = (await response.json()) as AccessTokenResponse;

                if(json.error) {
                    throw new Error(json.error);
                }
                return json.body.accessToken;
            } else {
                throw new Error('Failed to refresh token');
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async function getEmailInfo(accessToken: string) {
        try {
            const response = await fetch(`${API_URL}/api/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ' ${accessToken}`,
                },
            });

            if(response.ok) {
                const json = await response.json();

                if(json.error) {
                    throw new Error(json.error);
                }
                return json.body;
            } else {
                throw new Error('Failed to refresh token');
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }


    async function checkAuth() {
        if(accessToken) {

        } else {
            const token = getRefreshToken
            if (token) {
                const newAccessToken = await requestNewAccessToken(token);
                if(newAccessToken) {
                    const emailInfo = await getEmailInfo(newAccessToken);
                    if(emailInfo) {
                        saveSessionInfo(emailInfo, newAccessToken, token);
                    }
                }
            }
        }
    }

    function signOut() {
        setIsAuthenticated(false);
        setAccessToken('');
        setEmail('');
        localStorage.removeItem('token');
    }

    function saveSessionInfo(emailInfo: User, accessToken: string, refreshToken: string) {
        setAccessToken(accessToken);
        setEmail(emailInfo);
        localStorage.setItem('token', JSON.stringify(refreshToken));
        setIsAuthenticated(true);
    }

    function getAccessToken() {
        return accessToken;
    }

    function getRefreshToken(): string | null{
        const tokenData = localStorage.getItem('token');
        if (tokenData) {
            const { tokenData } = JSON.parse(tokenData);
            return tokenData;
        }
        return null;
    }

    function saveEmail(emailData: AuthResponse){
        saveSessionInfo(emailData.body, emailData.body.accessToken, emailData.body.refreshToken);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveEmail, getRefreshToken, signOut }}>
            {children}
        </AuthContext.Provider>
    );
    
}

export const useAuth = () => useContext(AuthContext);