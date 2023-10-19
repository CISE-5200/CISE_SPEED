import { useState, FormEvent, useEffect } from "react";
import formStyles from "../../styles/Form.module.scss";
import { Login, LoginResponse } from "../../lib/auth";
import { useRouter } from "next/router";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginValid, setLoginValid] = useState<boolean | null>(null);
  const [loginMessage, setLoginMessage] = useState("");
  const router = useRouter();
  
  /**
   * submit button handler for login page
   * looks up user name and password and finds if user if found
   * @param event Form event object for preventing default action
   */
  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try
    {
      let response: LoginResponse = await Login({
        username: username,
        password: password,
      });

      setLoginValid(response.success);

      if(response.success)
      {
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
      else if(response.message !== undefined)
      {
        setLoginMessage(response.message);
      }
    } catch(err) {
      setLoginValid(false);
    }
  };

  const errorMsg = (
    <div>{loginMessage}</div>
  );

  const successMsg = (
    <div>Login successful, welcome back {username}.</div>
  );

  return (
    <div>
      <h1>Login</h1>
      <form className={formStyles.form} onSubmit={submitLogin} action="#">
        <input
          className={formStyles.formItem}
          type="text"
          name="userName"
          placeholder="User Nane"
          value={username}
          onChange={(Event) => {
            setUsername(Event.target.value);
          }}
        />
        <input
          className={formStyles.formItem}
          type="password"
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
      {loginValid !== null && !loginValid && errorMsg}
      {loginValid !== null && loginValid && successMsg}
    </div>
  );
};

export default LoginPage;