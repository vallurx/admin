export interface LoginResponse {
    id: number;
    session_id: string;
    status: 'OK' | '2FA';
}

export interface User {
    id: number;
    name: string;
    email: string;
    company_name: string;
    role: number;
}