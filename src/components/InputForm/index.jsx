import { Input } from "antd";
import React from "react";

function InputForm({
    label,
    disabled,
    register,
    errors,
    id,
    validate,
    type = "text",
    placeholder,
    fullWidth,
    style,
    isShowLabel = true,
}) {
    return (
        <div
            className={`flex flex-col  gap-1 ${fullWidth && "w-full"} ${
                !!style && style
            }`}
        >
            <div className="flex w-full items-center gap-2">
                {id && isShowLabel && (
                    <label
                        className="flex-1 font-bold text-nowrap"
                        htmlFor={id}
                    >
                        {id.slice(0, 1).toUpperCase() + id.slice(1)} :
                    </label>
                )}
                <input
                    type={type}
                    id={id}
                    defaultValue={register[id]?.value}
                    {...register(id, validate)}
                    disabled={disabled}
                    placeholder={placeholder || `Nhập ${id}`}
                    className={`flex-4 w-full p-4  border outline-main  border-main rounded  outline-primary`}
                />
            </div>
            {errors[id] && (
                <small className="text-xs text-red-500 text-end font-bold rounded">
                    {errors[id].message}
                </small>
            )}
        </div>
    );
}

export default InputForm;
