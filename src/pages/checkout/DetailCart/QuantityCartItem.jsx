import { notification } from "antd";
import useDebounce from "hooks/useDebounce";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
    deleteCartRequest,
    updateCartRequest,
} from "store/slicers/cart.slicer";

function QuantityCartItem({ data }) {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(data.quantity);
    const quantityDebounce = useDebounce(quantity, 600);
    const [skuCurrent, setSkuCurrent] = useState(data.sku);

    useEffect(() => {
        if (quantityDebounce != data.quantity) handleUpdateCart();
    }, [quantityDebounce]);

    const handleUpdateCart = () => {
        dispatch(
            updateCartRequest({
                quantity: quantityDebounce,
                productId: data.product.id,
                id: data.id,
                skuId: skuCurrent.id,
            })
        );
    };

    return (
        <div className="flex items-center border border-gray-300  rounded-md">
            <button
                className="px-2"
                onClick={() => {
                    if (quantity > 1) setQuantity((prev) => --prev);
                    else dispatch(deleteCartRequest(data.id));
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-2.5 fill-current"
                    viewBox="0 0 124 124"
                >
                    <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z" />
                </svg>
            </button>
            <input
                className="p-2 text-gray-800 text-xs outline-none bg-transparent w-14"
                value={quantity}
                type="number"
                onChange={(e) => {
                    const value = e.target.value;
                    if (value <= 0) return setQuantity(1);
                    if (value > skuCurrent?.stock)
                        return setQuantity(skuCurrent?.stock);
                    return setQuantity(value);
                }}
            />
            <button
                className="px-2"
                onClick={() =>
                    setQuantity((prev) => {
                        if (prev < skuCurrent?.stock) return ++prev;
                        else {
                            notification.warning({
                                message:
                                    "Sản phẩm này chỉ có " +
                                    skuCurrent.stock +
                                    " cái.",
                                duration: 1,
                            });
                            return prev;
                        }
                    })
                }
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-2.5 fill-current"
                    viewBox="0 0 42 42"
                >
                    <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                </svg>
            </button>
        </div>
    );
}

export default QuantityCartItem;
