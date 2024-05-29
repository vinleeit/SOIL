import React from "react"
import SoilButton from "./SoilButton"

type DialogProp = {
    id?: string,
    ref?: React.LegacyRef<HTMLDialogElement> | undefined,
    title?: string,
    description?: string,
    buttonLabel?: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined,
}

/**
 * An alert dialog used to display important information.
 */
const SoilAlertDialog = React.forwardRef<HTMLDialogElement, DialogProp>(({
    id,
    title = "Alert Dialog",
    description = "Dialog description...",
    buttonLabel = "Close",
    onClick,
}: DialogProp, ref) => (
    <dialog
        id={id}
        open={false}
        className="backdrop:bg-stone-400 backdrop:opacity-60 rounded"
        ref={ref}
    >
        <div className="bg-stone-100 w-96 h-64 flex flex-col items-center justify-center  border-t-8 border-green-dark">
            <h2 className="text-2xl font-bold capitalize">
                {title}
            </h2>
            <p className="mb-8 mt-1 px-20 text-center">
                {description}
            </p>
            <div className="w-1/2">
                <SoilButton fullWidth onClick={onClick}>
                    {buttonLabel}
                </SoilButton>
            </div>
        </div>
    </dialog>
))

export default SoilAlertDialog