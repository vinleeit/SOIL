import { gql, useSubscription } from "@apollo/client";
import { Link } from "react-router-dom";

const SUBSCRIBE_NEW_REVIEWS = gql`
  subscription {
    newReviews {
      reviewID
      rating
      review
      isBlocked
      user {
        id
        username
      }
    }
  }
`;

type Review = {
  reviewID: number;
  rating: number;
  review: string;
  isBlocked: boolean;
  user: User;
};

type User = {
  id: number;
  username: string;
};

export default function Dashboard() {
  const { data, loading } = useSubscription<{ newReviews: Review[] }>(
    SUBSCRIBE_NEW_REVIEWS,
  );
  return (
    <div className="grow flex items-center justify-center">
      <div className="mr-6">
        <h2>{loading ? "loading..." : "Latest Review"}</h2>
        {data?.newReviews.map((review) => (
          <div key={review.reviewID} className="flex space-x-1">
            <p>Rating: {review.rating}</p>
            <p>Review: {review.review}</p>
            <p>User: {review.user.username}</p>
            {/* Render other review details */}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Link
          to={"/users"}
          className=" text-center border border-black p-4 rounded hover:shadow-xl"
        >
          User
          <br />
          Management
        </Link>
        <Link
          to={"/reviews"}
          className=" text-center border border-black p-4 rounded hover:shadow-xl"
        >
          Review
          <br />
          Management
        </Link>
        <Link
          to={"/products"}
          className=" text-center border border-black p-4 rounded hover:shadow-xl"
        >
          Product
          <br />
          Management
        </Link>
      </div>
    </div>
  );
}
