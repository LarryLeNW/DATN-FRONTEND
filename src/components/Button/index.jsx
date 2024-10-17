import { memo } from "react";
import Icons from "utils/icons";

function Button({
    name,
    handleClick,
    style,
    iconBefore,
    iconAfter,
    fw,
    disabled,
    isLoading,
}) {
    return (
        <div
            type="button"
            className={
                style ||
                `px-4 p-2 rounded-md text-white bg-main font-semibold cursor-pointer text-center ${
                    fw ? "w-full" : "w-fit"
                } ${(isLoading || disabled) && "opacity-30 cursor-not-allowed"}
        `
            }
            onClick={() => {
                !isLoading && !disabled && handleClick && handleClick();
            }}
        >
            <div className="flex gap-2 justify-center items-center">
                <div className="flex gap-2 items-center">
                    {iconBefore}
                    <span> {name}</span>
                    {iconAfter}
                </div>
                {isLoading && (
                    <div>
                        <Icons.AiOutlineLoading3Quarters className="animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(Button);
