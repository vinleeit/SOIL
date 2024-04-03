import { FormEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bcyrpt from "bcryptjs-react";
import { User } from "../../types/User";

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
      const userString = localStorage.getItem("users");
      const users: User[] = userString ? JSON.parse(userString) : [];

      const matchedUser = users.find((e) => e.email === email);
      if (matchedUser) {
        if (bcyrpt.compareSync(password, matchedUser.password)) {
          successDialog.current?.showModal();
          localStorage.setItem("currentUser", JSON.stringify(matchedUser));
          return;
        }
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
          <button className="w-full mt-3 bg-lime-400 py-3 rounded hover:bg-lime-300">
            LOGIN
          </button>
          <p className="text-center w-full py-1 text-xs">
            By logging in you agree to terms and condition of use.
          </p>
        </form>
        <div className="w-24 text-center">
          <span className="text-4xl hidden md:block">/</span>
        </div>
        <div className="w-full md:1/2 flex flex-col items-center justify-center">
          <Link
            to={"/register"}
            className="w-full mt-3 border border-lime-400 py-3 rounded hover:bg-lime-100 text-center"
          >
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
      <dialog
        id="successDialog"
        open={false}
        className="backdrop:bg-stone-400 backdrop:opacity-60 rounded"
        ref={successDialog}
      >
        <div className="bg-stone-100 w-96 h-64 flex flex-col items-center justify-center  border-t-8 border-lime-500 ">
          <h2 className="text-2xl font-bold text-stone-700">Login Success</h2>
          <p className="mb-8 mt-1 px-20 text-center">
            Enjoy the brand new organic shopping experience
          </p>
          <button
            className="text-center w-1/2 bg-lime-500 text-stone-700 py-2 rounded-md"
            onClick={() => navigate("/profile")}
          >
            Continue
          </button>
        </div>
      </dialog>
    </section>
  );
}
