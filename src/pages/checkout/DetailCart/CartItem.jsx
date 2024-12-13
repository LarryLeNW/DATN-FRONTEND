import { Checkbox, notification, Select, Tooltip } from "antd";
import withBaseComponent from "hocs";
import useDebounce from "hooks/useDebounce";
import { useEffect, useState } from "react";
import { updateCartRequest } from "store/slicers/cart.slicer";
import { deleteCartRequest } from "store/slicers/cart.slicer";
import { fillUniqueATTSkus, formatMoney, trunCateText } from "utils/helper";
import Icons from "utils/icons";
const Option = Select.Option;

function CartItem({ data, dispatch, handleSelectCartCheckBox }) {
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
        <div key={data.id} className=" gap-4 border rounded px-4 py-2">
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

                    <div className="flex gap-4 mt-4 text-sm">
                        {fillUniqueATTSkus(data?.product?.skus, "color")
                            .length > 1 && (
                            <div className="flex gap-2">
                                <span className=" text-nowrap">Color :</span>
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
                        {fillUniqueATTSkus(data?.product?.skus, "material")
                            .length > 1 && (
                            <div className="flex gap-2">
                                <span className=" text-nowrap">
                                    Chất liệu :
                                </span>
                                <Select
                                    className="min-w-20"
                                    defaultValue={
                                        data?.sku?.attributes["material"]
                                    }
                                    onChange={(value) =>
                                        handleChangeAtt("material", value)
                                    }
                                >
                                    {fillUniqueATTSkus(
                                        data?.product.skus,
                                        "material"
                                    ).map((el, index) => (
                                        <Option
                                            key={index}
                                            value={el.attributes.material}
                                        >
                                            {el.attributes.material}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        )}
                        {fillUniqueATTSkus(data?.product?.skus, "size").length >
                            1 && (
                            <div className="flex gap-2">
                                <span className=" text-nowrap">Size :</span>
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
        </div>
    );
}

export default withBaseComponent(CartItem);
