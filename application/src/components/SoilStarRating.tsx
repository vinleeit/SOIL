import { useState } from 'react';

interface StarRatingProps {
    rating: number;
    onRatingChange: (rating: number) => void;
    id?: string,
    maxRating?: number;
}

const StarRating = ({
    id,
    rating,
    onRatingChange,
    maxRating = 5
}: StarRatingProps) => {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const handleClick = (selectedRating: number) => {
        onRatingChange(selectedRating);
    };

    const handleMouseEnter = (hoverValue: number) => {
        setHoverRating(hoverValue);
    };

    const handleMouseLeave = () => {
        setHoverRating(null);
    };

    return (
        <div id={id} className="flex items-center">
            {[...Array(maxRating)].map((_, index) => {
                const starValue = index + 1;
                const isSelected = starValue <= (hoverRating || rating);

                return (
                    <span
                        key={starValue}
                        className={`cursor-pointer text-4xl transition-colors duration-200 ${isSelected ? 'text-orange-400' : 'text-gray-300'
                            }`}
                        onClick={() => handleClick(starValue)}
                        onMouseEnter={() => handleMouseEnter(starValue)}
                        onMouseLeave={handleMouseLeave}
                    >
                        &#9733;
                    </span>
                );
            })}
        </div>
    );
};

export default StarRating;