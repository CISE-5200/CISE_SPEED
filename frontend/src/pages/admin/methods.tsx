import SortableTable, { DisplayFunction } from "@/components/table/SortableTable";
import { RequestType, Role, User, makeAuthRequest } from "@/lib/auth";
import { useState, useEffect } from "react";
import Popup from "@/components/popup/Popup";

interface Method {
    id: string;
    name: string;
};

const MethodsTable = (props: { adminUser: User | null, methods: Method[] | null }) => {
    const { adminUser } = props;
    const [methods, setMethods] = useState<Method[] | null>();
    const [success, setSuccess] = useState<boolean>(false);
    const [message, setMessage] = useState<string | undefined>();
  
    useEffect(() => {
      setMethods(props.methods);
    }, [props]);
  
    const headers: { key: keyof Method; label: string; display?: DisplayFunction | undefined }[] = [
      { key: "id", label: "ID" },
      { key: "name", label: "Name" }
    ];

    const onClickDelete = (method: Method) => {

    };

    const onClickDefine = () => {
      
    };

    const actions: { label?: string; action: any; }[] = [
      {
        action: (method: Method) => (
          <>
            <button onClick={() => onClickDelete(method)}>Delete</button>
          </>
        )
      }
    ];

    return (
        <>
            <button onClick={onClickDefine}>Define new method</button>

            {methods !== undefined && methods !== null && methods.length > 0 ? (
                <>
                    {message !== undefined && (
                        <Popup message={message} success={success}/>
                    )}

                    <SortableTable headers={headers} data={methods} actions={actions}/>
                </>
            ) : (
                <p>No methods defined.</p>
            )}
        </>
      );
};
  
export default MethodsTable;