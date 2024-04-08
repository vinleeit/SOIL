type TextFieldProp = {
    type?: "text" | "email" | "url" | "password" | "number" | "tel" | "search",
    placeholder?: string,
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
    value?: string,
    errMsg?: string,
}

export default function SoilTextField({
    type = "text",
    placeholder,
    onChange,
    value,
    errMsg,
}: TextFieldProp) {
    return (
        <div>
            <input
                type={type}
                className="w-full rounded focus:border-lime-400 border-gray-300 focus:ring focus:ring-lime-400 focus:ring-opacity-45"
                placeholder={placeholder}
                onChange={onChange}
                value={value}
            />
            {errMsg && <p className="text-red-400">{errMsg}</p>}
        </div>
    )
}