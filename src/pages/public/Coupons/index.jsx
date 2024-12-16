import React, { useEffect, useState } from "react";
import { Button, notification } from "antd";
import moment from "moment";
import img1 from "assets/images/bannerblack1.jpg";
import img2 from "assets/images/bannerblack2.jpg";
import Icons from "utils/icons";
import logo from "assets/logo.png";
import { getVouchers, saveVoucherByCustomer } from "apis/voucher.api";
import { formatCurrency, formatMoney } from "utils/helper";
import withBaseComponent from "hocs";
import { useSelector } from "react-redux";
function Coupons({ checkLoginBeforeAction }) {
    const [shipVouchers, setShipVoucher] = useState([]);
    const [productVouchers, setProductVouchers] = useState([]);
    const [rentalVouchers, setRentalVouchers] = useState([]);
    const { logged } = useSelector((state) => state.auth);

    useEffect(() => {
        try {
            const fetchData = async () => {
                const [shipData, productData, rentalData] = await Promise.all([
                    getVouchers({ typeVoucher: "SHIPPING" }),
                    getVouchers({ typeVoucher: "PRODUCT" }),
                    getVouchers({ typeVoucher: "RENTAL" }),
                ]);

                setShipVoucher(shipData.result.content);
                setProductVouchers(productData.result.content);
                setRentalVouchers(rentalData.result.content);
            };

            fetchData();
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 2,
                placement: "top",
            });
        }
    }, []);

    const handleSaveVoucher = async (code) => {
        try {
            await saveVoucherByCustomer(code);

            notification.success({
                message: "Đã lưu mã khuyến mãi",
                duration: 1,
                placement: "top",
            });
        } catch (error) {
            notification.warning({
                message: "Vui lòng thử lại sau..,",
                duration: 1,
                placement: "top",
            });
        }
    };

    return (
        <div className="p-10 bg-gray-100 flex flex-col items-center w-full">
            <img
                src={img1}
                alt="Banner"
                height={200}
                className="w-full h-[450px] "
            />
            <div className="bg-white rounded-xl w-11/12 max-w-6xl shadow-xl p-6 mt-5">
                {/* Khuyến mãi */}
                <div className="flex flex-wrap justify-between gap-5">
                    {shipVouchers.map((promo) => (
                        <div
                            key={promo.id}
                            className="bg-white rounded-lg p-5 flex items-stat shadow-md w-full md:w-[calc(50%-10px)] transition-transform transform hover:scale-105"
                        >
                            <div className="bg-green-500 rounded-lg flex flex-col items-center justify-center p-5">
                                <Icons.FaShippingFast size={30} />
                                <span className="mt-2 text-white">
                                    Miễn phí vận chuyển
                                </span>
                            </div>

                            <div className="p-4 flex-1">
                                <div className="text-lg font-semibold text-gray-600 italic">
                                    {promo?.discount_type == "FIXED"
                                        ? `Giảm ${formatCurrency(promo?.value)}`
                                        : `Giảm ${promo.value}% `}
                                </div>
                                <p className="text-gray-600 text-sm mb-2 ">
                                    Cho đơn hàng từ{" "}
                                    {formatMoney(promo.min_order)}đ
                                </p>
                                <p className="text-gray-600 text-sm mb-2 ">
                                    Giảm tối đa{" "}
                                    {formatMoney(promo.max_discount)}đ
                                </p>
                                <p className="text-gray-500 text-xs ">
                                    HSD:{" "}
                                    {moment(new Date(promo.expiry_date)).format(
                                        "hh:mm:ss DD/MM/YYYY"
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center justify-center pb-4">
                                <button
                                    onClick={() =>
                                        checkLoginBeforeAction(() =>
                                            handleSaveVoucher(promo.code)
                                        )
                                    }
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold"
                                >
                                    Áp Dụng
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap justify-between gap-5 mt-5">
                    {productVouchers.map((promo) => (
                        <div
                            key={promo.id}
                            className="bg-white rounded-lg p-5 flex items-center shadow-md w-full md:w-[calc(50%-10px)] transition-transform transform hover:scale-105"
                        >
                            <div className="flex-shrink-0 mr-4">
                                <img
                                    src={logo}
                                    alt="Shop logo"
                                    className="rounded-lg w-16 h-16"
                                />
                            </div>
                            <div className="p-4 flex-1">
                                <div className="text-lg font-semibold text-gray-600 italic">
                                    {promo?.discount_type == "FIXED"
                                        ? `Giảm ${formatCurrency(promo?.value)}`
                                        : `Giảm ${promo.value}% `}
                                </div>
                                <p className="text-gray-600 text-sm mb-2 ">
                                    Cho đơn hàng từ{" "}
                                    {formatMoney(promo.min_order)}đ
                                </p>
                                <p className="text-gray-600 text-sm mb-2 ">
                                    Giảm tối đa{" "}
                                    {formatMoney(promo.max_discount)}đ
                                </p>
                                <p className="text-gray-500 text-xs ">
                                    HSD:{" "}
                                    {moment(new Date(promo.expiry_date)).format(
                                        "hh:mm:ss DD/MM/YYYY"
                                    )}
                                </p>
                            </div>
                            <Button
                                onClick={() =>
                                    checkLoginBeforeAction(() =>
                                        handleSaveVoucher(promo.code)
                                    )
                                }
                                className="bg-orange-500 text-white rounded-md text-sm px-4 py-2 hover:bg-orange-400 transition-colors"
                            >
                                Lưu
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="bg-black text-white text-center py-8 mt-10">
                    <div className="text-2xl font-bold uppercase mb-4 tracking-wide">
                        PAYDAY ĐỘC QUYỀN
                    </div>
                    <div className="text-lg leading-6 mb-3">
                        Chào đón ưu đãi{" "}
                        <span className="text-yellow-400 font-bold underline">
                            giảm ít nhất 25%
                        </span>{" "}
                        ngay hôm nay!
                    </div>
                    <div className="text-lg leading-6">
                        Tận hưởng các deal hấp dẫn dưới{" "}
                        <span className="text-yellow-400 font-bold underline">
                            199K
                        </span>
                        , chỉ có tại đây.
                    </div>
                    <div className="flex justify-between gap-4 mt-6">
                        <img
                            src="https://img.pikbest.com/01/60/85/11npIkbEsTATm.jpg!w700wp"
                            alt="Deal Icon 1"
                            className="w-1/2 rounded-lg object-cover h-80"
                        />
                        <img
                            src="https://img.pikbest.com/01/60/85/11npIkbEsTATm.jpg!w700wp"
                            alt="Deal Icon 2"
                            className="w-1/2 rounded-lg object-cover h-80"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap justify-between gap-5">
                    {rentalVouchers.map((promo) => (
                        <div
                            key={promo.id}
                            className="bg-white rounded-lg p-5 flex items-center shadow-md w-full md:w-[calc(50%-10px)] transition-transform transform hover:scale-105"
                        >
                            <div className="flex-shrink-0 mr-4">
                                <Icons.FaBusinessTime className="rounded-lg w-16 h-16" />
                            </div>
                            <div className="p-4 flex-1">
                                <div className="text-lg font-semibold text-gray-600 italic">
                                    {promo?.discount_type == "FIXED"
                                        ? `Giảm ${formatCurrency(promo?.value)}`
                                        : `Giảm ${promo.value}% `}
                                </div>
                                <p className="text-gray-600 text-sm mb-2 ">
                                    Cho đơn hàng từ{" "}
                                    {formatMoney(promo.min_order)}đ
                                </p>
                                <p className="text-gray-600 text-sm mb-2 ">
                                    Giảm tối đa{" "}
                                    {formatMoney(promo.max_discount)}đ
                                </p>
                                <p className="text-gray-500 text-xs ">
                                    HSD:{" "}
                                    {moment(new Date(promo.expiry_date)).format(
                                        "hh:mm:ss DD/MM/YYYY"
                                    )}
                                </p>
                            </div>
                            <Button
                                onClick={() =>
                                    checkLoginBeforeAction(() =>
                                        handleSaveVoucher(promo.code)
                                    )
                                }
                                className="bg-orange-500 text-white rounded-md text-sm px-4 py-2 hover:bg-orange-400 transition-colors"
                            >
                                Lưu
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default withBaseComponent(Coupons);
