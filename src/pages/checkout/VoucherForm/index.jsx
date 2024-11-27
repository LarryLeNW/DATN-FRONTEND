import { Button, Input, notification } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import CouponCard from "./Coupon";

function VoucherForm() {
    const [search, setSearch] = useState("");
    const [showMoreProductCoupons, setShowMoreProductCoupons] = useState(false);
    const [showMoreShippingCoupons, setShowMoreShippingCoupons] =
        useState(false);

    const { userVouchers } = useSelector((state) => state.voucher);
    const { selectedCarts } = useSelector((state) => state.cart);

    const handleSearchVoucherByCode = () => {
        notification.warning({ message: "Processing", duration: 1 });
    };

    const toggleShowMoreProductCoupons = () => {
        setShowMoreProductCoupons(!showMoreProductCoupons);
    };

    const toggleShowMoreShippingCoupons = () => {
        setShowMoreShippingCoupons(!showMoreShippingCoupons);
    };

    const productVouchers = userVouchers.data.filter(
        (el) => el.voucher_category === "PRODUCT"
    );
    const shippingVouchers = userVouchers.data.filter(
        (el) => el.voucher_category === "SHIPPING"
    );

    const totalOrder = selectedCarts.data?.reduce(
        (sum, cart) => (sum += cart?.sku?.price * cart.quantity),
        0
    );

    return (
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[70vh] px-8">
            <div className="text-2xl font-bold">Khuyến mãi</div>
            <div className="flex gap-2">
                <Input
                    placeholder="Nhập mã giảm giá"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                />
                <Button
                    onClick={handleSearchVoucherByCode}
                    className={`${
                        !search ? "bg-slate-400" : "bg-blue-600"
                    } text-white`}
                    disabled={!search}
                >
                    Áp dụng
                </Button>
            </div>

            {/* Product Vouchers */}
            <div className="mt-2">
                <p className="flex justify-between items-center mb-2">
                    <span className="font-bold">Mã Giảm Giá</span>
                    <span className="text-sm text-slate-500">
                        Áp dụng đối ta : 1
                    </span>
                </p>
                <div className="flex flex-col gap-2">
                    {productVouchers.slice(0, 2).map((el) => (
                        <CouponCard
                            key={el.id}
                            data={el}
                            Unused={el?.min_order > totalOrder}
                        />
                    ))}
                </div>
                {showMoreProductCoupons && (
                    <div className="flex flex-col gap-2 mt-2">
                        {productVouchers.slice(2).map((el) => (
                            <CouponCard
                                key={el.id}
                                data={el}
                                Unused={el?.min_order > totalOrder}
                            />
                        ))}
                    </div>
                )}
                {productVouchers.length > 2 && (
                    <div
                        onClick={toggleShowMoreProductCoupons}
                        className="mt-2 text-center font-bold text-blue-500 mx-auto cursor-pointer"
                    >
                        <p>
                            <span>
                                {showMoreProductCoupons
                                    ? "Thu gọn"
                                    : `Xem thêm (${
                                          productVouchers.length - 2
                                      })`}
                            </span>
                        </p>
                    </div>
                )}
            </div>

            {/* Shipping Vouchers */}
            <div className="mt-2">
                <p className="flex justify-between items-center mb-2">
                    <span className="font-bold">Mã Vận Chuyển</span>
                    <span className="text-sm text-slate-500">
                        Áp dụng đối ta : 1
                    </span>
                </p>
                <div className="flex flex-col gap-2 mt-2">
                    {shippingVouchers.slice(0, 2).map((el) => (
                        <CouponCard
                            key={el.id}
                            data={el}
                            Unused={el?.min_order > totalOrder}
                        />
                    ))}
                </div>
                {showMoreShippingCoupons && (
                    <div className="flex flex-col gap-2 mt-2">
                        {shippingVouchers.slice(2).map((el) => (
                            <CouponCard
                                key={el.id}
                                data={el}
                                Unused={el?.min_order > totalOrder}
                            />
                        ))}
                    </div>
                )}

                {shippingVouchers.length > 2 && (
                    <div
                        onClick={toggleShowMoreShippingCoupons}
                        className="mt-2 text-center font-bold text-blue-500 mx-auto cursor-pointer"
                    >
                        <p>
                            <span>
                                {showMoreShippingCoupons
                                    ? "Thu gọn"
                                    : `Xem thêm (${
                                          shippingVouchers.length - 2
                                      })`}
                            </span>{" "}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VoucherForm;
