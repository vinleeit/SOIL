import { Link } from "react-router-dom";

export default function Error() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="bg-black text-white rounded-xl p-8">
        <h1 className="text-3xl">Error</h1>
        <p className="font-light">Unable to load the requested resource</p>
        <div className="mt-3 flex justify-end w-full">
          <Link to={"/"} className="bg-white rounded-lg px-4 py-2 text-black">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
