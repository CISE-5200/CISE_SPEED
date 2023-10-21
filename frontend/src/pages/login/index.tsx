import { useState, FormEvent } from "react";
import formStyles from "../../styles/Form.module.scss";
import { Login, LoginResponse, getServerSidePropsWithAuth } from "../../lib/auth";
import { useRouter } from "next/router";
import { GetServerSideProps, NextPage } from "next";
import Popup from "@/components/popup/Popup";

const LoginPage: NextPage = () => {
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

  const successMsg = `Login successful, welcome back ${username}.`

  return (
    <div>
      <h1>Login</h1>

      {loginValid !== null && (
        <Popup success={loginValid}>
          {loginValid ? successMsg : loginMessage}
        </Popup>
      )}

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
      <a href="#" onClick={() => router.push('/register')}>Looking to register?</a>
    </div>
  );
};

export const getServerSideProps : GetServerSideProps = async (ctx) => {
  return getServerSidePropsWithAuth(ctx, (auth: boolean) => { 
    if(auth)
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

export default LoginPage;