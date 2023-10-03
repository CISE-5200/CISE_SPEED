import { useState, FormEvent, useEffect } from "react";
import formStyles from "../../styles/Form.module.scss";
// import users from "./dummdata.json";
import { withSessionSsr } from "../../lib/withSession";
import { redirect } from "next/dist/server/api-utils";

const login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(0);
  const [loginValid, setLoginValid] = useState(true);
  interface User {
    userName: string;
    password: string;
    userType: number;
  }
  interface Props {
    username: string;
  }
  /**
   * submit button handler for login page
   * looks up user name and password and finds if user if found
   * @param event Form event object for preventing default action
   */
  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    const query = await fetch("localhost:3000/api/login", {
      headers: { userName: userName, password: password },
    });
    const responce = await query.json();
    console.log(responce);
  };

  const errorMsg = (
    <div>User not found, please check your details and try again</div>
  );

  return (
    <div>
      <h1>Login</h1>
      <form className={formStyles.form} onSubmit={submitLogin}>
        <input
          className={formStyles.formItem}
          type="text"
          name="userName"
          placeholder="User Nane"
          value={userName}
          onChange={(Event) => {
            setUserName(Event.target.value);
          }}
        />
        <input
          className={formStyles.formItem}
          type="text"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(Event) => {
            setPassword(Event.target.value);
          }}
        />
        <button className={formStyles.formItem} type="submit">
          Submit
        </button>
      </form>
      {!loginValid && errorMsg}
    </div>
  );
};

export default login;
