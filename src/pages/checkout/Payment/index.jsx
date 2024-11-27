import { Modal, notification, Radio, Skeleton, Space, Tooltip } from "antd";
import { getDefaultDelivery } from "apis/delivery.api";
import logo from "assets/logo.png";
import paths from "constant/paths";
import withBaseComponent from "hocs";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { formatMoney } from "utils/helper";
import Icons from "utils/icons";
import VoucherForm from "../VoucherForm";
import CouponCard from "../VoucherForm/Coupon";
import { createOrder } from "apis/order.api";
import { changeLoading, setMessageData } from "store/slicers/common.slicer";
import { generatePath } from "react-router-dom";

function Payment({ dispatch, navigate }) {
    const { cartList, selectedCarts } = useSelector((state) => state.cart);
    const [defaultDelivery, setDefaultDelivery] = useState({
        isLoading: false,
        data: null,
    });

    const [isShowModal, setIsShowModal] = useState(false);

    const [totalPayment, setTotalPayment] = useState(0);
    const [totalDiscountVoucher, setTotalDiscountVoucher] = useState(0);

    const { userVouchers, selectedVouchers } = useSelector(
        (state) => state.voucher
    );
    const [typePayment, setTypePayment] = useState("COD");

    const [applyVoucherMessage, setVoucherMessage] = useState(
        "Chọn hoặc nhập mã voucher khác"
    );

    const calculate = () => {
        const totalPaymentCal = selectedCarts.data?.reduce(
            (sum, cart) => (sum += cart?.sku?.price * cart.quantity),
            0
        );

        setTotalDiscountVoucher(
            selectedVouchers.data.reduce((sum, el) => {
                if (el.discount_type === "FIXED") {
                    return (sum += el.value);
                } else if (el.discount_type === "PERCENT") {
                    return (sum += (el.value / 100) * totalPaymentCal);
                }
                return sum;
            }, 0)
        );

        setTotalPayment(totalPaymentCal);

        if (!selectedCarts.data.length) {
            const minOrderItem = userVouchers?.data.reduce(
                (minItem, item) =>
                    Number(item?.min_order ?? Infinity) <
                    Number(minItem?.min_order ?? Infinity)
                        ? item
                        : minItem,
                null
            );

            if (minOrderItem) {
                setVoucherMessage(
                    `Giảm ${formatMoney(
                        minOrderItem?.value
                    )}đ cho đơn từ ${formatMoney(minOrderItem?.min_order)}đ`
                );
            }
            return;
        }

        setVoucherMessage("Chọn hoặc nhập mã voucher khác");
    };

    useEffect(() => {
        const fetchDefaultDelivery = async () => {
            try {
                setDefaultDelivery({ isLoading: true });
                const res = await getDefaultDelivery();
                setDefaultDelivery({ data: res?.result });
            } catch (error) {
                notification.warning({
                    placement: "top",
                    message: error.message,
                    duration: 2,
                });
            }
            setDefaultDelivery((prev) => ({ ...prev, isLoading: false }));
        };

        fetchDefaultDelivery();
    }, []);

    useEffect(() => {
        calculate();
    }, [userVouchers]);

    const rightPanel = useMemo(
        () => (
            <div className="rounded-md md:sticky top-0">
                <div className="flex flex-col gap-2">
                    <div className="bg-white p-4">
                        {userVouchers?.loading || defaultDelivery.isLoading ? (
                            <div className="flex flex-col gap-2">
                                <Skeleton.Input
                                    active
                                    style={{ width: 120, height: 20 }}
                                />
                                <Skeleton.Input
                                    active
                                    style={{ width: 200, height: 20 }}
                                />
                            </div>
                        ) : (
                            <div className="flex justify-between">
                                <span className="text-1xl ">
                                    {defaultDelivery.data ? (
                                        <div>
                                            <div className=" font-bold flex gap-4 items-center mb-2">
                                                Giao tới :{" "}
                                            </div>
                                            <p className="font-bold flex gap-2 text-black">
                                                <span className=" border-r-2 pr-2">
                                                    {
                                                        defaultDelivery.data
                                                            ?.username
                                                    }
                                                </span>
                                                <span>
                                                    {
                                                        defaultDelivery.data
                                                            ?.numberPhone
                                                    }
                                                </span>
                                            </p>
                                            <div className="flex gap-2">
                                                <span className="text-green-800 bg-green-100 rounded h-fit text-sm p-1 ">
                                                    {
                                                        defaultDelivery.data
                                                            ?.typeAddress
                                                    }
                                                </span>

                                                <span>
                                                    {
                                                        defaultDelivery.data
                                                            ?.street
                                                    }
                                                    {defaultDelivery.data
                                                        ?.ward && (
                                                        <span>
                                                            ,{" "}
                                                            {
                                                                defaultDelivery
                                                                    .data?.ward
                                                            }
                                                        </span>
                                                    )}
                                                    {defaultDelivery.data
                                                        ?.district && (
                                                        <span>
                                                            ,{" "}
                                                            {
                                                                defaultDelivery
                                                                    .data
                                                                    ?.district
                                                            }
                                                        </span>
                                                    )}
                                                    {defaultDelivery.data
                                                        ?.city && (
                                                        <span>
                                                            ,{" "}
                                                            {
                                                                defaultDelivery
                                                                    .data?.city
                                                            }
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            Vui lòng cập nhật địa chỉ giao ...
                                        </div>
                                    )}
                                </span>
                                <span className="text-sm text-blue-500 cursor-pointer text-nowrap">
                                    {defaultDelivery.data
                                        ? "Thay đổi"
                                        : "Cập nhật"}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="bg-white p-4">
                        {userVouchers?.loading || defaultDelivery.isLoading ? (
                            <div className="flex flex-col gap-2">
                                <Skeleton.Input
                                    active
                                    style={{ width: 120, height: 20 }}
                                />
                                <Skeleton.Input
                                    active
                                    style={{ width: 200, height: 20 }}
                                />
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between mb-2">
                                    <p>Khuyến mãi</p>
                                    <p className="flex gap-2 items-center ">
                                        <span className="text-slate-500">
                                            Có thể chọn 2
                                        </span>
                                        <Tooltip title="Áp dụng tối đa 1 Mã giảm giá Sản Phẩm và 1 Mã Vận Chuyển">
                                            <Icons.CiCircleInfo className="text-lg" />
                                        </Tooltip>
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {selectedVouchers.data?.map((el) => (
                                        <CouponCard data={el} />
                                    ))}
                                </div>
                                <div
                                    className="flex font-bold justify-end gap-2 text-blue-600 items-center text-bold cursor-pointer"
                                    onClick={() => setIsShowModal(true)}
                                >
                                    <span>{applyVoucherMessage}</span>
                                    <Icons.IoIosArrowDropright size={18} />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="bg-white p-4">
                        <ul className=" space-y-4">
                            <li className="flex flex-wrap gap-4 text-base ">
                                <span className="text-slate-500">
                                    Tổng tiền hàng:{" "}
                                </span>
                                <span className="ml-auto ">
                                    {formatMoney(totalPayment)}đ
                                </span>
                            </li>
                            <li className="flex flex-wrap gap-4 text-base  text-gray-800">
                                <span className="text-slate-500">
                                    Giảm giá từ voucher:{" "}
                                </span>
                                <span className="ml-auto  text-green-600">
                                    -{formatMoney(totalDiscountVoucher)}đ
                                </span>
                            </li>
                            <hr />
                            <li className="flex flex-wrap gap-4 text-base font-bold text-gray-800">
                                <span>Tổng tiền thanh toán: </span>
                                <span className="ml-auto font-bold">
                                    {formatMoney(
                                        totalPayment - totalDiscountVoucher
                                    )}
                                    đ
                                </span>
                            </li>
                        </ul>
                        <div className="mt-8 space-y-2">
                            <button
                                type="button"
                                className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                onClick={() => handlePayment()}
                            >
                                Xác nhận đặt hàng
                            </button>
                            <button
                                type="button"
                                className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-transparent text-gray-800 border border-gray-300 rounded-md"
                                onClick={() => navigate(paths.CHECKOUT.CART)}
                            >
                                Quay lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ),
        [
            defaultDelivery,
            selectedCarts.data,
            cartList,
            totalDiscountVoucher,
            totalPayment,
        ]
    );

    const leftPanel = useMemo(
        () => (
            <div className="md:col-span-2  rounded-md flex gap-4 flex-col">
                <div className="bg-light pt-2 px-2 rounded ">
                    <div className="flex justify-between items-center px-4">
                        <img
                            src={logo}
                            alt=""
                            className="h-[40px] w-[40px] object-contain"
                        />
                        <h2 className="text-2xl font-bold text-primary ">
                            Thanh toán
                        </h2>
                    </div>
                    <hr className="border-gray-300 mt-2 pb-2" />
                </div>
                <div className="bg-white py-2 px-4 rounded flex flex-col gap-2">
                    <h1 className="text-bold text-lg">
                        Chọn hình thức giao hàng
                    </h1>
                    <div className="p-4 bg-[#E5F2FF] w-fit rounded">
                        <Radio checked={true}>
                            <div className="flex gap-2 items-center font-bold">
                                <span>Giao hàng tiết kiệm</span>
                                <span className="px-1 text-green-700 bg-white rounded">
                                    -15k
                                </span>
                            </div>
                        </Radio>
                    </div>
                    <div className="text-end text-gray-400 italic">
                        Vui lòng kiểm tra lại sản phẩm trước khi thanh toán
                    </div>
                    <div className="flex flex-col gap-2 ">
                        {selectedCarts.data.map((el) => (
                            <div className="flex gap-2 py-4 px-6 rounded-lg  shadow ">
                                <div className="w-14 h-14 shrink-0 bg-white p-2 rounded-md">
                                    <img
                                        src={el?.sku?.images.split(",")[0]}
                                        alt={el?.product?.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <div className="text-wrap text-gray-600">
                                        {el.product.name}
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex gap-4">
                                            <p>SL : x{el.quantity}</p>
                                            {el?.sku?.attributes["color"] && (
                                                <p>
                                                    <span className="text-gray-500">
                                                        Color :{" "}
                                                    </span>
                                                    <span className="font-bold">
                                                        {
                                                            el?.sku?.attributes[
                                                                "color"
                                                            ]
                                                        }
                                                    </span>
                                                </p>
                                            )}
                                            {el?.sku?.attributes["size"] && (
                                                <p>
                                                    <span className="text-gray-500">
                                                        Size :{" "}
                                                    </span>
                                                    <span className="font-bold">
                                                        {
                                                            el?.sku?.attributes[
                                                                "size"
                                                            ]
                                                        }
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <del className="text-gray-500">
                                                {formatMoney(
                                                    Math.round(
                                                        (el.sku.price *
                                                            el.quantity) /
                                                            (1 -
                                                                el.sku
                                                                    .discount /
                                                                    100) /
                                                            1000
                                                    ) * 1000
                                                )}
                                                {" đ"}
                                            </del>
                                            <span className="text-red-400">
                                                {formatMoney(
                                                    el.quantity * el.sku.price
                                                )}
                                                {" đ"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white py-2 px-4 rounded flex flex-col gap-2">
                    <h1 className="text-bold text-lg">
                        Chọn phương thức thanh toán
                    </h1>
                    <div className="p-4">
                        <Radio.Group
                            onChange={(e) => setTypePayment(e.target.value)}
                            defaultValue={typePayment}
                        >
                            <Space direction="vertical" className="w-full">
                                <Radio
                                    value="ZaloPay"
                                    className="flex items-center"
                                >
                                    <div className="flex items-center gap-2">
                                        <img
                                            src="https://salt.tikicdn.com/ts/upload/2f/43/da/dd7ded6d3659036f15f95fe81ac76d93.png"
                                            alt="ZaloPay"
                                            className="w-6 h-6"
                                        />
                                        <span className="text-gray-800 font-medium">
                                            Ví ZaloPay
                                        </span>
                                    </div>
                                </Radio>

                                <Radio
                                    value="COD"
                                    className="flex items-center"
                                >
                                    <div className="flex items-center gap-2">
                                        <img
                                            src="https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png"
                                            alt="COD"
                                            className="w-6 h-6"
                                        />
                                        <span className="text-gray-800 font-medium">
                                            Thanh toán tiền mặt
                                        </span>
                                    </div>
                                </Radio>
                            </Space>
                        </Radio.Group>
                    </div>
                </div>
            </div>
        ),
        []
    );

    const handlePayment = async () => {
        dispatch(changeLoading(true));

        const data = {
            payment: {
                amount: totalPayment - totalDiscountVoucher,
                method: typePayment,
                status: "PENDING",
            },
            orderDetails: selectedCarts.data.map((cart) => ({
                quantity: cart.quantity,
                productId: cart.product.id,
                skuId: cart.sku.id,
                cart,
            })),
        };
        try {
            const res = await createOrder(data);
            notification.success({
                message: "Đặt hàng thành công",
                duration: 1,
            });
            dispatch(
                setMessageData({
                    isShow: true,
                    typeEffect: {
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                    },
                })
            );
            navigate(
                generatePath(paths.CHECKOUT.SUCCESS_PAYMENT, {
                    order_code: res.result,
                })
            );
        } catch (error) {
            notification.error({
                message: error?.message,
                duration: 2,
            });
        }
        dispatch(changeLoading(false));
    };

    return (
        <div className="font-sans mx-auto bg-gray-100 min-h-screen">
            <div className="p-1 bg-green-400 text-center text-lg text-white font-bold italic">
                Uy tín làm nên thương hiệu
            </div>
            <Modal
                width={500}
                open={isShowModal}
                onCancel={() => setIsShowModal(false)}
                footer={false}
                closeIcon={
                    <div className="bg-red-400 text-white p-1 rounded">
                        <Icons.IoIosCloseCircleOutline size={24} />
                    </div>
                }
            >
                <VoucherForm
                    closeModal={() => setIsShowModal(false)}
                ></VoucherForm>
            </Modal>
            <div className="grid md:grid-cols-3 gap-4 p-4 h-full">
                {leftPanel}
                {rightPanel}
            </div>
        </div>
    );
}

export default withBaseComponent(Payment);
