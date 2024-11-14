import { Select } from "antd";
import withBaseComponent from "hocs";
import { deleteCartRequest } from "store/slicers/cart.slicer";
import { fillUniqueATTSkus, formatMoney } from "utils/helper";
const Option = Select.Option;

function CartItem({ data, dispatch }) {
    const handleChangeAtt = (key, value) => {
        console.log("🚀 ~ handleChangeAtt ~ value:", value);
        console.log("🚀 ~ handleChangeAtt ~ key:", key);
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
                                <span className="font-bold text-lg">
                                    Color :{" "}
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
                                <span className="font-bold text-lg">
                                    Size :{" "}
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

                        <div>
                            <button
                                type="button"
                                className="flex items-center px-2.5 py-1.5 border border-gray-300 text-gray-800 text-xs outline-none bg-transparent rounded-md"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-2.5 fill-current"
                                    viewBox="0 0 124 124"
                                >
                                    <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z" />
                                </svg>
                                <span className="mx-2.5">{data.quantity}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-2.5 fill-current"
                                    viewBox="0 0 42 42"
                                >
                                    <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ml-auto">
                <div className="flex gap-1">
                    <button
                        className="bg-red-600 p-1 rounded-md text-white"
                        onClick={() => dispatch(deleteCartRequest(data.id))}
                    >
                        Remove
                    </button>
                </div>
                <h4 className="text-base font-bold text-gray-800">
                    {formatMoney(data?.sku?.price * data?.quantity)}đ
                </h4>
            </div>
        </div>
    );
}

export default withBaseComponent(CartItem);
