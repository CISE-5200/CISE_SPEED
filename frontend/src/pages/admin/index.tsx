import { RequestType, Role, getServerSidePropsWithAuth, useAuth, useAuthRequest, useRequest } from "@/lib/auth";
import { GetServerSideProps, NextPage } from "next";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import AdminArticleTable from "./articles";
import UserTable from "./users";
import MethodsTable from "./methods";

const AdminPage: NextPage = () => {
  const user = useAuth();

  return (
    <div className="container">
      <h1>Admin</h1>

      <Tabs>
        <TabList>
          <Tab>Users</Tab>
          <Tab>Articles</Tab>
          <Tab>Methods</Tab>
        </TabList>
        <TabPanel>
          <UserTable adminUser={user}/>
        </TabPanel>
        <TabPanel>
          <AdminArticleTable adminUser={user}/>
        </TabPanel>
        <TabPanel>
          <MethodsTable adminUser={user}/>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export const getServerSideProps : GetServerSideProps = async (ctx) => {
  return getServerSidePropsWithAuth(ctx, (auth: boolean) => { 
    if(!auth)
    {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
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
    return user !== null && user.role === Role.ADMIN;
  });
}

export default AdminPage;