export interface LoginResponse {
    id: number;
    session_id: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    company_name: string;
    role: number;
}