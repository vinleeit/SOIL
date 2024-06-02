import { useContext, useEffect, useRef, useState } from "react";
import { ProductDetail, Thread } from "../types/ProductDetail";
import { serviceGetProductDetail } from "../shared/services/ProductService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useShoppingCart } from "../context/ShoppingCartProvider";
import { AuthContext, AuthContextValue } from "../context/AuthContext";
import { ProfileResponse, profileService } from "../shared/services/AuthService";
import Star from "../assets/star-solid.svg";
import Trash from "../assets/trash.svg";
import SoilButton from "../components/SoilButton";
import SoilAlertDialog from "../components/SoilAlertDialog";
import { serviceDeleteReview, serviceDeleteThread } from "../shared/services/ReviewService";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams()
  const { token } = useContext(AuthContext) as AuthContextValue;
  const failureDialog = useRef<HTMLDialogElement | null>(null);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
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
        if (error) {
          setError(error);
          failureDialog.current?.showModal();
        }
      }
    }

    const fetchProfile = async () => {
      if (token) {
        const [profile, error] = await profileService(token);
        if (profile) {
          setProfile(profile);
        }

        if (error) {
          setError(error);
          failureDialog.current?.showModal();
        }
      }
    }

    fetchProfile();
    fetchProductDetail();
  }, [token]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    product && <div className="container mx-auto">
      <SoilAlertDialog
        id={"failureDialog"}
        ref={failureDialog}
        title={`Error`}
        description={error}
        buttonLabel="Ok"
        onClick={() => failureDialog.current?.close()}
      />
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
        {
          token &&
          !product.Reviews.find((review) => review.User.username == profile?.username) &&
          <SoilButton onClick={() => { navigate(`/product/${product.id}/review`) }}>
            Add Review
          </SoilButton>
        }
        {product.Reviews.map((review) => (
          <div key={review.reviewID} className="border rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(review.rating)].map((_, index) => (
                  <img key={index} src={Star} alt="" className="" />
                ))}
              </div>
              <span className="text-gray-600 ml-2">
                {review.User.username} - {new Date(review.createdAt).toLocaleDateString()}
              </span>
              {
                token &&
                review.User.username == profile?.username &&
                <>
                  <SoilButton onClick={() => {
                    navigate(`/product/${product.id}/review/${review.reviewID}/edit`, {
                      state: {
                        rating: review.rating,
                        reviewText: review.review,
                      }
                    })
                  }}>
                    Edit
                  </SoilButton>
                  <Link onClick={async () => {
                    const error = await serviceDeleteReview(token, review.reviewID)
                    if (error) {
                      setError(error);
                      failureDialog.current?.showModal();
                      return;
                    }
                    window.location.reload();
                  }} to={""} >
                    <img src={Trash} alt="" />
                  </Link>
                </>
              }
            </div>
            <p className="mt-2">{review.isBlocked ? "This review is blocked by Admin" : review.review}</p>
            <div className="flex space-x-2">
              <Link to={""} onClick={() => {
                navigate(`/product/${product.id}/review/${review.reviewID}/thread`)
              }} className="text-blue-700 underline">
                reply
              </Link>
            </div>
            <div className="mt-4">
              {review.Threads.map((thread) => (
                <ThreadItem key={thread.threadID} productId={product.id} username={profile?.username ?? ''} thread={thread} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div >
  );
}

const ThreadItem: React.FC<{ productId: number, username: string, thread: Thread }> = ({
  productId,
  username,
  thread,
}) => {
  const { token } = useContext(AuthContext) as AuthContextValue;
  const navigate = useNavigate();
  return (
    <div className="border rounded-lg p-2 mb-2 ml-4">
      <div className="flex items-center">
        <span className="font-bold">{thread.User.username}</span>
        <span className="text-gray-600 ml-2">
          {new Date(thread.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="mt-1">{thread.isBlocked ? "This reply is blocked by admin": thread.content}</p>
      <div className="flex space-x-2">
        <Link to={""} onClick={() => {
          navigate(`/product/${productId}/review/${thread.reviewID}/thread/${thread.threadID}`)
        }} className="text-blue-700 underline">
          reply
        </Link>
        {
          thread.User.username === username && <Link to={""} onClick={async () => {
            if (token) {
              const error = await serviceDeleteThread(token, thread.threadID)
              if (!error) {
                window.location.reload();
              }
            }
          }} className="text-blue-700 underline">
            delete
          </Link>
        }
        {
          thread.User.username === username && <SoilButton onClick={async () => {
            navigate(
              `/product/${productId}/thread/${thread.threadID}/edit`,
              {
                state: {
                  content: thread.content
                }
              }
            )
          }} >
            edit
          </SoilButton>
        }
      </div>
      <div className="mt-2">
        {thread.ChildThreads.map((childThread) => (
          <ThreadItem key={childThread.threadID} productId={productId} username={username} thread={childThread} />
        ))}
      </div>
    </div>
  );
};
