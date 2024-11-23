import paths from "constant/paths";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItem from "./CartItem";
import { Skeleton } from "antd";
import { formatMoney } from "utils/helper";

function DetailCart() {
    const { cartList } = useSelector((state) => state.cart);
    const [selectedCarts, setCartSelected] = useState([]);

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

    const handleSelectCartCheckBox = (item) => {
        setCartSelected((prev) => {
            const index = prev.indexOf(item);
            if (index === -1) {
                return [...prev, item];
            } else {
                return [...prev.slice(0, index), ...prev.slice(index + 1)];
            }
        });
    };

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
                                  <CartItem
                                      key={item.id}
                                      data={item}
                                      handleSelectCartCheckBox={
                                          handleSelectCartCheckBox
                                      }
                                  />
                              ))}
                    </div>
                </div>
                <div className="rounded-md md:sticky top-0 ">
                    <div className="flex flex-col gap-2">
                        <div className="bg-white p-4">
                            <div className="flex justify-between">
                                <span className="text-1xl text-slate-500">
                                    Giao tới
                                </span>
                                <span className="text-lg text-blue-500">
                                    Thay đổi
                                </span>
                            </div>
                        </div>
                        <div className="bg-white p-4">
                            <ul className=" mt-8 space-y-4">
                                <li className="flex flex-wrap gap-4 text-base font-bold text-gray-800 ">
                                    <span>Tổng tiền : </span>
                                    <span className="ml-auto font-bold ">
                                        {formatMoney(
                                            selectedCarts?.reduce(
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
                                        Mua hàng
                                    </button>
                                </Link>
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
            </div>
        </div>
    );
}

export default DetailCart;
