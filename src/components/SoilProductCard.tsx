import Star from "../assets/star.svg"
import ChatBubble from "../assets/chat-buble.svg"
import SoilButton from "./SoilButton"
import { Product } from "../models/Product"
import { Link } from "react-router-dom"

export default function SoilProductCard(
    product: Product,
) {
    return (
        <div className="max-w-xs m-5 rounded-md bg-white shadow-md">
            <div className="relative flex justify-center items-center p-5 bg-gray-50">
                {
                    !product.isSpecial
                        ? <></>
                        : <span className="absolute -right-3 top-4 px-5 py-1 bg-red-100 text-red-800  rounded-md ">Special</span>
                }
                <div className="absolute flex right-3 -bottom-3 space-x-3 bg-lime-50 rounded-md px-3 py-0.5 shadow-md">
                    <div className="space-x-1">
                        <img src={Star} alt="" className="inline-flex items-center size-4" />
                        <span className="text-sm">{product.stars}</span>
                    </div>
                    <div className="space-x-1">
                        <img src={ChatBubble} alt="" className="inline-flex items-center size-4" />
                        <span className="text-sm">{product.reviews}</span>
                    </div>
                </div>
                <img
                    src={product.photoUrl}
                    alt=""
                    className="h-64" />
            </div>
            <div className="p-5 space-y-3">
                <div className="space-y-1">
                    <p className="font-light text-2xl">{`\$${product.price}`}</p>
                    <p className="font-medium">{product.title}</p>
                </div>
                <div className="flex flex-col space-y-3 items-center">
                    <SoilButton outlined fullWidth colour="primary">
                        Add To Cart
                    </SoilButton>
                    <Link to={""} className="text-lime-600">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    )
}