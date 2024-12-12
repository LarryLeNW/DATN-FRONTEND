import { useEffect, useState } from "react";
import AddressOrder from "./AddressOrder";
import { getTypePayment } from "apis/payment";
import { useForm } from "react-hook-form";
import { Input, Modal, notification, Select } from "antd";
import { useSelector } from "react-redux";
import { fillUniqueATTSkus } from "utils/helper";
import { Option } from "antd/es/mentions";
import { createOrder } from "apis/order.api";
import Icons from "utils/icons";
import Button from "components/Button";
import { getDelivery } from "apis/delivery.api";

const CreateOrder = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm();

    const { data: products = [] } = useSelector((state) => state.product.productList);
    const typePayment = "COD";
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [deliveryId, setDeliveryId] = useState(null);
    const [skuCurrent, setSkuCurrent] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [stock, setStock] = useState(999);
    const [keyword, setKeyword] = useState("");
    const [filteredData, setFilteredData] = useState(products);
    const [isShowModal, setIsShowModal] = useState(false);

    console.log(deliveryId);


    const openFormCart = (event) => {
        event.stopPropagation();
        setIsShowModal(true);
    };
    useEffect(() => {



        if (Array.isArray(products)) {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(keyword.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData([]);
        }
    }, [products, keyword]);



    const handleQuantityChange = (productId, newQuantity, stock) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: Math.max(1, Math.min(newQuantity, stock)),
        }));
    };

    const handleSubmitOrder = async () => {

        if (selectedProducts.length === 0) {
            notification.error({ message: "Vui lòng chọn sản phẩm" });
            return;
        }
        const response = await getDelivery(deliveryId);
        const deliveryData = response?.result;


        const orderData = {
            delivery: deliveryData || null,
            payment: {
                method: typePayment,
                amount: selectedProducts.reduce(
                    (total, product) =>
                        total + product.skus[0].price * product.skus[0].quantity,
                    0
                ),
            },
            orderDetails: selectedProducts.map((product) => ({
                productId: product.id,
                quantity: quantities[product.id],
                skuId: skuCurrent?.id,
            })),
            discountValue: 0,
        };

        console.log(orderData);

        try {
            const res = await createOrder(orderData);
            notification.success({ message: "Tạo thành công đơn hàng!" });
            console.log("Order created:", res.data);
        } catch (error) {
            console.error("Error creating order:", error);
            notification.error({ message: "Lỗi tạo đơn hàng" });
        }
    };

    const handleCheckboxChange = (product) => {
        setSelectedProducts((prevSelected) => {
            if (prevSelected.some((p) => p.id === product.id)) {
                return prevSelected.filter((p) => p.id !== product.id);
            } else {
                return [...prevSelected, product];
            }
        });
    };

    const handleChangeAtt = (key, value) => {
        console.log(products);
        console.log("hi", products);
        console.log(skuCurrent);

        products.forEach((product) => {
            if (Array.isArray(product?.skus)) {
                product.skus.forEach((sku) => {
                    const isMatch = Object.entries({
                        ...skuCurrent?.attributes,
                        [key]: value,
                    }).every(([attrKey, attrValue]) => {
                        return sku?.attributes[attrKey] === attrValue;
                    });

                    if (isMatch) {
                        console.log("Match found:", sku);
                        setSkuCurrent(sku);
                    }
                });
            }
        });
    };


    return (
        <div>
            <div className="grid grid-cols-10 gap-4 p-4 h-[800px]">
                <div className="col-span-3 bg-gray-100 p-4 grid grid-rows-10">
                    <div>
                        <button onClick={(e) => openFormCart(e)} className="bg-gray-400 p-4 w-full px-4 rounded-lg">Thêm địa chỉ giao hàng</button>
                    </div>
                    <Modal
                        width={950}
                        open={isShowModal}
                        onCancel={() => setIsShowModal(false)}
                        footer={false}
                    >
                        <AddressOrder
                            setDeliveryId={setDeliveryId}
                            closeModal={() => setIsShowModal(false)}
                        />
                    </Modal>
                </div>
                <div className="col-span-7 bg-gray-100 p-4">
                    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search Products"
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="grid grid-cols-3 text-gray-500 text-sm font-medium border-b pb-2 mb-2">
                            <div className="col-span-2">PRODUCT</div>
                        </div>
                        <div className="h-[550px] overflow-y-scroll">

                            {filteredData.map((product) => {
                                const quantity = quantities[product.id] || 1;
                                return (
                                    <div
                                        key={product.id}
                                        className="grid grid-cols-3 items-center py-3 border-b last:border-none"
                                    >

                                        <div className="col-span-2 flex items-center">
                                            <input
                                                type="checkbox"
                                                className="mr-4"
                                                checked={selectedProducts.some((p) => p.id === product.id)}
                                                onChange={() => handleCheckboxChange(product)}
                                            />
                                            <img src={
                                                product.skus[0]?.images.split(
                                                    ","
                                                )[0]
                                            }
                                                alt={product.name} className="w-12 h-12 object-cover rounded" />
                                            <div className="ml-4">
                                                <h3 className="text-gray-800 font-medium">{product.name}</h3>
                                                <div className="flex gap-4 mt-4 text-sm">
                                                    {fillUniqueATTSkus(product?.skus, "color")
                                                        .length > 1 && (
                                                            <div className="flex gap-2">
                                                                <span className=" text-nowrap">Color :</span>
                                                                <Select
                                                                    className="min-w-20"
                                                                    defaultValue={
                                                                        product?.sku?.attributes["color"]
                                                                    }
                                                                    onChange={(value) =>
                                                                        handleChangeAtt("color", value)
                                                                    }
                                                                >
                                                                    {fillUniqueATTSkus(
                                                                        product.skus,
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
                                                    {fillUniqueATTSkus(product?.skus, "size").length >
                                                        1 && (
                                                            <div className="flex gap-2">
                                                                <span className=" text-nowrap">Size :</span>
                                                                <Select
                                                                    className="min-w-20"
                                                                    defaultValue={product?.sku?.attributes["size"]}
                                                                    onChange={(value) =>
                                                                        handleChangeAtt("size", value)
                                                                    }
                                                                >
                                                                    {fillUniqueATTSkus(
                                                                        product.skus,
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

                                        <div className="flex p-2 items-center space-x-2">

                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(product.id, quantity - 1, stock)
                                                }
                                                className="w-10 h-10 border rounded-md flex items-center justify-center text-gray-700"
                                            >
                                                -
                                            </button>
                                            <Input
                                                style={{
                                                    width: "60px",
                                                    textAlign: "center",
                                                }}
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => {
                                                    const newQuantity = parseInt(e.target.value || "1", 10);
                                                    handleQuantityChange(product.id, newQuantity, stock);
                                                }}
                                            />
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(product.id, quantity + 1, stock)
                                                }
                                                className="w-10 h-10 border rounded-md flex items-center justify-center text-gray-700"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex justify-center items-center ">
                        <button onClick={handleSubmitOrder}

                            className="flex items-center mt-5 p-4 px-10 rounded-xl text-xl bg-blue-500 text-white">
                            Thanh toán
                        </button>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default CreateOrder;