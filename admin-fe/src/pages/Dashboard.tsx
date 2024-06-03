import { gql, useSubscription } from "@apollo/client";
import { Pie } from "react-chartjs-2";
import "chart.js/auto"; // Import the required charting library
import "chartjs-plugin-datalabels";

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
  const { data: ratingData } = useSubscription<{
    ratingMetric: RatingMetric[];
  }>(RATING_METRIC_SUBSCRIPTION);

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex justify-center">
        <h1 className="text-4xl text-gray-700 font-bold my-8 mx-16">
          Dashboard
        </h1>
      </div>
      <div className="flex px-16 items-center w-full justify-center">
        <div className="">
          {ratingData?.ratingMetric && (
            <div style={{ width: "300px", height: "350px" }}>
              <Pie
                data={{
                  labels: ratingData.ratingMetric.map(
                    (rating) => `${rating.rating} Star Rating`,
                  ),
                  datasets: [
                    {
                      data: ratingData.ratingMetric.map(
                        (rating) => rating.count,
                      ),
                      backgroundColor: [
                        "#FF6384",
                        "#FFCE56",
                        "#8e5ea2",
                        "#36A2EB",
                        "#3cba9f",
                      ],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: {
                      display: true,
                      text: "Rating Distribution",
                      font: {
                        size: 20,
                      },
                    },
                    datalabels: {
                      display: true,
                      color: "white",
                      font: {
                        size: 16,
                      },
                    },
                  },
                }}
              />
            </div>
          )}{" "}
        </div>
        <div className="ml-4">
          <h2 className="text-xl mb-2 font-medium text-gray-800">
            {productLoading ? "loading..." : "Most Reviewed Item"}
          </h2>
          <div className="flex space-x-2">
            {productData?.productMetric.map((product: ProductMetric) => (
              <div
                key={product.id}
                className="w-48 bg-white border border-gray-200 rounded-lg shadow "
              >
                <img
                  className="rounded-t-lg w-48 h-32"
                  src={product.imageURL}
                  alt=""
                />
                <div className="p-5 flex flex-col justify-end">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 uppercase">
                    {product.name}
                  </h5>
                  <p className="mb-3 font-normal text-gray-700 ">
                    Review count: {product.reviewCount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col justify-center items-center">
        <h2 className="text-xl mb-2 font-medium text-gray-800">
          {reviewLoading ? "loading..." : "Latest Posted Review"}
        </h2>
        {reviewData?.newReviews.map((review) => (
          <div
            key={review.reviewID}
            className="flex items-center w-96 p-4 mb-4 text-sm text-gray-800 rounded-lg bg-blue-50"
            role="alert"
          >
            <div>
              <span className="font-bold text-sm mr-2">
                {review.user.username}:
              </span>
              {review.rating} Star - "{review.review}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
