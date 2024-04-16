import Star from "../assets/star.svg"
import ChatBubble from "../assets/chat-buble.svg"
import SoilButton from "./SoilButton"
import { Link } from "react-router-dom"

type ProductCardProp = {
    title: string
    price: number
    averageRating: number
    reviewCount: number
    photoUrl: string
    isSpecial: boolean
    itemInCardQuantity?: number
    onAddItem?: React.MouseEventHandler<HTMLButtonElement>
    onReduceItem?: React.MouseEventHandler<HTMLButtonElement>
    onDeleteItem?: React.MouseEventHandler<HTMLAnchorElement>
}

export default function SoilProductCard({
    title,
    price,
    averageRating,
    reviewCount,
    photoUrl,
    isSpecial,
    itemInCardQuantity = 0,
    onAddItem,
    onReduceItem,
    onDeleteItem,
}: ProductCardProp) {
    return (
        <div className="max-w-xs rounded-md bg-white shadow-md">
            <div className="relative flex justify-center items-center p-5 bg-gray-50">
                {
                    !isSpecial
                        ? <></>
                        : <span className="absolute -right-3 top-4 px-5 py-1 bg-red-100 text-red-800  rounded-md ">Special</span>
                }
                <div className="absolute flex right-3 -bottom-3 space-x-3 bg-lime-50 rounded-md px-3 py-0.5 shadow-md">
                    <div className="space-x-1">
                        <img src={Star} alt="" className="inline-flex items-center size-4" />
                        <span className="text-sm">{averageRating.toFixed(1)}</span>
                    </div>
                    <div className="space-x-1">
                        <img src={ChatBubble} alt="" className="inline-flex items-center size-4" />
                        <span className="text-sm">{reviewCount}</span>
                    </div>
                </div>
                <img
                    src={photoUrl}
                    alt=""
                    className="h-48 object-contain" />
            </div>
            <div className="p-5 space-y-3">
                <div className="space-y-1">
                    <p className="font-light text-2xl">{`\$${price.toFixed(2)}`}</p>
                    <p className="font-medium">{title}</p>
                </div>
                <div className="flex flex-col space-y-3 items-center">
                    {
                        (itemInCardQuantity <= 0) ? (
                            <SoilButton onClick={onAddItem} outlined fullWidth colour="primary">
                                Add To Cart
                            </SoilButton>
                        ) : (
                            <div className="flex justify-center items-center space-x-3">
                                <SoilButton outlined onClick={onReduceItem}>
                                    -
                                </SoilButton>
                                <p>{itemInCardQuantity}</p>
                                <SoilButton outlined onClick={onAddItem}>
                                    +
                                </SoilButton>
                            </div>
                        )
                    }
                    <div className="flex w-full space-x-3">
                        <div className={`flex w-full ${(itemInCardQuantity <= 0) ? "justify-center" : "justify-end"}`}>
                            <Link to={""} className="text-lime-600">
                                Details
                            </Link>
                        </div>
                        {
                            (itemInCardQuantity > 0)
                                ? <span>|</span>
                                : <></>
                        }
                        {
                            (itemInCardQuantity > 0)
                                ? <div className="flex w-full justify-start">
                                    <Link to={""} onClick={onDeleteItem} className="text-red-600">
                                        Remove
                                    </Link>
                                </div>
                                : <></>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}