import { Modal, notification, Skeleton, Table, Tooltip } from "antd";
import { getDefaultDelivery } from "apis/delivery.api";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteCartRequest,
    getCartListRequest,
    setSelectedCart,
} from "store/slicers/cart.slicer";
import { setSelectedVouchers } from "store/slicers/voucher.slicer";
import { formatMoney } from "utils/helper";
import Icons from "utils/icons";
import VoucherForm from "../VoucherForm";
import CartItem from "./CartItem";
import QuantityCartItem from "./QuantityCartItem";
import CouponCard from "../VoucherForm/Coupon";
import withBaseComponent from "hocs";
import paths from "constant/paths";

function DetailCart({ dispatch, navigate }) {
    const { cartList } = useSelector((state) => state.cart);
    const [selectedCarts, setCartSelected] = useState([]);
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
    const [applyVoucherMessage, setVoucherMessage] = useState(
        "Chọn hoặc nhập mã voucher khác"
    );

    const calculate = () => {
        dispatch(setSelectedVouchers([]));
        setTotalDiscountVoucher(0);

        const totalPaymentCal = selectedCarts?.reduce(
            (sum, cart) => (sum += cart?.sku?.price * cart.quantity),
            0
        );

        setTotalPayment(totalPaymentCal);

        if (!selectedCarts.length) {
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

        let totalDiscount = 0;

        const getUniqueVouchers = userVouchers?.data
            .filter((voucher) => totalPaymentCal >= voucher.min_order)
            .sort((a, b) => b.value - a.value)
            .reduce((unique, voucher) => {
                if (
                    unique.length < 2 &&
                    !unique.some(
                        (v) => v.voucher_category === voucher.voucher_category
                    )
                ) {
                    unique.push(voucher);

                    if (voucher.discount_type === "FIXED") {
                        totalDiscount += voucher.value;
                    } else if (voucher.discount_type === "PERCENT") {
                        totalDiscount +=
                            (voucher.value / 100) * totalPaymentCal;
                    }
                }
                return unique;
            }, []);

        setVoucherMessage("Chọn hoặc nhập mã voucher khác");
        if (getUniqueVouchers) dispatch(setSelectedVouchers(getUniqueVouchers));

        setTotalDiscountVoucher(totalDiscount);
    };

    useEffect(() => {
        dispatch(getCartListRequest());
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
        dispatch(setSelectedCart(selectedCarts));
        calculate();
    }, [selectedCarts, userVouchers]);

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
                                <span
                                    className="text-sm text-blue-500 cursor-pointer text-nowrap"
                                    onClick={() =>
                                        navigate(paths.MEMBER.ADDRESS_ACCOUNT)
                                    }
                                >
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
                                    {formatMoney(totalDiscountVoucher)}đ
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
                                onClick={() => {
                                    if (!selectedCarts.length) {
                                        notification.warning({
                                            message:
                                                "Vui lòng chọn sản phẩm để thanh toán",
                                            duration: 1,
                                            placement: "top",
                                        });
                                        return;
                                    }
                                    if (!defaultDelivery?.data) {
                                        notification.warning({
                                            message:
                                                "Vui lòng cập nhật chỉ giao hàng",
                                            duration: 1,
                                            placement: "top",
                                        });
                                        navigate(
                                            paths.MEMBER.CREATE_ADDRESS_ACCOUNT
                                        );
                                        return;
                                    }
                                    navigate(paths.CHECKOUT.PAYMENT);
                                }}
                                type="button"
                                className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                            >
                                Mua hàng ({selectedCarts.length})
                            </button>
                            <button
                                type="button"
                                className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-transparent text-gray-800 border border-gray-300 rounded-md"
                            >
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ),
        [
            defaultDelivery,
            selectedCarts,
            cartList,
            totalDiscountVoucher,
            totalPayment,
        ]
    );

    const rowSelection = {
        selectedCarts,
        onChange: (cartSelected) => {
            setCartSelected(cartSelected);
        },
    };

    const columns = [
        {
            title: "Sản phẩm",
            dataIndex: "product",
            key: "product",
            render: (text, record) => (
                <CartItem data={record} dispatch={dispatch} />
            ),
        },
        {
            title: "Đơn giá",
            dataIndex: "sku",
            key: "price",
            render: (sku) => (
                <div>{sku?.price ? `${formatMoney(sku.price)}đ` : "N/A"}</div>
            ),
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            render: (quantity, record) => <QuantityCartItem data={record} />,
        },
        {
            title: "Tổng cộng",
            key: "total",
            render: (text, record) => (
                <div>
                    <strong>
                        {record.sku?.price
                            ? `${formatMoney(
                                  record.sku.price * record.quantity
                              )}đ`
                            : "N/A"}
                    </strong>
                </div>
            ),
        },
        {
            title: "Hành động",
            key: "id",
            render: (text, record) => (
                <button
                    className="bg-red-600 p-1 rounded-md text-white w-fit h-fit"
                    onClick={() => dispatch(deleteCartRequest(record.id))}
                >
                    <Tooltip title={"Xóa sản phẩm " + record?.product?.name}>
                        <Icons.MdDeleteForever />
                    </Tooltip>
                </button>
            ),
        },
    ];

    return (
        <div className="font-sans mx-auto  ">
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
            <div className="grid md:grid-cols-3 gap-4 p-4">
                <div className="md:col-span-2 p-4 rounded-md bg-white">
                    <h2 className="text-2xl font-bold text-primary">
                        Giỏ hàng
                    </h2>
                    <hr className="border-gray-300 mt-4 mb-8" />
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={cartList?.data.map((item) => ({
                            ...item,
                            key: item,
                        }))}
                        pagination={false}
                    />
                </div>
                {rightPanel}
            </div>
        </div>
    );
}

export default withBaseComponent(DetailCart);
