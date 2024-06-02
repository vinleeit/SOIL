import React, { useState, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SoilAlertDialog from '../../components/SoilAlertDialog';
import { serviceAddReview } from '../../shared/services/ReviewService';
import { AuthContext, AuthContextValue } from '../../context/AuthContext';
import SoilButton from '../../components/SoilButton';

function AddReview() {
    const { productId } = useParams();
    const { token } = useContext(AuthContext) as AuthContextValue;
    const navigate = useNavigate();
    const failureDialog = useRef<HTMLDialogElement | null>(null);
    const [error, setError] = useState('');
    const [ratingError, setRatingError] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [rating, setRating] = useState<number>(0);
    const [reviewText, setReviewText] = useState<string>('');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let success = true
        if (rating == 0) {
            setRatingError("Please select rating");
            success = false;
        } else {
            setRatingError("");
        }
        if (reviewText.length == 0) {
            setReviewError("Review is required");
            success = false;
        } else {
            setReviewError("")
        }

        if (success && token && productId) {
            const error = await serviceAddReview(token, parseInt(productId, 0), {
                rating: rating,
                review: reviewText,
            });
            if (error) {
                setError(error);
                failureDialog.current?.showModal();
                return
            }
            navigate(`/product/${productId}`)
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <SoilAlertDialog
                id={"failureDialog"}
                ref={failureDialog}
                title={`Error`}
                description={error}
                buttonLabel="Ok"
                onClick={() => failureDialog.current?.close()}
            />
            <h2 className="text-2xl font-bold mb-4">Add a Review</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="rating" className="block font-medium mb-1">
                        Rating
                    </label>
                    <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={0}>Select a rating</option>
                        <option value={1}>1 star</option>
                        <option value={2}>2 stars</option>
                        <option value={3}>3 stars</option>
                        <option value={4}>4 stars</option>
                        <option value={5}>5 stars</option>
                    </select>
                    {ratingError && <p className="ml-1 mt-0.5 text-red-400 text-sm">{ratingError}</p>}
                </div>
                <div>
                    <label htmlFor="reviewText" className="block font-medium mb-1">
                        Review
                    </label>
                    <textarea
                        id="reviewText"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Write your review..."
                    ></textarea>
                    {reviewError && <p className="ml-1 mt-0.5 text-red-400 text-sm">{reviewError}</p>}
                </div>
                <SoilButton>
                    Submit Review
                </SoilButton>
            </form>
        </div>
    );
}

export default AddReview;