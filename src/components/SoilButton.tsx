import React from "react"

type ButtonProp = {
    children?: React.ReactNode,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    colour?: "primary" | "secondary",
    outlined?: boolean,
    fullWidth?: boolean,
    disabled?: boolean,
}

/**
 * Abstraction of button used throughout the web application.
 * 
 * Parameters:
 * - onClick: button action.
 * - colour (primary|secondary): primary is green and secondary is black.
 * - outlined: set the button to outlined type (border without background colour).
 * - fullwidth: set button to fullwidth.
 * - disabled: disable button action and set gray colour.
 * 
 * @param properties of a button 
 * @returns 
 */
export default function SoilButton({
    children,
    onClick,
    colour = "primary",
    outlined,
    fullWidth,
    disabled,
}: ButtonProp) {
    return (
        <button
            onClick={disabled ? undefined : onClick}
            className={
                `${fullWidth ? "w-full" : "px-3"}
                ${(outlined)
                    ? (disabled
                        ? "text-gray-400 border-gray-400"
                        : ((colour == "primary")
                            ? "bg-transparent border-lime-400 hover:bg-lime-100"
                            : "bg-transparent border-black hover:bg-stone-200"))
                    : (disabled
                        ? "text-white bg-gray-400"
                        : ((colour == "primary")
                            ? "bg-lime-400 hover:bg-lime-300"
                            : "text-white bg-black hover:bg-stone-700"))}
                py-2  border rounded-md`
            }
        >
            {children}
        </button>
    )
}
