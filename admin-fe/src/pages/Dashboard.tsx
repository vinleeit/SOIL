import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="grow flex items-center justify-center">
      <div className="flex space-x-2">
        <Link
          to={"/users"}
          className=" text-center border border-black p-4 rounded hover:shadow-xl"
        >
          User
          <br />
          Management
        </Link>
        <Link
          to={"/users"}
          className=" text-center border border-black p-4 rounded hover:shadow-xl"
        >
          Review
          <br />
          Management
        </Link>
        <Link
          to={"/users"}
          className=" text-center border border-black p-4 rounded hover:shadow-xl"
        >
          Product
          <br />
          Management
        </Link>
      </div>
    </div>
  );
}
