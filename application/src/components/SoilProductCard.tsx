import SoilButton from "./SoilButton";
import { Link } from "react-router-dom";

type ProductCardProp = {
  title: string;
  price: number;
  discountedPrice?: number;
  photoUrl: string;
  isSpecial: boolean;
  itemInCardQuantity?: number;
  onCardClicked?: React.MouseEventHandler<HTMLButtonElement>;
  onAddItem?: React.MouseEventHandler<HTMLButtonElement>;
  onReduceItem?: React.MouseEventHandler<HTMLButtonElement>;
  onDeleteItem?: React.MouseEventHandler<HTMLAnchorElement>;
};

/**
 * A card to display product information
 */
export default function SoilProductCard({
  title,
  price,
  discountedPrice,
  photoUrl,
  isSpecial,
  itemInCardQuantity = 0,
  onCardClicked,
  onAddItem,
  onReduceItem,
  onDeleteItem,
}: ProductCardProp) {
  return (
    <button onClick={onCardClicked} className="max-w-xs rounded-md bg-white shadow-md hover:shadow-xl">
      <div className="relative flex justify-center items-center p-5 bg-gray-50">
        {!isSpecial ? (
          <></>
        ) : (
          <span className="absolute -right-3 top-4 px-5 py-1 bg-red-50 text-red-950  rounded-md ">
            Special
          </span>
        )}
        <img src={photoUrl} alt="" className="h-48 object-contain" />
      </div>
      <div className="p-5 space-y-3 flex flex-col h-60">
        <div className="space-y-1">
          <p className="font-light text-2xl space-x-1">
            {!isSpecial ? (
              <></>
            ) : (
              <span>{`$${discountedPrice?.toFixed(2)}`}</span>
            )}
            <span
              className={!isSpecial ? "" : "text-base line-through"}
            >{`$${price.toFixed(2)}`}</span>
          </p>
          <p className="font-medium line-clamp-3">{title}</p>
        </div>
        <div className="flex-grow flex flex-col space-y-3 items-center justify-end">
          {itemInCardQuantity <= 0 ? (
            <SoilButton onClick={(event) => {
              event.stopPropagation()
              if (onAddItem) {
                onAddItem(event)
              }
            }} fullWidth outlined>
              Add To Cart
            </SoilButton>
          ) : (
            <div className="flex justify-center items-center space-x-3">
              <SoilButton outlined onClick={(event) => {
                event.stopPropagation()
                if (onReduceItem) {
                  onReduceItem(event)
                }
              }}>
                -
              </SoilButton>
              <p>{itemInCardQuantity}</p>
              <SoilButton outlined onClick={(event) => {
                event.stopPropagation()
                if (onAddItem) {
                  onAddItem(event)
                }
              }}>
                +
              </SoilButton>
            </div>
          )}
          {itemInCardQuantity > 0 ? (
            <div className="flex w-full justify-center">
              <Link to={""} onClick={(event) => {
                event.stopPropagation()
                if (onDeleteItem) {
                  onDeleteItem(event)
                }
              }} className="text-red-600">
                Remove
              </Link>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </button>
  );
}
