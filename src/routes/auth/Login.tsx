import { Link } from "react-router-dom";

export default function Login() {
  return (
    <section className="grow flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-2">Login to Your Account</h1>
      <p className="max-w-96 text-center">
        Unlock your personalized account and enjoy a seamless online experience.
      </p>
      <div className="w-1/2 flex items-center space-x-2 mt-8">
        <form className="w-1/2 space-y-2">
          <input
            type="text"
            className="w-full rounded focus:border-lime-400 border-gray-300 focus:ring focus:ring-lime-400 focus:ring-opacity-45"
            placeholder="Email"
          />
          <input
            type="password"
            className="w-full rounded focus:border-lime-400 border-gray-300 focus:ring focus:ring-lime-400 focus:ring-opacity-45"
            placeholder="Password"
          />
          <button className="w-full mt-3 bg-lime-400 py-3 rounded hover:bg-lime-300">
            LOGIN
          </button>
          <p className="text-center w-full py-1 text-xs">
            By logging in you agree to terms and condition of use.
          </p>
        </form>
        <div className="w-24 text-center">
          <span className="text-4xl">/</span>
        </div>
        <div className="w-1/2 flex flex-col items-center justify-center">
          <Link
            to={"/register"}
            className="w-full mt-3 border border-lime-400 py-3 rounded hover:bg-lime-100 text-center"
          >
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    </section>
  );
}
