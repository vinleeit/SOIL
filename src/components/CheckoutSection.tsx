type CheckoutSectionProp = {
    children?: React.ReactNode,
    title: string,
}

export default function CheckoutSection({
    children,
    title
}: CheckoutSectionProp) {
    return (
        <div className="flex flex-col border shadow-md rounded-md p-3 lg:p-5 space-y-5">
            <p className="text-2xl">{title}</p>
            {children}
        </div>
    )
}