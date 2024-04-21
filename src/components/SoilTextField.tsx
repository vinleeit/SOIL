type TextFieldProp = {
    type?: "text" | "email" | "url" | "password" | "number" | "tel" | "search",
    label?: string,
    placeholder?: string,
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
    value?: string,
    errMsg?: string,
    disabled?: boolean,
}

/**
 * Text field with label and error prompt.
 * @param param0 
 * @returns 
 */
export default function SoilTextField({
    type = "text",
    label,
    placeholder,
    onChange,
    value,
    errMsg,
    disabled,
}: TextFieldProp) {
    return (
        <div className="flex flex-col w-full">
            {label && <label className="ml-1 mb-0.5 text-sm">{label}</label>}
            <input
                type={type}
                className="w-full rounded focus:border-lime-400 border-gray-300 focus:ring focus:ring-lime-400 focus:ring-opacity-45"
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                disabled={disabled}
            />
            {errMsg && <p className="ml-1 mt-0.5 text-red-400 text-sm">{errMsg}</p>}
        </div>
    )
}