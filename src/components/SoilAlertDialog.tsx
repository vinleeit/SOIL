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
        <div className="bg-stone-100 w-96 h-64 flex flex-col items-center justify-center  border-t-8 border-lime-500 ">
            <h2 className="text-2xl font-bold text-stone-700 capitalize">
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