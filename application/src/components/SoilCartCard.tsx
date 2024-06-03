import { Link } from "react-router-dom";
import { CartItem } from "../types/CartItem";
import SoilButton from "./SoilButton";
import Trash from "../assets/trash.svg";
import { GetProductPrice, Product } from "../types/Product";

type SoilCartCardProp = {
  cartItem: CartItem;
  itemInCardQuantity: number;
  onCardClicked?: React.MouseEventHandler<HTMLDivElement>;
  onAddItem: (product: Product) => void;
  onReduceItem: (product: Product) => void;
  onDeleteItem: (product: Product) => void;
};

/**
 * Used to display cart items in cart page
 */
export default function SoilCartCard({
  cartItem,
  itemInCardQuantity,
  onCardClicked,
  onAddItem,
  onReduceItem,
  onDeleteItem,
}: SoilCartCardProp) {
  const isProductSpecial = cartItem.product.discountAmount > 0;
  return (
    <div onClick={onCardClicked} className="flex shadow-md border-t-2">
      <img
        src={cartItem.product.imageURL}
        alt=""
        className="w-24 object-cover"
      />
      <div className="flex flex-col p-5 space-y-3 grow">
        <div className="flex flex-col space-y-1">
          <div className="flex">
            {isProductSpecial ? (
              <p className="px-5 py-1 bg-red-100 text-red-800  rounded-md ">
                Special
              </p>
            ) : (
              <></>
            )}
          </div>
          <p>{cartItem.product.name}</p>
          <p className="font-bold space-x-1">
            {!isProductSpecial ? (
              <></>
            ) : (
              <span>{`$${GetProductPrice(cartItem.product).toFixed(2)}`}</span>
            )}
            <span
              className={
                !isProductSpecial ? "" : "text-sm line-through"
              }
            >{`$${cartItem.product.price.toFixed(2)}`}</span>
          </p>
        </div>
        <div className="flex items-center w-full">
          <div className="flex items-center space-x-3 grow">
            <SoilButton outlined onClick={(event) => {
              event.stopPropagation()
              if (onReduceItem) {
                onReduceItem(cartItem.product)
              }
            }}>
              -
            </SoilButton>
            <p>{itemInCardQuantity}</p>
            <SoilButton outlined onClick={(event) => {
              event.stopPropagation()
              if (onAddItem) {
                onAddItem(cartItem.product)
              }
            }}>
              +
            </SoilButton>
          </div>
          {itemInCardQuantity > 0 ? (
            <div className="">
              <Link
                to={""}
                onClick={(event) => {
                  event.stopPropagation()
                  if (onDeleteItem) {
                    onDeleteItem(cartItem.product)
                  }
                }}
                className="text-red-600"
              >
                <img src={Trash} alt="" />
              </Link>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

