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

const PRODUCT_METRIC_SUBSCRIPTION = gql`
  subscription Subscription {
    productMetric {
      id
      imageURL
      name
      reviewCount
    }
  }
`;

type RatingMetric = {
  rating: number;
  count: number;
};

const RATING_METRIC_SUBSCRIPTION = gql`
  subscription Subscription {
    ratingMetric {
      rating
      count
    }
  }
`;

type ProductMetric = {
  id: string;
  imageURL: string;
  name: string;
  reviewCount: number;
};
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
  const { data: reviewData, loading: reviewLoading } = useSubscription<{
    newReviews: Review[];
  }>(SUBSCRIBE_NEW_REVIEWS);

  const { data: productData, loading: productLoading } = useSubscription<{
    productMetric: ProductMetric[];
  }>(PRODUCT_METRIC_SUBSCRIPTION);
  const { data: ratingData, loading: ratingLoading } = useSubscription<{
    ratingMetric: RatingMetric[];
  }>(RATING_METRIC_SUBSCRIPTION);

  return (
    <div className="grow flex flex-col items-center justify-center">
      <div className="mb-6">
        <h2>{ratingLoading ? "loading..." : "Rating distribution"}</h2>
        {ratingData?.ratingMetric.map((rating: RatingMetric) => (
          <div key={rating.rating} className="flex space-x-1">
            <p>Rating: {rating.rating}</p>
            <p>Review: {rating.count}</p>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <h2>{productLoading ? "loading..." : "Product with most reviews"}</h2>
        {productData?.productMetric.map((product: ProductMetric) => (
          <div key={product.id} className="flex space-x-1">
            <p>Rating: {product.name}</p>
            <p>Review: {product.reviewCount}</p>
            {/* add imaeg */}
          </div>
        ))}
      </div>
      <div className="mb-6">
        <h2>{reviewLoading ? "loading..." : "Latest Review"}</h2>
        {reviewData?.newReviews.map((review) => (
          <div key={review.reviewID} className="flex space-x-1">
            <p>Rating: {review.rating}</p>
            <p>Review: {review.review}</p>
            <p>User: {review.user.username}</p>
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
