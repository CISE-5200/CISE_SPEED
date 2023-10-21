import SortableTable, { DisplayFunction } from "@/components/table/SortableTable";
import { RequestType, Role, User, makeAuthRequest } from "@/lib/auth";
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
};
  
export default UserTable;