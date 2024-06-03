import { Link, NavLink, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-gray-50 border-b-2 border-black">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap ">
              <Link to={"/"}>
                SOIL<sup className="text-sm">Admin</sup>
              </Link>
            </span>
          </a>
          <div
            className="hidden w-full md:block md:w-auto"
            id="navbar-solid-bg"
          >
            <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
              <li>
                <NavLink
                  to={"/users"}
                  className="block py-2 px-3 md:p-0 text-gray-500 rounded md:bg-transparent"
                >
                  User Moderation
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/reviews"}
                  className="block py-2 px-3 md:p-0 text-gray-500 rounded md:bg-transparent"
                >
                  Review Moderation
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/products"}
                  className="block py-2 px-3 md:p-0 text-gray-500 rounded md:bg-transparent"
                >
                  Product Management
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="flex h-full grow">
        <Outlet />
      </div>
    </div>
  );
}
