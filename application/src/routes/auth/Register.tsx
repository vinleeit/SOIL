import { FormEvent, useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SoilAlertDialog from "../../components/SoilAlertDialog";
import SoilButton from "../../components/SoilButton";
import SoilTextField from "../../components/SoilTextField";
import { AuthContext, AuthContextValue } from "../../context/AuthContext";

export default function Register() {
  const { register } = useContext(AuthContext) as AuthContextValue;
  const navigate = useNavigate();
  const successDialog = useRef<HTMLDialogElement | null>(null);
  const failureDialog = useRef<HTMLDialogElement | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [username, setName] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function performRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Form validation
    let success = true;
    if (password.length === 0) {
      setPasswordError("Password must not be empty");
      success = false;
    } else if (password.length < 8) {
      setPasswordError("Password should be at least 8 characters");
      success = false;
    } else if (password.search(/[A-Z]/) == -1) {
      setPasswordError("Password should contain uppercase characters");
      success = false;
    } else if (password.search(/[a-z]/) == -1) {
      setPasswordError("Password should contain lowercase characters");
      success = false;
    } else if (password.search(/\d/) == -1) {
      setPasswordError("Password should contain numbers");
      success = false;
    } else {
      setPasswordError("");
    }

    if (email.length === 0) {
      setEmailError("Email must not be empty");
      success = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      success = false;
    } else {
      setEmailError("");
    }

    if (username.length < 2) {
      setUsernameError("Name must be at least 2 characters");
      success = false;
    } else {
      setUsernameError("");
    }

    if (success) {
      // register user if validation success
      const error = await register(email, username, password);
      if (error) {
        setError(error);
        failureDialog.current?.showModal();
        return;
      }
      successDialog.current?.showModal();
    }
  }

  return (
    <section className="grow flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-2">Create a New Account</h1>
      <p className="max-w-96 text-center">
        Join the SOIL community and enjoy the endless benefits of living
        healthy!
      </p>
      <form className="w-80 space-y-2 mt-8" onSubmit={performRegister}>
        <SoilTextField
          type="text"
          value={username}
          placeholder="Username"
          onChange={(e) => setName(e.target.value)}
          errMsg={usernameError}
        />
        <SoilTextField
          type="text"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          errMsg={emailError}
        />
        <SoilTextField
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          errMsg={passwordError}
        />
        <p className="text-center w-full py-1 text-xs">
          By creating an account in you agree to terms and condition of use.
        </p>
        <SoilButton fullWidth>CREATE ACCOUNT</SoilButton>
        <Link
          to={"/login"}
          className="text-sm text-green-light underline text-center block"
        >
          Already have an account?
        </Link>
      </form>
      <SoilAlertDialog
        id={"successDialog"}
        ref={successDialog}
        title={`Hi ${username}!`}
        description="Your account has been created"
        buttonLabel="Continue"
        onClick={() => navigate("/login")}
      />
      <SoilAlertDialog
        id={"failureDialog"}
        ref={failureDialog}
        title={`Error`}
        description={error}
        buttonLabel="Ok"
        onClick={() => failureDialog.current?.close()}
      />
    </section>
  );
}
