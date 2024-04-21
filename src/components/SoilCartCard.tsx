import { Link } from "react-router-dom";
import { CartItem } from "../models/CartItem";
import SoilButton from "./SoilButton";
import { Product } from "../models/Product";
import Trash from "../assets/trash.svg";

type SoilCartCardProp = {
    cartItem: CartItem,
    itemInCardQuantity: number
    onAddItem: (product: Product) => void
    onReduceItem: (product: Product) => void
    onDeleteItem: (product: Product) => void
}

/**
 * Used to display cart items in cart page
 * @param param0 
 * @returns 
 */
export default function SoilCartCard({
    cartItem,
    itemInCardQuantity,
    onAddItem,
    onReduceItem,
    onDeleteItem,
}: SoilCartCardProp) {
    return (
        <div className="flex shadow-md border-t-2">
            <img
                src={cartItem.product.photoUrl}
                alt=""
                className="w-24 object-cover"
            />
            <div className="flex flex-col p-5 space-y-3 grow">
                <div className="flex flex-col space-y-1">
                    <div className="flex">
                        {cartItem.product.isSpecial ? (
                            <p className="px-5 py-1 bg-red-100 text-red-800  rounded-md ">
                                Special
                            </p>
                        ) : (
                            <></>
                        )}
                    </div>
                    <p>{cartItem.product.title}</p>
                    <p className="font-bold">
                        ${(cartItem.product.price * cartItem.quantity).toFixed(2)}
                    </p>
                </div>
                <div className="flex items-center w-full">
                    <div className="flex items-center space-x-3 grow">
                        <SoilButton
                            outlined
                            onClick={() => onReduceItem(cartItem.product)}
                        >
                            -
                        </SoilButton>
                        <p>{itemInCardQuantity}</p>
                        <SoilButton outlined onClick={() => onAddItem(cartItem.product)}>
                            +
                        </SoilButton>
                    </div>
                    {itemInCardQuantity > 0 ? (
                        <div className="">
                            <Link
                                to={""}
                                onClick={() => onDeleteItem(cartItem.product)}
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

    )
}