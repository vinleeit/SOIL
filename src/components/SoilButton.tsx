import React from "react"

type ButtonProp = {
    children?: React.ReactNode,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    colour?: "primary" | "secondary",
    outlined?: boolean,
    fullWidth?: boolean,
    disabled?: boolean,
}

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
