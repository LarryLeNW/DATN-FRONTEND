import paths from "constant/paths";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItem from "./CartItem";
import { Skeleton } from "antd";
import { formatMoney } from "utils/helper";

function DetailCart() {
    const { cartList } = useSelector((state) => state.cart);
    console.log("🚀 ~ DetailCart ~ cartList:", cartList);

    function CartItemSkeleton() {
        return (
            <div className="flex items-center gap-4 p-4 border-b">
                <Skeleton.Avatar active shape="square" size={64} />
                <div className="flex-1">
                    <Skeleton.Input active style={{ width: 200, height: 20 }} />
                </div>
                <Skeleton.Button active style={{ width: 80, height: 32 }} />
            </div>
        );
    }

    return (
        <div className="font-sans mx-auto ">
            <div className="grid md:grid-cols-3 gap-4 p-4">
                <div className="md:col-span-2 p-4 rounded-md bg-white">
                    <h2 className="text-2xl font-bold text-primary">
                        Giỏ hàng
                    </h2>
                    <hr className="border-gray-300 mt-4 mb-8" />
                    <div className="space-y-4">
                        {cartList.loading
                            ? Array.from({ length: 3 }).map((_, index) => (
                                  <CartItemSkeleton key={index} />
                              ))
                            : cartList.data.map((item) => (
                                  <CartItem key={item.id} data={item} />
                              ))}
                    </div>
                </div>

                <div className="rounded-md p-4 md:sticky top-0 bg-white">
                    <div className="flex border border-blue-600 overflow-hidden rounded-md">
                        <input
                            type="text"
                            placeholder="Promo code"
                            className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-2.5"
                        />
                        <button
                            type="button"
                            className="flex items-center justify-center font-semibold tracking-wide bg-blue-600 hover:bg-blue-700 px-4 text-sm text-white"
                        >
                            Apply
                        </button>
                    </div>

                    <ul className="text-gray-800 mt-8 space-y-4">
                        <li className="flex flex-wrap gap-4 text-base">
                            Tax{" "}
                            <span className="ml-auto font-bold">
                                demo $99.00
                            </span>
                        </li>
                        <li className="flex flex-wrap gap-4 text-base font-bold">
                            Total{" "}
                            <span className="ml-auto">
                                {formatMoney(
                                    cartList.data?.reduce(
                                        (sum, cart) =>
                                            (sum +=
                                                cart?.sku?.price *
                                                cart.quantity),
                                        0
                                    )
                                )}
                                đ
                            </span>
                        </li>
                    </ul>

                    <div className="mt-8 space-y-2">
                        <Link to={paths.CHECKOUT}>
                            <button
                                type="button"
                                className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                            >
                                Checkout
                            </button>
                        </Link>
                        <button
                            type="button"
                            className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-transparent text-gray-800 border border-gray-300 rounded-md"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailCart;
