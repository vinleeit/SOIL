import { useQuery, gql, useMutation } from "@apollo/client";

const USER_QUERY = gql`
  {
    users {
      id
      username
      isBlocked
      email
    }
  }
`;

const BLOCK_QUERY = gql`
  mutation blockUser($id: Int!) {
    blockUser(id: $id) {
      id
    }
  }
`;

const UNBLOCK_QUERY = gql`
  mutation unblockUser($id: Int!) {
    unblockUser(id: $id) {
      id
    }
  }
`;

type UserData = {
  id: number;
  username: string;
  isBlocked: boolean;
  email: string;
};

export default function Users() {
  const { data, loading, error, refetch } = useQuery(USER_QUERY);
  const [blockUser] = useMutation(BLOCK_QUERY);
  const [unblockUser] = useMutation(UNBLOCK_QUERY);

  if (loading)
    return (
      <div className="grow flex items-center justify-center">Loading...</div>
    );
  if (error) return <pre>{error.message}</pre>;

  const block = async (id: number) => {
    await blockUser({ variables: { id: id } });
    refetch();
  };

  const unblock = async (id: number) => {
    await unblockUser({ variables: { id: id } });
    refetch();
  };
  return (
    <div className="px-8 py-8 grow flex flex-col items-center ">
      <div className="flex mb-4 justify-between w-full flex-col">
        <h1 className="text-2xl">User Management</h1>
        <p>Manage user, and prevent suspicious user from posting new reviews</p>
      </div>
      <div className="overflow-x-auto border w-full">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((u: UserData) => (
              <tr key={u.id}>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {u.id}
                </th>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">{u.username}</td>
                <td className="px-6 py-4">
                  {u.isBlocked ? "Inactive" : "Active"}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={
                      u.isBlocked ? () => unblock(u.id) : () => block(u.id)
                    }
                    className="font-medium text-white hover:underline px-2 py-1 bg-black "
                  >
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
