import { format } from "@cloudinary/url-gen/actions/delivery";
import React, { useEffect, useState } from "react";
import { formatCurrency, trunCateText } from "utils/helper";
import logo from "assets/logo.png";
import moment, { duration } from "moment";
import { Button, notification } from "antd";
import { useSelector } from "react-redux";
import { placeholder } from "@cloudinary/react";

const CouponCard = ({ data, onRemove, onApply, Unused }) => {
    const { selectedVouchers } = useSelector((state) => state.voucher);
    const [isSelectedVoucher, setIsSelectedVoucher] = useState();

    useEffect(() => {
        const selectedVoucher = selectedVouchers.data?.find(
            (el) => el?.id === data?.id
        );
        if (selectedVoucher) {
            setIsSelectedVoucher(true);
        }
    }, []);

    return (
        <div
            className={`relative flex items-center rounded-lg overflow-hidden p-2 ${
                Unused
                    ? "bg-gray-100  shadow shadow-black-600  opacity-70"
                    : "bg-[#E5F2FF] shadow shadow-blue-600"
            } `}
        >
            <div className="flex-shrink-0  border-r-2 border-blue-700 border-dotted px-4">
                <img
                    src={logo}
                    alt="Giảm 15K phí vận chuyển"
                    className="w-[44px] h-[44px] rounded"
                />
            </div>

            <div className="flex-1 pl-4 ">
                <div className="flex gap-2 justify-between ">
                    <div>
                        <div className="text-lg font-semibold text-gray-600 italic">
                            {data?.discount_type == "FIXED"
                                ? `Giảm ${formatCurrency(data?.value)}`
                                : `Giảm ${data.value}% ${
                                      data?.max_discount
                                          ? `tối đa ${formatCurrency(
                                                data?.max_discount
                                            )}`
                                          : ""
                                  }`}
                        </div>
                        <p>Cho đơn hàng từ {formatCurrency(data?.min_order)}</p>
                        <p>
                            HSD :{" "}
                            {moment(data?.expiry_date).format("DD/MM/YYYY")}
                        </p>
                    </div>
                    <div>
                        {Unused ? (
                            <div className="  flex justify-end">
                                <span className="text-orange-600">
                                    Không đủ điều kiện.
                                </span>
                            </div>
                        ) : (
                            <div className="  flex justify-end">
                                <Button
                                    className="bg-blue-600 text-white"
                                    onClick={() =>
                                        notification.warning({
                                            message: "Bỏ tạm ở đây chưa làm...",
                                            duration: 1,
                                            placeholder: "top",
                                        })
                                    }
                                >
                                    {isSelectedVoucher ? "Bỏ chọn" : "Áp dụng"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CouponCard;
