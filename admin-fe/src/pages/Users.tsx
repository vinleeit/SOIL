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
    <div className="px-8 py-2 grow flex flex-col items-center justify-center">
      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              ID
            </th>
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              Email
            </th>
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              Username
            </th>
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              User Status
            </th>
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((u: UserData) => (
            <tr key={u.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border border-gray-300">{u.id}</td>
              <td className="px-4 py-2 border border-gray-300">{u.email}</td>
              <td className="px-4 py-2 border border-gray-300">{u.username}</td>
              <td className="px-4 py-2 border border-gray-300">
                {u.isBlocked ? (
                  <span className="text-red-500 font-bold">Blocked</span>
                ) : (
                  <span className="text-green-500 font-bold">Active</span>
                )}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                <button
                  className="px-3 py-1 rounded border-2"
                  onClick={
                    !u.isBlocked ? () => block(u.id) : () => unblock(u.id)
                  }
                >
                  {u.isBlocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
