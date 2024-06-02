import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex bg-black text-white px-8 py-3 items-center">
        <Link to={"/"}>Admin Panel</Link>
        <div className="flex-1 flex justify-end space-x-1">
          <Link
            to={"/users"}
            className="bg-white rounded px-3 py-1 text-black hover:bg-blue-200"
          >
            Users
          </Link>
          <Link
            to={"/reviews"}
            className="bg-white rounded px-3 py-1 text-black hover:bg-blue-200"
          >
            Review
          </Link>
          <Link
            to={"/products"}
            className="bg-white rounded px-3 py-1 text-black hover:bg-blue-200"
          >
            Product
          </Link>
        </div>
      </div>
      <div className="flex h-full grow">
        <Outlet />
      </div>
    </div>
  );
}
