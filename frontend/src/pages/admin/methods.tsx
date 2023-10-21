import SortableTable, { DisplayFunction } from "@/components/table/SortableTable";
import { RequestType, Role, User, makeAuthRequest, useRequest } from "@/lib/auth";
import { useState, useEffect } from "react";
import Popup from "@/components/popup/Popup";

import EditForm from "@/components/editor/EditForm";
import formStyles from "../../styles/Form.module.scss";

interface Method {
    id: string;
    name: string;
};

const MethodsTable = (props: { adminUser: User | null }) => {
  const { adminUser } = props;

  const methodsResponse = useRequest('/method/all', RequestType.GET);
  const [methods, setMethods] = useState<Method[]>();

  useEffect(() => {
    setMethods(methodsResponse.data?.methods);
  }, [methodsResponse.data]);

  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>();
  const [define, setDefine] = useState<boolean>(false);

  const [methodID, setMethodID] = useState<string>("");
  const [methodName, setMethodName] = useState<string>("");

  const headers: { key: keyof Method; label: string; display?: DisplayFunction | undefined }[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" }
  ];

  const onClickDelete = (method: Method) => {
    makeAuthRequest('/method/delete', RequestType.POST, adminUser, {}, [
      {
        key: "id",
        value: method.id,
      }
    ]).then((response) => {
      setSuccess(response.success);

      if(response.success) {
        setMessage("Successfully deleted method.");
        methodsResponse.update();
      } else {
        setMessage("Failed to delete method.");
      }
    });
  };

  const onDefineFormSubmit = () => {
    makeAuthRequest('/method/add', RequestType.POST, adminUser, {
      id: methodID,
      name: methodName,
    }).then((response) => {      
      setSuccess(response.success);

      if(response.success) {
        setMessage("Successfully defined a new method.");
        methodsResponse.update();
      } else {
        setMessage("Failed to define a new method.");
      }

      setDefine(false);
    });
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
          <button onClick={() => setDefine(true)}>Define new method</button>

          {define && (<Popup>
            <EditForm onSubmit={onDefineFormSubmit} visible={define}>
                <input className={formStyles.formItem} type="text" name="id" placeholder="ID (e.g. TDD)" value={methodID} onChange={(Event) => {
                  setMethodID(Event.target.value);
                }}/>
                <input className={formStyles.formItem} type="text" name="name" placeholder="Name (e.g. Test Driven Development)" value={methodName} onChange={(Event) => {
                  setMethodName(Event.target.value);
                }}/>
                <button className={formStyles.formItem} type="submit">
                  Save
                </button>
                <button className={formStyles.formItem} onClick={() => setDefine(false)}>
                  Cancel
                </button>
            </EditForm>
          </Popup>)}

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