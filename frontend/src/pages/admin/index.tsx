import SortableTable, { DisplayFunction } from "@/components/table/SortableTable";
import { RequestType, Role, User, getServerSidePropsWithAuth, makeAuthRequest, useAuth, useAuthRequest } from "@/lib/auth";
import { GetServerSideProps, NextPage } from "next";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { useState, useEffect } from "react";
import Popup from "@/components/popup/Popup";

const UserTable = (props: { adminUser: User | null, users: User[] | null }) => {
  const { adminUser } = props;
  const [users, setUsers] = useState<User[] | null>();
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>();

  useEffect(() => {
    setUsers(props.users);
  }, [props]);

  const headers: { key: keyof User; label: string; display?: DisplayFunction | undefined }[] = [
    { key: "username", label: "Username" }
  ];

  const onRoleChanged = (event: React.FormEvent<HTMLSelectElement>) =>
  {
    let roleChange: {user: User, role: Role} = JSON.parse(event.currentTarget.value);    
    setMessage(undefined);

    makeAuthRequest('/user/changeRole', RequestType.POST, adminUser, roleChange).then((response) => {
      if(response !== undefined && response !== null)
      {
        setSuccess(response.success);
        setMessage("Applied role change successfully.");
      }
      else
      {
        setSuccess(false);
        setMessage("Failed to update role.");
      }
    });
  };

  const onClickDelete = (deletedUser: User) => {
    setMessage(undefined);

    makeAuthRequest('/user/delete', RequestType.POST, adminUser, deletedUser).then((response) => {
      if(response !== undefined && response !== null)
      {
        setSuccess(response.success);
        setMessage("Deleted user successfully.");

        if(users !== undefined && users !== null)
        {
          setUsers(users.filter(user => user.username !== deletedUser.username));
        }
      }
      else
      {
        setSuccess(false);
        setMessage("Failed to delete user.");
      }
    });
  };

  const userRoleToValueMapping = (user: User, role: Role) => {
      return JSON.stringify({ user: user, role: role });
  };

  const actions: { label?: string; action: any; }[] = [
    { 
      label: "Role", 
      action: (user: User) => (
        <>
          <select onChange={onRoleChanged} defaultValue={userRoleToValueMapping(user, user.role)} disabled={user.username === adminUser?.username}>
            {Object.keys(Role).filter((role) => !isNaN(Number(role))).map((role: any) => (
              <option key={role} value={userRoleToValueMapping(user, Number(role))}>{Role[role]}</option>
            ))}
          </select>
        </>
      )
    },
    {
      action: (user: User) => (
        <>
          <button onClick={() => onClickDelete(user)} disabled={user.username === adminUser?.username}>Delete</button>
        </>
      )
    }
  ];

  if(users !== undefined && users !== null && users.length > 0)
  {
    return (
      <>
        {message !== undefined && (
          <Popup message={message} success={success}/>
        )}
        <SortableTable headers={headers} data={users} actions={actions}/>
      </>
    );
  }
  else
  {
    return (
      <p>No users found.</p>
    );
  }
}

const AdminPage: NextPage = () => {
  const user = useAuth();
  const usersReponse = useAuthRequest('/user/users', RequestType.GET);

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
          <UserTable adminUser={user} users={usersReponse?.users}/>
        </TabPanel>
        <TabPanel>
          Tab 3
        </TabPanel>
        <TabPanel>
          Tab 4
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