import { useEffect, useState } from "react";
import { ProductDetail, Review, Thread } from "../types/ProductDetail";
import { serviceGetProductDetail } from "../shared/services/ProductService";
import Star from "../assets/star-solid.svg";
import SoilButton from "../components/SoilButton";
import { Link, useParams } from "react-router-dom";
import { useShoppingCart } from "../context/ShoppingCartProvider";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const {
    getItemQuantity,
    addItem,
    reduceItem,
    deleteItem,
  } = useShoppingCart();

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (id) {
        const [product, error] = await serviceGetProductDetail(parseInt(id, 0));
        if (product) {
          setProduct(product);
        }
      }
    }
    fetchProductDetail();
  }, []);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    product && <div className="container mx-auto">
      <div className="flex">
        <div className="w-1/2">
          <img src={product.imageURL} alt={product.name} className="w-full rounded-lg shadow-lg" />
        </div>
        <div className="w-1/2 pl-8">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-4">{product.description}</p>
          <div className="mt-8">
            <span className="text-2xl font-bold">${product.price}</span>
            {product.discountAmount > 0 && (
              <span className="text-red-500 ml-2">
                ({product.discountAmount}% off)
              </span>
            )}
          </div>
          <div className="flex-grow flex flex-col space-y-3 items-center justify-end">
            {getItemQuantity(product) <= 0 ? (
              <SoilButton onClick={() => {
                addItem(product)
              }} fullWidth outlined>
                Add To Cart
              </SoilButton>
            ) : (
              <div className="flex justify-center items-center space-x-3">
                <SoilButton outlined onClick={() => {
                  reduceItem(product)
                }}>
                  -
                </SoilButton>
                <p>{getItemQuantity(product)}</p>
                <SoilButton outlined onClick={() => {
                  addItem(product)
                }}>
                  +
                </SoilButton>
              </div>
            )}
            {getItemQuantity(product) > 0 ? (
              <div className="flex w-full justify-center">
                <Link to={""} onClick={() => {
                  deleteItem(product)
                }} className="text-red-600">
                  Remove
                </Link>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {product.Reviews.map((review) => (
          <ReviewItem key={review.reviewID} review={review} />
        ))}
      </div>
    </div>
  );
};

const ReviewItem: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center">
        <div className="flex items-center">

          {[...Array(review.rating)].map((_, __) => (
            <img src={Star} alt="" className="" />
          ))}
        </div>
        <span className="text-gray-600 ml-2">
          {review.User.username} - {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="mt-2">{review.review}</p>
      <div className="mt-4">
        {review.Threads.map((thread) => (
          <ThreadItem key={thread.threadID} thread={thread} />
        ))}
      </div>
    </div>
  );
};

const ThreadItem: React.FC<{ thread: Thread }> = ({ thread }) => {
  return (
    <div className="border rounded-lg p-2 mb-2 ml-4">
      <div className="flex items-center">
        <span className="font-bold">{thread.User.username}</span>
        <span className="text-gray-600 ml-2">
          {new Date(thread.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="mt-1">{thread.content}</p>
      <div className="mt-2">
        {thread.ChildThreads.map((childThread) => (
          <ThreadItem key={childThread.threadID} thread={childThread} />
        ))}
      </div>
    </div>
  );
};

export default ProductDetailPage;