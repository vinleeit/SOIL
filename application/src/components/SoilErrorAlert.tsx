import React from "react";

type ErrorAlertProp = {
    children?: React.ReactNode,
    action?: React.MouseEventHandler<HTMLButtonElement>,
    actionLabel?: string,
};

export default function SoilErrorAlert({
    children,
    action,
    actionLabel,
}: ErrorAlertProp) {
    return (
        <div id="alert-additional-content-2" className="p-4 mb-4 min-w-72 text-red-800 border border-red-300 rounded-lg bg-red-50" role="alert">
            <div className="flex items-center">
                <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <h3 className="text-lg font-medium">Error</h3>
            </div>
            <div className="mt-2 mb-4 text-sm">
                {children}
            </div>
            <button type="button" onClick={action} className="text-white bg-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center">
                {actionLabel ?? "Action"}
            </button>
        </div>
    );
}
