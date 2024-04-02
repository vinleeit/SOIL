import { Link, Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <div className="h-16">
          <nav className="flex h-full items-center justify-between px-8 border-b-2 border-lime-500">
            <h2 className="text-lg font-bold">SOIL</h2>
            <ul className="flex space-x-2">
              <li>
                <Link
                  to={"/"}
                  className="px-3 py-2  border-lime-400 border rounded-md hover:bg-lime-100"
                >
                  Special Deals
                </Link>
              </li>
              <li>
                <Link
                  to={"/"}
                  className="px-3 py-2 bg-lime-400 hover:bg-lime-300 border-lime-400 border rounded-md"
                >
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <span className="h-8 bg-lime-400 flex items-center justify-center text-sm">
          Fresh and Organic Foods for Australians!
        </span>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-stone-600 text-white flex flex-col items-center py-4">
        <span className="font-bold">&copy;2024 SOIL</span>
        <p className="text-sm">
          Where we (Literally) grow high quality and organic foods
        </p>
      </footer>
    </div>
  );
}
