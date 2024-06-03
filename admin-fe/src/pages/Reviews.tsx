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
    <div className="px-8 py-8 grow flex flex-col items-center">
      <div className="flex mb-4 justify-between w-full flex-col">
        <h1 className="text-2xl">Review Moderation</h1>
        <p>
          Manage reviews and threads, and prevent suspicious content, using
          badwords detection system.
        </p>
      </div>

      <div className="mb-2 flex flex-col justify-left w-full">
        <h2 className="text-xl">Reviews</h2>
        <p>Delete inappropriate review</p>
      </div>
      <div className="overflow-x-auto border w-full mb-8">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Rating
              </th>
              <th scope="col" className="px-6 py-3">
                Review
              </th>
              <th scope="col" className="px-6 py-3">
                User
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
            {data.reviews.map((review: ReviewData) => (
              <tr key={review.reviewID}>
                <td className="px-6 py-4">{review.reviewID}</td>
                <td className="px-6 py-4">{review.rating}</td>
                <td className="px-6 py-4">{review.review}</td>
                <td className="px-6 py-4">{review.user.username}</td>
                <td className="px-6 py-4">
                  {review.isBlocked ? "Removed" : "Active"}
                </td>
                <td className="px-6 py-4">
                  {review.isBlocked ? (
                    <div></div>
                  ) : (
                    <button
                      onClick={() => deleteReviewCallback(review.reviewID)}
                      className="font-medium text-white hover:underline px-2 py-1 bg-black"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-2 flex flex-col justify-left w-full">
        <h2 className="text-xl">Reviews</h2>
        <p>Delete inappropriate discussion a review</p>
      </div>
      <div className="overflow-x-auto border w-full">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Content
              </th>
              <th scope="col" className="px-6 py-3">
                User
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
            {data.threads.map((thread: ThreadData) => (
              <tr key={thread.threadID}>
                <td className="px-6 py-4">{thread.threadID}</td>
                <td className="px-6 py-4">{thread.content}</td>
                <td className="px-6 py-4">{thread.user.username}</td>
                <td className="px-6 py-4">
                  {thread.isBlocked ? "Removed" : "Active"}
                </td>
                <td className="px-6 py-4">
                  {thread.isBlocked ? (
                    <div></div>
                  ) : (
                    <button
                      onClick={() => deleteThreadCallback(thread.threadID)}
                      className="font-medium text-white hover:underline px-2 py-1 bg-black"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
