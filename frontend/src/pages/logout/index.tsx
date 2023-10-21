import { Logout, getServerSidePropsWithAuth } from "@/lib/auth";
import { GetServerSideProps } from "next";
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

export const getServerSideProps : GetServerSideProps = async (ctx) => {
    return getServerSidePropsWithAuth(ctx, (auth: boolean) => { 
      if(!auth)
      {
        return {
          redirect: {
            permanent: false,
            destination: "/",
          },
          props: {}
        } ;
      }
      else
      {
        return {
          props: {},
        };
      }
    }, (user) => {
      return user !== null;
    });
  }

export default LogoutPage;