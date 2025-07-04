import { Outlet } from "react-router-dom";
import SoilHeader from "../components/SoilHeader";
import ShoppingCartProvider from "../context/ShoppingCartProvider";

/*
 * Root Template for the whole website
 * */
export default function Root() {
  return (
    <ShoppingCartProvider>
      <div className="flex flex-col min-h-screen">
        <SoilHeader />
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
        <footer className="bg-green-dark text-white flex flex-col items-center py-4">
          <span className="font-bold">&copy;2024 SOIL</span>
          <p className="text-sm">
            Where we (Literally) grow high quality and organic foods
          </p>
        </footer>
      </div>
    </ShoppingCartProvider>
  );
}
