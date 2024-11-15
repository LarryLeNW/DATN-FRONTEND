import { notification, Select, Tooltip } from "antd";
import withBaseComponent from "hocs";
import useDebounce from "hooks/useDebounce";
import { useEffect, useState } from "react";
import { updateCartRequest } from "store/slicers/cart.slicer";
import { deleteCartRequest } from "store/slicers/cart.slicer";
import { fillUniqueATTSkus, formatMoney } from "utils/helper";
import Icons from "utils/icons";
const Option = Select.Option;

function CartItem({ data, dispatch }) {
    const [quantity, setQuantity] = useState(data.quantity);
    const quantityDebounce = useDebounce(quantity, 600);
    const [skuCurrent, setSkuCurrent] = useState(data.sku);

    const handleChangeAtt = (key, value) => {
        data?.product.skus.forEach((sku) => {
            const isMatch = Object.entries({
                ...skuCurrent?.attributes,
                [key]: value,
            }).every(([key, value]) => {
                return sku?.attributes[key] === value;
            });

            if (isMatch) {
                setSkuCurrent(sku);
            }
        });
    };

    useEffect(() => {
        if (quantityDebounce != data.quantity) handleUpdateCart();
    }, [quantityDebounce]);

    useEffect(() => {
        if (skuCurrent?.id != data?.sku?.id) handleUpdateCart();
    }, [skuCurrent]);

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
        <div key={data.id} className="grid grid-cols-3 items-center gap-4">
            <div className="col-span-2 flex items-center gap-4">
                <div className="w-24 h-24 shrink-0 bg-white p-2 rounded-md">
                    <img
                        src={data?.sku?.images.split(",")[0]}
                        alt={data?.product?.name}
                        className="w-full h-full object-contain"
                    />
                </div>
                <div>
                    <h3 className="text-base font-bold text-gray-800">
                        {data?.product?.name}
                    </h3>

                    <div className="flex gap-4 mt-4">
                        {fillUniqueATTSkus(data?.product?.skus, "color")
                            .length > 1 && (
                            <div className="flex gap-2">
                                <span className="font-bold text-lg text-nowrap">
                                    Color :
                                </span>
                                <Select
                                    className="min-w-20"
                                    defaultValue={
                                        data?.sku?.attributes["color"]
                                    }
                                    onChange={(value) =>
                                        handleChangeAtt("color", value)
                                    }
                                >
                                    {fillUniqueATTSkus(
                                        data?.product.skus,
                                        "color"
                                    ).map((el, index) => (
                                        <Option
                                            key={index}
                                            value={el.attributes.color}
                                        >
                                            {el.attributes.color}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        )}
                        {fillUniqueATTSkus(data?.product?.skus, "size").length >
                            1 && (
                            <div className="flex gap-2">
                                <span className="font-bold text-lg text-nowrap">
                                    Size :
                                </span>
                                <Select
                                    className="min-w-20"
                                    defaultValue={data?.sku?.attributes["size"]}
                                    onChange={(value) =>
                                        handleChangeAtt("size", value)
                                    }
                                >
                                    {fillUniqueATTSkus(
                                        data?.product.skus,
                                        "size"
                                    ).map((el, index) => (
                                        <Option
                                            key={index}
                                            value={el.attributes.size}
                                        >
                                            {el.attributes.size}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="ml-auto flex gap-4 justify-center">
                <div className="flex flex-col gap-4 items-center justify-center">
                    <div className="flex items-center border border-gray-300  rounded-md">
                        <button
                            className="px-2"
                            onClick={() =>
                                setQuantity((prev) =>
                                    prev > 1 ? --prev : prev
                                )
                            }
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
                    <h4 className="text-base font-bold text-gray-600">
                        {formatMoney(data?.sku?.price * data?.quantity)}đ
                    </h4>
                </div>

                <button
                    className="bg-red-600 p-1 rounded-md text-white w-fit h-fit"
                    onClick={() => dispatch(deleteCartRequest(data.id))}
                >
                    <Tooltip title={"Xóa sản phẩm " + data?.product?.name}>
                        <Icons.MdDeleteForever />
                    </Tooltip>
                </button>
            </div>
        </div>
    );
}

export default withBaseComponent(CartItem);
