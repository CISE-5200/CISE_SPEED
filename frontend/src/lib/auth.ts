import BACKEND_URL from "@/global";
import axios from "axios";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
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

const GetSession = () : Session | null => {
    if(!hasCookie('session'))
        return null;

    let sessionCookie = getCookie('session', { secure: true })  as string;

    if(sessionCookie === undefined)
        return null;

    return JSON.parse(sessionCookie) as Session;
}

const GetUser = async(): Promise<UserType> => {
    return GetUserFromSession(GetSession());
};

const GetUserFromSession = async (session: Session | null): Promise<UserType> => {
    if(session === null)
        return null;

    try {
        const response = await axios.get(`${BACKEND_URL}/user/auth?token=${session.token}`);
        const data = response.data;
    
        if(!data.success)
            return null;
    
        return data.user;
    } catch (err) {
        return null;
    }
}

const GetUserFromContext = async(ctx: GetServerSidePropsContext): Promise<UserType> => {
    let sessionCookie = ctx.req.cookies['session'];

    if(sessionCookie === undefined)
        return null;

    let session = JSON.parse(sessionCookie) as Session;

    return GetUserFromSession(session);
};

type AuthCallback = (user: UserType) => void;

class AuthManager
{
    private static callbacks: AuthCallback[] = [];
    private static interval: NodeJS.Timeout;

    public static subscribe(callback: AuthCallback)
    {
        AuthManager.callbacks.push(callback);
    
        if(AuthManager.callbacks.length == 1) // Check for first time.
            this.check();
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

export enum RequestType {
    POST,
    GET,
};

interface Query {
    key: string;
    value: string;
};

const queriesToString = (queries: Query[]): string => {
    return queries.map(query => `${query.key}=${query.value}`).join("&");
}

export const makeAuthRequest = async (uri: string, reqType: RequestType, user: UserType = useAuth(), data: any = {}, queries?: Query[]) : Promise<any> => {
    const session = GetSession();

    if(session !== null)
    {
        let response = null;

        try
        {
            switch(reqType)
            {
                case RequestType.POST:
                    response = await axios.post(`${BACKEND_URL}${uri}?token=${session.token}${queries !== undefined && queries !== null && queries.length > 0 ? `&${queriesToString(queries)}` : ``}`, data);
                    break;
                case RequestType.GET:
                    response = await axios.get(`${BACKEND_URL}${uri}?token=${session.token}${queries !== undefined && queries !== null && queries.length > 0 ? `&${queriesToString(queries)}` : ``}`);
                    break;
            }
        }
        catch (err)
        {

        }

        if(response !== null && response.data.success)
            return response.data;
    }

    return {
        success: false,
    };
}

export const makeRequest = async (uri: string, reqType: RequestType, data: any = {}, queries?: Query[]) : Promise<any> => {
    try
    {
        let response = null;

        switch(reqType)
        {
            case RequestType.POST:
                response = await axios.post(`${BACKEND_URL}${uri}?${queries !== undefined && queries !== null && queries.length > 0 ? `&${queriesToString(queries)}` : ``}`, data);
                break;
            case RequestType.GET:
                response = await axios.get(`${BACKEND_URL}${uri}?${queries !== undefined && queries !== null && queries.length > 0 ? `&${queriesToString(queries)}` : ``}`);
                break;
        }

        return response.data;
    }
    catch (err)
    {

    }

    return {
        success: false,
    };
}

export interface Request {
    update: () => void;
    data?: any;
};

export const useAuthRequest = (uri: string, reqType: RequestType, user: UserType = useAuth(), data: any = {}, queries?: Query[]) : Request => {
    const requestData = () => {
        const session = GetSession();

        if(session === null)
        {
            setResponseData({
                update: requestData,
            });
        }
        else
        {
            const handleData = (responseData: any) => {
                if(!responseData.success)
                {
                    setResponseData({
                        update: requestData,
                    });
                }
                else
                {
                    setResponseData({
                        update: requestData,
                        data: responseData,
                    });
                }
            };

            switch(reqType)
            {
                case RequestType.POST:
                    axios.post(`${BACKEND_URL}${uri}?token=${session.token}${queries !== undefined && queries !== null && queries.length > 0 ? `&${queriesToString(queries)}` : ``}`, data).then((response) => {
                        handleData(response.data);
                    });
                    break;
                case RequestType.GET:
                    axios.get(`${BACKEND_URL}${uri}?token=${session.token}${queries !== undefined && queries !== null && queries.length > 0 ? `&${queriesToString(queries)}` : ``}`).then((response) => {
                        handleData(response.data);
                    });
                    break;
            }
        }
    };

    const [responseData, setResponseData] = useState<Request>({
        update: requestData,
    });

    useEffect(() => {
        requestData();
    }, []);

    return responseData;
}

export const useRequest = (uri: string, reqType: RequestType, data: any = {}) : Request => {    
    const requestData = () => {
        const handleData = (responseData: any) => {
            if(!responseData.success)
            {
                setResponseData({
                    update: requestData,
                });
            }
            else
            {
                setResponseData({
                    update: requestData,
                    data: responseData,
                });
            }
        };

        switch(reqType)
        {
            case RequestType.POST:
                axios.post(`${BACKEND_URL}${uri}`, data).then((response) => {
                    handleData(response.data);
                });
                break;
            case RequestType.GET:
                axios.get(`${BACKEND_URL}${uri}`).then((response) => {
                    handleData(response.data);
                });
                break;
        }
    };

    const [responseData, setResponseData] = useState<Request>({
        update: requestData,
    });
    
    useEffect(() => {
        requestData();
    }, []);

    return responseData;
}

type ServerSidePropsFunction = (auth: boolean) => any;
type ServerSidePropsAuthFunction = (user: UserType) => boolean;

export const getServerSidePropsWithAuth = async (ctx: GetServerSidePropsContext, serverSidePropsFunc: ServerSidePropsFunction, authFunction: ServerSidePropsAuthFunction) : Promise<any> => {
    const user = await GetUserFromContext(ctx);
    return serverSidePropsFunc(authFunction(user));
}