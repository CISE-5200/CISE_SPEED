import { Logout } from "@/lib/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

const LogoutPage = () => {
    const router = useRouter();

    useEffect(() =>
    {
        Logout().then(() => {
            router.push('/');
        });
    });
};

export default LogoutPage;