import { useEffect, useState } from "react";
import RelatedProducts from "../RelatedProducts/index";
import { useLocation, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { changeLoading } from "store/slicers/common.slicer";
import { createCartRequest } from "store/slicers/cart.slicer";
import { fillUniqueATTSkus } from "utils/helper";
import { Input, notification, Slider } from "antd";
import { formatCurrency } from "utils/formatCurrency";
import withBaseComponent from "hocs";

const DetailProduct = ({checkLoginBeforeAction,dispatch}) => {

    const location = useLocation();
    const productData = location.state?.productData;
    const [selectedATT, setSelectedATT] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [selectedSku, setSelectedSku] = useState(0);
    const [selectedImage, setSelectedImage] = useState(
        productData?.skus[selectedSku]?.images?.split(",")[0]
    );
    const [price, setPrice] = useState(productData?.skus[selectedSku]?.price);
    const [stock, setStock] = useState(999);
    const totalPrice = quantity * price;
    const handleImageClick = (img) => {
        setSelectedImage(img);
    };
    useEffect(() => {
        let stockCal = 0;
        let selectedPrice = price;
        productData?.skus.forEach((sku, index) => {
            const isMatch = Object.entries(selectedATT).every(
                ([key, value]) => sku?.attributes[key] === value
            );
            if (isMatch) {
                setSelectedSku(index);
                setSelectedImage(sku?.images?.split(",")[0]);
                stockCal += sku?.stock;
                selectedPrice = sku?.price;
            }
        });
        setStock(stockCal);
        setPrice(selectedPrice);
    }, [selectedATT, productData?.skus, price]);

    useEffect(() => {
        if (productData?.skus[0]?.attributes) {
            setSelectedATT(productData?.skus[0]?.attributes);
        }
    }, [productData]);

    const handleSelectAttSku = (key, value) => {
        const att = { [key]: value };
        setSelectedATT((prev) => ({ ...prev, ...att }));
    };
    const handleAddCart = () => {
        dispatch(changeLoading(true));
        dispatch(
            createCartRequest({
                data: {
                    quantity,
                    productId: productData.id,
                    skuId: productData.skus[selectedSku].id,
                },
                onSuccess: () => {
                    notification.success({
                        message: "Thêm vào giỏ hàng thành công",
                        duration: 1,
                    });
                },
                onError: (error) => {
                    notification.error({
                        message: "Thêm vào giỏ hàng thất bại: " + error,
                        description: "Vui lòng kiểm tra lại thông tin đã nhập",
                    });
                },
            })
        );
        dispatch(changeLoading(false));
    };

    return (
        <div class="font-sans mt-28 ">
            {productData && (
                <div class="p-4 lg:max-w-5xl max-w-lg mx-auto">
                    <div class="grid items-start grid-cols-1 lg:grid-cols-2 gap-6 max-lg:gap-12">
                        <div class="w-full lg:sticky top-0 sm:flex gap-2">
                            {productData?.skus[selectedSku]?.images ? (
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="sm:space-y-3 w-16 max-sm:w-12 max-sm:flex max-sm:mb-4 max-sm:gap-4">
                                        {productData?.skus[selectedSku]?.images
                                            ?.split(",")
                                            .map((img, index) => (
                                                <img
                                                    src={img}
                                                    alt={`img-${index}`}
                                                    key={index}
                                                    className="w-full cursor-pointer rounded-md"
                                                    onClick={() =>
                                                        handleImageClick(img)
                                                    }
                                                />
                                            ))}
                                    </div>
                                    <img
                                        src={selectedImage}
                                        alt="Product"
                                        className="w-4/5 rounded-md object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-4/5 rounded-md bg-gray-300 h-64 flex items-center justify-center">
                                    <p className="text-center text-gray-600">
                                        Không có hình ảnh nào
                                    </p>
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">
                                {productData.name}|{productData?.category?.name}
                            </h2>
                            <div class="flex flex-wrap gap-4 mt-4">
                                <p className="text-gray-800 text-xl font-bold">
                                    {price
                                        ? formatCurrency(`${price}`)
                                        : "Liên hệ"}
                                </p>
                                <p class="text-gray-400 text-xl">
                                    <strike>$16</strike>{" "}
                                    <span class="text-sm ml-1.5">
                                        Tax included
                                    </span>
                                </p>
                            </div>

                            <div class="flex space-x-2 mt-4">
                                <svg
                                    class="w-5 fill-blue-600"
                                    viewBox="0 0 14 13"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg
                                    class="w-5 fill-blue-600"
                                    viewBox="0 0 14 13"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg
                                    class="w-5 fill-blue-600"
                                    viewBox="0 0 14 13"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg
                                    class="w-5 fill-blue-600"
                                    viewBox="0 0 14 13"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                                <svg
                                    class="w-5 fill-[#CED5D8]"
                                    viewBox="0 0 14 13"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                            </div>

                            <div className="mt-8">
                                {fillUniqueATTSkus(productData?.skus, "size")
                                    .length > 2 && (
                                    <div className="flex flex-col gap-2">
                                        <span className="font-bold text-lg">
                                            Color :{" "}
                                        </span>
                                        <div className="flex gap-2 ">
                                            {fillUniqueATTSkus(
                                                productData?.skus,
                                                "color"
                                            ).map((el, index) => (
                                                <span
                                                    onClick={() =>
                                                        handleSelectAttSku(
                                                            "color",
                                                            el.attributes.color
                                                        )
                                                    }
                                                    key={index}
                                                    className={`px-2 bg-slate-200 rounded cursor-pointer  ${
                                                        selectedATT["color"] ===
                                                            el.attributes
                                                                .color &&
                                                        "shadow-md shadow-blue-700"
                                                    } `}
                                                >
                                                    {el.attributes.color}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {fillUniqueATTSkus(productData?.skus, "size")
                                    .length > 2 && (
                                    <div className="flex flex-col gap-2">
                                        <span className="font-bold text-lg">
                                            Size :{" "}
                                        </span>
                                        <div className="flex gap-2 ">
                                            {fillUniqueATTSkus(
                                                productData?.skus,
                                                "size"
                                            ).map((el, index) => (
                                                <span
                                                    onClick={() =>
                                                        handleSelectAttSku(
                                                            "size",
                                                            el.attributes.size
                                                        )
                                                    }
                                                    key={index}
                                                    className={`px-2 bg-slate-200 rounded cursor-pointer  ${
                                                        selectedATT["size"] ===
                                                            el.attributes
                                                                .size &&
                                                        "shadow-md shadow-blue-700"
                                                    } `}
                                                >
                                                    {el.attributes.size}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Thông tin sản phẩm
                                </h3>
                                <ul className="space-y-3 list-disc mt-4 pl-4 text-sm text-gray-800">
                                    <span
                                        className="line-clamp"
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                productData?.description
                                            ),
                                        }}
                                    ></span>
                                </ul>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Reviews(10)
                                </h3>
                                <div className="space-y-3 mt-4">
                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-800 font-bold">
                                            5.0
                                        </p>
                                        <svg
                                            className="w-5 fill-blue-600 ml-1.5"
                                            viewBox="0 0 14 13"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                        </svg>
                                        <div className="bg-gray-300 rounded-md w-full h-2 ml-3">
                                            <div className="w-2/3 h-full rounded-md bg-blue-600"></div>
                                        </div>
                                        <p className="text-sm text-gray-800 font-bold ml-3">
                                            66%
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-800 font-bold">
                                            4.0
                                        </p>
                                        <svg
                                            className="w-5 fill-blue-600 ml-1.5"
                                            viewBox="0 0 14 13"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                        </svg>
                                        <div className="bg-gray-300 rounded-md w-full h-2 ml-3">
                                            <div className="w-1/3 h-full rounded-md bg-blue-600"></div>
                                        </div>
                                        <p className="text-sm text-gray-800 font-bold ml-3">
                                            33%
                                        </p>
                                    </div>

                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-800 font-bold">
                                            3.0
                                        </p>
                                        <svg
                                            className="w-5 fill-blue-600 ml-1.5"
                                            viewBox="0 0 14 13"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                        </svg>
                                        <div className="bg-gray-300 rounded-md w-full h-2 ml-3">
                                            <div className="w-1/6 h-full rounded-md bg-blue-600"></div>
                                        </div>
                                        <p className="text-sm text-gray-800 font-bold ml-3">
                                            16%
                                        </p>
                                    </div>

                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-800 font-bold">
                                            2.0
                                        </p>
                                        <svg
                                            className="w-5 fill-blue-600 ml-1.5"
                                            viewBox="0 0 14 13"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                        </svg>
                                        <div className="bg-gray-300 rounded-md w-full h-2 ml-3">
                                            <div className="w-1/12 h-full rounded-md bg-blue-600"></div>
                                        </div>
                                        <p className="text-sm text-gray-800 font-bold ml-3">
                                            8%
                                        </p>
                                    </div>

                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-800 font-bold">
                                            1.0
                                        </p>
                                        <svg
                                            className="w-5 fill-blue-600 ml-1.5"
                                            viewBox="0 0 14 13"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                        </svg>
                                        <div className="bg-gray-300 rounded-md w-full h-2 ml-3">
                                            <div className="w-[6%] h-full rounded-md bg-blue-600"></div>
                                        </div>
                                        <p className="text-sm text-gray-800 font-bold ml-3">
                                            6%
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="w-full mt-8 px-6 py-2.5 border border-blue-600 bg-transparent text-gray-800 text-sm font-semibold rounded-md"
                                >
                                    Read all reviews
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-3 sticky top-[100px] self-start">
                        <div className="sticky top-4">
                            <h1 className="text-xl font-bold mb-4">
                                Tiến Hành Thanh Toán
                            </h1>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="quantity"
                                >
                                    Số Lượng
                                </label>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() =>
                                            setQuantity((prev) =>
                                                prev > 1 ? --prev : prev
                                            )
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
                                            setQuantity(() => {
                                                let cal = parseInt(
                                                    Math.abs(e.target.value) ||
                                                        1
                                                );
                                                return cal > stock
                                                    ? stock
                                                    : cal;
                                            });
                                        }}
                                    />
                                    <button
                                        onClick={() =>
                                            setQuantity((prev) =>
                                                prev < stock ? ++prev : prev
                                            )
                                        }
                                        className="w-10 h-10 border rounded-md flex items-center justify-center text-gray-700"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="mb-4 text-red-700 text-xl font-bold">
                                Tổng Tiền:{" "}
                                {totalPrice
                                    ? formatCurrency(`${totalPrice}`)
                                    : "Liên hệ"}
                            </div>

                            <button
                                type="button"
                                className="w-full mt-8 px-4 py-3 bg-red-600 hover:bg-red-700 text-black rounded-md"
                            >
                                Mua Ngay
                            </button>
                            <button  onClick={() =>
                        checkLoginBeforeAction(() => handleAddCart())
                    }
                                type="button" class="w-full mt-4 px-4 py-3  text-gray-900 bg-white rounded-lg border hover:bg-blue-400  ">Thêm vào giỏ hàng</button>
                        </div>
                    </div>
                </div>
            )}

            <section class="bg-gray-100 py-8">
                <div class="container mx-auto px-4">
                    <h2 class="text-2xl font-bold mb-4">
                        Đánh giá của khách hàng
                    </h2>
                    <div class="space-y-4">
                        <div class="bg-white p-4 rounded-lg shadow">
                            <div class="flex items-center mb-2">
                                <img
                                    src="https://via.placeholder.com/40"
                                    alt="User Avatar"
                                    class="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                    <h3 class="font-semibold">Jane Smith</h3>
                                    <p class="text-sm text-gray-500">
                                        Posted on March 10, 2024
                                    </p>
                                </div>
                            </div>
                            <p class="text-gray-700">
                                The shipping was fast and the product arrived in
                                perfect condition. Highly recommended!
                            </p>
                            <div class="flex items-center mt-2">
                                <button class="text-blue-500 hover:text-blue-600 mr-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-5 w-5 inline"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                    </svg>
                                    Like
                                </button>
                                <button class="text-gray-500 hover:text-gray-600">
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>

                    <form class="mt-8 bg-white p-4 rounded-lg shadow">
                        <div class="mb-4">
                            <label
                                for="comment"
                                class="block text-gray-700 font-medium mb-2"
                            >
                                Comment
                            </label>
                            <textarea
                                id="comment"
                                name="comment"
                                rows="4"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Post Comment
                        </button>
                    </form>
                </div>
            </section>
            <RelatedProducts></RelatedProducts>
        </div>
    );
};

export default withBaseComponent(DetailProduct);

