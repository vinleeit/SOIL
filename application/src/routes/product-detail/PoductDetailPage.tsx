import { useContext, useEffect, useRef, useState } from "react";
import { serviceGetProductDetail } from "../../shared/services/ProductService";
import { Link, useParams } from "react-router-dom";
import { useShoppingCart } from "../../context/ShoppingCartProvider";
import { AuthContext, AuthContextValue } from "../../context/AuthContext";
import { ProfileResponse, profileService } from "../../shared/services/AuthService";
import SoilButton from "../../components/SoilButton";
import SoilAlertDialog from "../../components/SoilAlertDialog";
import { serviceAddReview } from "../../shared/services/ReviewService";
import SoilStarRating from "../../components/SoilStarRating";
import ReviewItem from "./ReviewItem";
import { ProductDetail } from "../../types/ProductDetail";
import { FollowingResponse, serviceGetFollowings } from "../../shared/services/FollowService";
import { GetProductPrice } from "../../types/Product";

export default function ProductDetailPage() {
  const { id } = useParams()
  const { token } = useContext(AuthContext) as AuthContextValue;
  const failureDialog = useRef<HTMLDialogElement | null>(null);
  const [error, setError] = useState('');
  const [followings, setFollowings] = useState<FollowingResponse[]>([])
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const {
    getItemQuantity,
    addItem,
    reduceItem,
    deleteItem,
  } = useShoppingCart();

  const fetchProductDetail = async (): Promise<boolean> => {
    if (id) {
      const [product, error] = await serviceGetProductDetail(parseInt(id, 0));
      if (product) {
        setProduct(product);
      }
      if (error) {
        setError(error);
        failureDialog.current?.showModal();
        return false
      }
      return true
    }
    return false
  }

  useEffect(() => {
    const fetchGetFollowings = async () => {
      if (token) {
        const [followings, error] = await serviceGetFollowings(token ?? '')

        if (followings) {
          setFollowings(followings)
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
    fetchGetFollowings();
  }, [token]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const isSpecial = product.product.discountAmount > 0
  return (
    product && <div className="container mx-auto py-24 px-8">
      <SoilAlertDialog
        id={"failureDialog"}
        ref={failureDialog}
        title={`Error`}
        description={error}
        buttonLabel="Ok"
        onClick={() => failureDialog.current?.close()}
      />
      <div className="flex">
        <div className="w-1/2 flex justify-center items-center">
          <img src={product.product.imageURL} className="max-w-full max-h-96 rounded-lg shadow-lg" />
        </div>
        <div className="w-1/2 pl-8">
          <h1 className="text-3xl font-bold">{product.product.name}</h1>
          <p className="text-gray-600 mt-4">{product.product.description}</p>
          <div className="mt-8">
            <p className="font-light text-2xl space-x-1">
              {!isSpecial ? (
                <></>
              ) : (
                <span>{`$${GetProductPrice(product.product)?.toFixed(2)}`}</span>
              )}
              <span
                className={!isSpecial ? "" : "text-base line-through text-red-700"}
              >{`$${product.product.price.toFixed(2)}`}</span>
            </p>
          </div>
          <div className="flex-grow flex flex-col space-y-3 items-center justify-end">
            {getItemQuantity(product.product) <= 0 ? (
              <SoilButton onClick={() => {
                addItem(product.product)
              }} fullWidth outlined>
                Add To Cart
              </SoilButton>
            ) : (
              <div className="flex justify-center items-center space-x-3">
                <SoilButton outlined onClick={() => {
                  reduceItem(product.product)
                }}>
                  -
                </SoilButton>
                <p>{getItemQuantity(product.product)}</p>
                <SoilButton outlined onClick={() => {
                  addItem(product.product)
                }}>
                  +
                </SoilButton>
              </div>
            )}
            {getItemQuantity(product.product) > 0 ? (
              <div className="flex w-full justify-center">
                <Link to={""} onClick={() => {
                  deleteItem(product.product)
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
          token && <AddReviewSection
            productId={product.product.id}
            refresh={fetchProductDetail} />

        }
        {product.reviews.map((review) => {
          return <ReviewItem
            key={review.reviewID}
            profile={profile}
            followings={followings}
            review={review}
            setFollowings={setFollowings}
            refresh={fetchProductDetail} />
        })}
      </div>
    </div >
  );
}

const AddReviewSection: React.FC<{ productId: number, refresh: () => Promise<boolean> }> = ({
  productId,
  refresh,
}) => {
  const { token } = useContext(AuthContext) as AuthContextValue;

  const failureDialog = useRef<HTMLDialogElement | null>(null);
  const successDialog = useRef<HTMLDialogElement | null>(null);
  const [error, setError] = useState('');
  const [rating, setRating] = useState<number>(4)
  const [content, setContent] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const error = await serviceAddReview(token ?? '', productId, {
      rating: rating,
      review: content,
    })
    if (error) {
      setError(error)
      failureDialog.current?.showModal()
    } else {
      if (await refresh()) {
        setRating(4)
        setContent('')
        successDialog.current?.showModal()
      }
    }
  }

  return (
    <>
      <SoilAlertDialog
        id={"failureDialog"}
        ref={failureDialog}
        title={`Error`}
        description={error}
        buttonLabel="Ok"
        onClick={() => failureDialog.current?.close()}
      />
      <SoilAlertDialog
        id={"successDialog"}
        ref={successDialog}
        title={"Submit Review Success"}
        description="Thank you, your feedback has been submitted."
        buttonLabel="Close"
        onClick={() => successDialog.current?.close()}
      />
      <form onSubmit={handleSubmit} className="flex flex-col mb-6 space-y-3">
        <div className="flex flex-col space-y-2">
          <label htmlFor={"star"} className="text-gray-600" >Rate this product</label>
          <SoilStarRating id={"star"} rating={rating} onRatingChange={(rating) => { setRating(rating) }}></SoilStarRating>
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor={"comment"} className="text-gray-600" >Leave a comment</label>
          <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
            <textarea id={"comment"} rows={6}
              value={content}
              className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
              placeholder="Write a comment..."
              maxLength={180}
              onChange={(e) => setContent(e.target.value)} >
            </textarea>
            <span className={`text-sm ${content.length < 180 ? 'text-gray-500' : 'text-red-400'}`}>
              {content.length}/180
            </span>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <SoilButton>
            Post comment
          </SoilButton>
        </div>
      </form>

    </>
  )
}