import { FormEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs-react";
import { User } from "../../types/User";
import SoilAlertDialog from "../../components/SoilAlertDialog";
import SoilButton from "../../components/SoilButton";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const successDialog = useRef<HTMLDialogElement | null>(null);
  const navigate = useNavigate();

  function performRegister(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
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

    if (name.length < 2) {
      setNameError("Name must be at least 2 characters");
      success = false;
    } else {
      setNameError("");
    }

    if (success) {
      const usersString = localStorage.getItem("users");
      let users: User[] = [];
      if (usersString) {
        users = JSON.parse(usersString);
        if (users.find((v) => v.email === email)) {
          setEmailError("User already exits");
          return;
        }
      }
      const newUser: User = {
        name: name,
        email: email,
        password: bcrypt.hashSync(password),
        joinDate: Date.now(),
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
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
        <input
          type="text"
          className="w-full rounded focus:border-lime-400 border-gray-300 focus:ring focus:ring-lime-400 focus:ring-opacity-45"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        {nameError && <p className="text-red-400">{nameError}</p>}
        <input
          type="text"
          className="w-full rounded focus:border-lime-400 border-gray-300 focus:ring focus:ring-lime-400 focus:ring-opacity-45"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        {emailError && <p className="text-red-400">{emailError}</p>}
        <input
          type="password"
          className="w-full rounded focus:border-lime-400 border-gray-300 focus:ring focus:ring-lime-400 focus:ring-opacity-45"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        {passwordError && <p className="text-red-400">{passwordError}</p>}
        <p className="text-center w-full py-1 text-xs">
          By creating an account in you agree to terms and condition of use.
        </p>
        <SoilButton fullWidth>
          CREATE ACCOUNT
        </SoilButton>
        <Link
          to={"/login"}
          className="text-sm text-lime-700 underline text-center block"
        >
          Already have an account?
        </Link>
      </form>
      <SoilAlertDialog
        id={"successDialog"}
        ref={successDialog}
        title={`Welcome ${name}!`}
        description="Your account has been created"
        buttonLabel="Continue"
        onClick={() => navigate("/profile")} />
    </section>
  );
}
