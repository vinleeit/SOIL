import { Link, To } from "react-router-dom";

type SoilTipsCardProp = {
    title: string,
    description: string,
    actionLabel?: string,
    action: To,
}

/**
 * A card component used to show the daily tip.
 * @param param0 
 * @returns 
 */
export default function SoilTipCard({
    title,
    description,
    actionLabel = "Read more",
    action,
}: SoilTipsCardProp) {
    return (
        <div className="relative flex flex-col shadow-lg sm:w-1/2 m-auto p-7 pt-10 rounded-md border-t-2">
            <div className="absolute -top-4 left-0 right-0 flex flex-row justify-center">
                <p className="text-lg border px-3 bg-lime-300 rounded-md">Tips of the Day</p>
            </div>
            <div className="flex flex-col space-y-5">
                <p className="text-3xl">{title}</p>
                <p>{description}</p>
                <div>
                    <Link to={action} className="text-lime-600">{actionLabel}</Link>
                </div>
            </div>
        </div>
    )
}