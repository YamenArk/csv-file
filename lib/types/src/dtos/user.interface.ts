export interface AuthLoginDto  {
    email: string;
    password: string;
    fcmToken?: string; 
}

export interface EmailDto  {
    email: string;
}

export interface RegistrationDto  {
    username: string;
    email: string;
    password: string;
    code: number
}


export interface UpdateFcmDto  {
    userId: number;
    fcmToken: string;
}