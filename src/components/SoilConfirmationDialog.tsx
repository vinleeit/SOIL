import React from "react"
import SoilButton from "./SoilButton"

type DialogProp = {
    id?: string,
    ref?: React.LegacyRef<HTMLDialogElement> | undefined,
    title?: string,
    description?: string,
    confirmButtonLabel?: string,
    cancelButtonLabel?: string,
    onConfirm?: React.MouseEventHandler<HTMLButtonElement> | undefined,
    onCancel?: React.MouseEventHandler<HTMLButtonElement> | undefined,
}

const SoilAlertDialog = React.forwardRef<HTMLDialogElement, DialogProp>(({
    id,
    title = "Confirmation Dialog",
    description = "Confirmation description...",
    confirmButtonLabel = "Confirm",
    cancelButtonLabel = "Cancel",
    onConfirm,
    onCancel,
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
            <div className="w-1/2 space-y-1">
                <SoilButton fullWidth onClick={onConfirm}>
                    {confirmButtonLabel}
                </SoilButton>
                <SoilButton colour="secondary" fullWidth onClick={onCancel}>
                    {cancelButtonLabel}
                </SoilButton>
            </div>
        </div>
    </dialog>
))

export default SoilAlertDialog