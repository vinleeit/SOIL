import React from "react";

type ButtonProp = {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  colour?: "primary" | "secondary" | "error";
  outlined?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
};

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
      className={`${fullWidth ? "w-full" : "px-3"}
                ${
                  outlined
                    ? disabled
                      ? "text-gray-400 border-gray-400"
                      : colour == "primary"
                        ? "bg-transparent text-green-dark border-green-dark hover:bg-green-super-light"
                        : colour == "secondary"
                          ? "bg-transparent border-yellow hover:bg-yellow-light"
                          : "bg-transparent border-red-600 hover:bg-red-100"
                    : disabled
                      ? "text-white bg-gray-400"
                      : colour == "primary"
                        ? "text-white bg-green-dark hover:bg-green-dark2"
                        : colour == "secondary"
                          ? "bg-yellow-light hover:bg-yellow"
                          : "text-white bg-red-500 hover:bg-red-400"
                }
                py-2  border rounded-md relative`}
    >
      {children}
    </button>
  );
}
