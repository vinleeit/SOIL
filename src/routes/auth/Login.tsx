import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SoilAlertDialog from "../../components/SoilAlertDialog";
import SoilButton from "../../components/SoilButton";
import SoilTextField from "../../components/SoilTextField";
import { login } from "../../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const successDialog = useRef<HTMLDialogElement | null>(null);
  const navigate = useNavigate();

  function performLogin(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    let success = true;
    if (password.length === 0) {
      setPasswordError("Password must not be empty");
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

    if (success) {
      if (login(email, password)) {
        successDialog.current?.showModal();
        return;
      }
      setEmailError("Invalid email or password");
    }
  }

  return (
    <section className="grow flex flex-col items-center justify-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
        Login to Your Account
      </h1>
      <p className="max-w-80 md:max-w-96 text-center">
        Unlock your personalized account and enjoy a seamless online experience.
      </p>
      <div className="w-2/3 md:1/2 flex flex-col md:flex-row items-center space-x-2 mt-8">
        <form className="w-full md:1/2 space-y-2" onSubmit={performLogin}>
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
          <SoilButton fullWidth>LOGIN</SoilButton>
          <p className="text-center w-full py-1 text-xs">
            By logging in you agree to terms and condition of use.
          </p>
        </form>
        <div className="w-24 text-center">
          <span className="text-4xl hidden md:block">/</span>
        </div>
        <div className="w-full md:1/2 flex flex-col items-center justify-center">
          <SoilButton
            fullWidth
            outlined
            onClick={() => {
              navigate("/register");
            }}
          >
            CREATE ACCOUNT
          </SoilButton>
        </div>
      </div>
      <SoilAlertDialog
        id={"successDialog"}
        ref={successDialog}
        title={"Login Success"}
        description="Enjoy the brand new organic shopping experience"
        buttonLabel="Continue"
        onClick={() => navigate("/profile")}
      />
    </section>
  );
}
