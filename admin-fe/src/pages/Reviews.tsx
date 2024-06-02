import { useQuery, gql, useMutation } from "@apollo/client";

const ReviewQuery = gql`
  {
    reviews {
      reviewID
      review
      rating
      isBlocked
      user {
        username
      }
    }
    threads {
      threadID
      content
      isBlocked
      user {
        username
      }
    }
  }
`;

const DELETE_REVIEW_QUERY = gql`
  mutation deleteReview($id: Int!) {
    blockReview(reviewID: $id) {
      reviewID
    }
  }
`;

const DELETE_THREAD_QUERY = gql`
  mutation deleteThread($id: Int!) {
    blockThread(threadID: $id) {
      threadID
    }
  }
`;
type ThreadData = {
  threadID: number;
  content: string;
  isBlocked: boolean;
  user: {
    username: string;
  };
};
type ReviewData = {
  reviewID: number;
  review: string;
  rating: number;
  isBlocked: boolean;
  user: {
    username: string;
  };
};

export default function Reviews() {
  const { data, loading, error, refetch } = useQuery(ReviewQuery);
  const [deleteReview] = useMutation(DELETE_REVIEW_QUERY);
  const [deleteThread] = useMutation(DELETE_THREAD_QUERY);

  if (loading)
    return (
      <div className="grow flex items-center justify-center">Loading...</div>
    );
  if (error) return <pre>{error.message}</pre>;

  const deleteReviewCallback = async (id: number) => {
    await deleteReview({ variables: { id: id } });
    refetch();
  };

  const deleteThreadCallback = async (id: number) => {
    await deleteThread({ variables: { id: id } });
    refetch();
  };
  return (
    <div className="px-8 pt-8 pb-3 grow flex flex-col items-center ">
      <div className="flex justify-between w-full">
        <h1 className="mb-2 text-2xl">Review Moderation</h1>
        <div></div>
      </div>
      <div className="w-full text-left my-2">
        <h2 className="text-xl">Rating</h2>
        <p className="">Rating is the score given by a user to a product</p>
      </div>
      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              ID
            </th>
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              Rating
            </th>
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              Review
            </th>
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              User
            </th>
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              Status
            </th>
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.reviews.map((u: ReviewData) => (
            <tr key={u.reviewID} className="hover:bg-gray-100">
              <td className="px-4 py-2 border border-gray-300">{u.reviewID}</td>
              <td className="px-4 py-2 border border-gray-300">{u.rating}</td>
              <td className="px-4 py-2 border border-gray-300">{u.review}</td>
              <td className="px-4 py-2 border border-gray-300">
                {u.user.username}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {u.isBlocked ? (
                  <span className="text-red-500 font-bold">Removed</span>
                ) : (
                  <span className="text-green-500 font-bold">Active</span>
                )}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {u.isBlocked ? (
                  <div></div>
                ) : (
                  <button
                    className="px-3 py-1 rounded border-2"
                    onClick={() => deleteReviewCallback(u.reviewID)}
                  >
                    REMOVE
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="w-full text-left my-2">
        <h2 className="text-xl">Discussion (Thread)</h2>
        <p className="">Discussion about a rating given by a user</p>
      </div>

      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              ID
            </th>
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              Content
            </th>
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              User
            </th>
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              Status
            </th>
            <th className="px-4 py-2 font-bold uppercase border border-gray-300">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.threads.map((u: ThreadData) => (
            <tr key={u.threadID} className="hover:bg-gray-100">
              <td className="px-4 py-2 border border-gray-300">{u.threadID}</td>
              <td className="px-4 py-2 border border-gray-300">{u.content}</td>
              <td className="px-4 py-2 border border-gray-300">
                {u.user.username}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {u.isBlocked ? (
                  <span className="text-red-500 font-bold">Removed</span>
                ) : (
                  <span className="text-green-500 font-bold">Active</span>
                )}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {u.isBlocked ? (
                  <div></div>
                ) : (
                  <button
                    className="px-3 py-1 rounded border-2"
                    onClick={() => deleteThreadCallback(u.threadID)}
                  >
                    REMOVE
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
