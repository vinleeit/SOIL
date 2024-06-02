import { useQuery, gql } from "@apollo/client";

const FILMS_QUERY = gql`
  {
    users {
      id
      username
      isBlocked
      email
    }
  }
`;

export default function App() {
  const { data, loading, error } = useQuery(FILMS_QUERY);

  if (loading) return "Loading...";
  if (error) return <pre>{error.message}</pre>;

  return (
    <div>
      <h1>Admin</h1>
      <ul>
        {data.users.map((launch: { id: number; username: string }) => (
          <li key={launch.id}>{launch.username}</li>
        ))}
      </ul>
    </div>
  );
}
