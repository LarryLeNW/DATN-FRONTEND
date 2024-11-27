import React from "react";
import { trunCateText } from "utils/helper";

const CouponCard = ({
    title = "Giảm 15K phí vận chuyển",
    onRemove,
    onApply,
}) => {
    return (
        <div
            className="relative flex items-center rounded-lg overflow-hidden"
            style={{
                backgroundColor: "#E5F2FF",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "8px",
                border: "2px solid #017FFF",
            }}
        >
            <div className="flex-shrink-0  border-r-2 border-blue-700 border-dotted px-4">
                <img
                    src="https://salt.tikicdn.com/cache/128x128/ts/upload/11/b7/94/0ea7a1742603abb1f645e0147fe1dd17.jpg"
                    alt="Giảm 15K phí vận chuyển"
                    className="w-[44px] h-[44px] rounded"
                />
            </div>

            <div className="flex-1 pl-4 ">
                <div className="text-lg font-semibold text-gray-600 italic">
                    {trunCateText(title, 24)}
                </div>
            </div>
        </div>
    );
};

export default CouponCard;
