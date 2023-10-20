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

export const Register = async (request: LoginRequest) : Promise<LoginResponse> => {
    try
    {
        const response = await axios.post(`${BACKEND_URL}/user/register`, request);
        let data = response.data;

        let success = data.success;

        if(!success)
        {
            return data;
        }

        let session: Session = data.session;
        setCookie('session', session, { secure: true });

        AuthManager.notify(session.user);

        return {
            success: data.success,
            user: session.user,
        };
    } catch(err) {
        return {
            success: false,
            message: "Failed to register account.",
        };
    }
}

export const Login = async (request: LoginRequest) : Promise<LoginResponse> => {
    try
    {
        const response = await axios.post(`${BACKEND_URL}/user/login`, request);
        let data = response.data;

        let success = data.success;

        if(!success)
        {
            return data;
        }

        let session: Session = data.session;
        setCookie('session', session, { secure: true });

        AuthManager.notify(session.user);

        return {
            success: data.success,
            user: session.user,
        };
    } catch(err) {
        return {
            success: false,
            message: "Failed to authenticate user.",
        };
    }
};

export const Logout = async () => {
    AuthManager.notify(null);
    deleteCookie('session');
};

type UserType = User | null;

const GetUser = async (): Promise<UserType> => {
    if(!hasCookie('session'))
        return null;

    let sessionCookie = getCookie('session', { secure: true })  as string;
    const session: Session = JSON.parse(sessionCookie) as Session;

    try {
        const response = await axios.get(`${BACKEND_URL}/user/auth?username=${session.user.username}&token=${session.token}`);
        const data = response.data;
    
        if(!data.success)
            return null;
    
        return data.user;
    } catch (err) {
        return null;
    }
}

type AuthCallback = (user: UserType) => void;

class AuthManager
{
    private static callbacks: AuthCallback[] = [];
    private static interval: NodeJS.Timeout;

    public static subscribe(callback: AuthCallback)
    {
        AuthManager.callbacks.push(callback);
    }

    private static check() {
        GetUser().then((user) => {
            this.notify(user);
        });
    }

    public static notify(user: UserType)
    {
        this.callbacks.forEach(callback => {
            callback(user);
        });

        if(user !== undefined && user !== null)
        {
            this.interval = setInterval(() => {
                this.check();
            }, 60 * 1000);
        }
        else
        {
            clearInterval(this.interval);
        }
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