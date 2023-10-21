import SortableTable, { DisplayFunction } from "@/components/table/SortableTable";
import { Request, RequestType, Role, User, makeAuthRequest, useAuthRequest } from "@/lib/auth";
import { useState, useEffect } from "react";
import Popup from "@/components/popup/Popup";

const UserTable = (props: { adminUser: User | null }) => {
    const { adminUser } = props;

    const usersResponse = useAuthRequest('/user/all', RequestType.GET);
    const [users, setUsers] = useState<User[] | null>();

    useEffect(() => {
      setUsers(usersResponse.data?.users);
    }, [usersResponse.data]);

    const [success, setSuccess] = useState<boolean>(false);
    const [message, setMessage] = useState<string | undefined>();
  
    const headers: { key: keyof User; label: string; display?: DisplayFunction | undefined }[] = [
      { key: "username", label: "Username" }
    ];
  
    const onRoleChanged = (event: React.FormEvent<HTMLSelectElement>) =>
    {
      let roleChange: {user: User, role: Role} = JSON.parse(event.currentTarget.value);    
      setMessage(undefined);
  
      makeAuthRequest('/user/changeRole', RequestType.POST, adminUser, roleChange).then((response) => {
        setSuccess(response.success);

        if(response.success)
        {
          setMessage("Applied role change successfully.");
        }
        else
        {
          setMessage("Failed to update role.");
        }
      });
    };
  
    const onClickDelete = (deletedUser: User) => {
      setMessage(undefined);
  
      makeAuthRequest('/user/delete', RequestType.POST, adminUser, deletedUser).then((response) => {
        setSuccess(response.success);

        if(response.success)
        {
          setMessage("Deleted user successfully.");
          usersResponse.update();
        }
        else
        {
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
            <Popup success={success}>
              {message}
            </Popup>
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
};
  
export default UserTable;