import BACKEND_URL from "@/global";
import axios from "axios";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { useState, useEffect } from "react";

export enum Role {
    ADMIN,
    ANALYST,
    MODERATOR,
    USER,
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    user?: User;
    message?: string;
}

interface Session {
    token: string;
    user: User;
}

export interface User {
    username: string;
    role: Role;
}

export const Login = async (request: LoginRequest) : Promise<LoginResponse> => {
    const response = await axios.post(`${BACKEND_URL}/user/login`, request);
    let data = response.data;

    let success = data.success;

    if(!success)
    {
        return {
            success: false,
        };
    }

    let session: Session = data.session;
    setCookie('session', session, { secure: true });

    AuthManager.notify(session.user);

    return {
        success: data.success,
        user: session.user,
    };
};

export const Logout = async () => {
    AuthManager.notify(null);
    deleteCookie('session');
};

type UserType = User | null;

export const GetUser = async (): Promise<UserType> => {
    if(!hasCookie('session'))
        return null;

    let sessionCookie = getCookie('session', { secure: true })  as string;
    const session: Session = JSON.parse(sessionCookie) as Session;

    const response = await axios.get(`${BACKEND_URL}/user/auth?username=${session.user.username}&token=${session.token}`);
    const data = response.data;

    if(!data.success)
        return null;

    return data.user;
}

type AuthCallback = (user: UserType) => void;

export class AuthManager
{
    private static callbacks: AuthCallback[] = [];

    public static subscribe(callback: AuthCallback)
    {
        AuthManager.callbacks.push(callback);
    }

    public static notify(user: UserType)
    {
        this.callbacks.forEach(callback => {
            callback(user);
        });
    }
};

export const useAuth = () : UserType => {
    const [user, setUser] = useState<UserType>(null);

    useEffect(() => {
        function onAuth(user: UserType) {
            setUser(user as User);
        }

        AuthManager.subscribe(onAuth);
    });

    return user;
};