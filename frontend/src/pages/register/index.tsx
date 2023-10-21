import { useState, FormEvent } from "react";
import formStyles from "../../styles/Form.module.scss";
import { Register, LoginResponse } from "../../lib/auth";
import { useRouter } from "next/router";
import Popup from "@/components/popup/Popup";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registrationValid, setRegistrationValid] = useState<boolean | null>(null);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const router = useRouter();
  
  /**
   * submit button handler for registration page
   * looks up user name and password and finds if user if found
   * @param event Form event object for preventing default action
   */
  const submitRegistration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try
    {
      let response: LoginResponse = await Register({
        username: username,
        password: password,
      });

      setRegistrationValid(response.success);

      if(response.success)
      {
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
      else if(response.message !== undefined)
      {
        setRegistrationMessage(response.message);
      }
    } catch(err) {
      setRegistrationValid(false);
    }
  };

  const successMsg = `Registration successful! Welcome to SPEED, ${username}.`;

  return (
    <div>
      <h1>Registration</h1>

    {registrationValid !== null && (
      <Popup message={registrationValid ? successMsg : registrationMessage} success={registrationValid}/>
    )}

      <form className={formStyles.form} onSubmit={submitRegistration} action="#">
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
          Register
        </button>
      </form>
      <a href="#" onClick={() => router.push('/login')}>Looking to log in?</a>
    </div>
  );
};

export default RegisterPage;