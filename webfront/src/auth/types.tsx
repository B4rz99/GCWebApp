export interface AuthResponse {
    body: {
        email: Email;
        accessToken: string;
        refreshToken: string;
    };
}

export interface AuthResponseError {
    body: {
        error: string;
    };
}

export interface User {
    id: number;
    name: string;
    lastName: string;
    email: string;
}
