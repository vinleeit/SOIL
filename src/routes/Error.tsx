import { Link } from "react-router-dom";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-500">
      <div className="bg-stone-100 rounded-md w-96 h-72 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-lime-600">SOIL</h2>
        <h1 className="text-5xl mb-4">Not Found!</h1>
        <p className="px-6 text-center mb-6">
          They might be still growing,
          <br />
          on some other place...
        </p>
        <Link
          to={"/"}
          className="px-3 py-2 bg-black text-white rounded-md hover:bg-stone-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
