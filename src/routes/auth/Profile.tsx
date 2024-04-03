import { User } from "../../types/User";

export default function Profile() {
  const currentUser: User = JSON.parse(
    localStorage.getItem("currentUser") as string,
  );

  return (
    <div className="grow flex items-center justify-center">
      <section className="w-2/3 max-w-96 my-16 p-8 bg-stone-100 rounded border text-stone-900">
        <h1 className="text-4xl font-bold tracking-wider">Profile</h1>
        <dl className="mt-4 flex space-y-5 leading-4 flex-col">
          <div>
            <dt className="font-bold text-sm">Name</dt>
            <dd className="capitalize">{currentUser.name}</dd>
          </div>
          <div>
            <dt className="font-bold text-sm">Email Address</dt>
            <dd className="lowercase">{currentUser.email}</dd>
          </div>
          <div>
            <dt className="font-bold text-sm">Joining Date</dt>
            <dd className="lowercase">
              {new Date(currentUser.joinDate).toJSON().split("T")[0]}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
