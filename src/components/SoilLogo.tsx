import { Link } from "react-router-dom"

type LogoProp = {
    size?: "large" | "medium" | "small",
    vertical?: boolean,
}
/**
 * Abstraction of SOIL logo used throughout the web application.
 * 
 * Parameters:
 * - size (large|medium|small): size of the icon and SOIL text.
 * - vertical: set icon and text orientation to vertical.
 * 
 * @param properties of a SOIL logo 
 * @returns 
 */
export default function SoilLogo({
    size = "small",
    vertical,
}: LogoProp) {
    const sizeValue = (size == "large") ? "36px" : (size == "medium") ? "32px" : "24px"
    return (
        <Link to={"/"}>
            <h2 className={`${(size == "large") ? "text-2xl" : (size == "medium") ? "text-xl" : "text-lg"} font-bold flex ${vertical ? "flex-col" : "space-x-1.5"} items-center justify-center`}>
                <svg width={sizeValue} height={sizeValue} viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M2 12H4" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20 12H22" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 20.01L3.01 19.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 16.01L6.01 15.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9 20.01L9.01 19.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 20.01L15.01 19.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18 16.01L18.01 15.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21 20.01L21.01 19.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.3962 3.39622L15.5 6.49999C17.433 8.43299 17.433 11.567 15.5 13.5C13.567 15.433 10.433 15.433 8.50001 13.5C6.56701 11.567 6.56701 8.43299 8.50001 6.49999L11.6038 3.39621C11.8226 3.17738 12.1774 3.17738 12.3962 3.39622Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                <span>SOIL</span>
            </h2>
        </Link>
    )
}