import { useEffect, useState } from "react";
import RelatedProducts from "../RelatedProducts/index";
import { useLocation, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { changeLoading } from "store/slicers/common.slicer";
import { createCartRequest } from "store/slicers/cart.slicer";
import { fillUniqueATTSkus } from "utils/helper";
import { Input, notification, Slider, Tooltip } from "antd";
import { formatCurrency } from "utils/formatCurrency";
import withBaseComponent from "hocs";
import CommentProduct from "../CommentProduct";
import { COLOR_DATA_OPTIONS_PANEL } from "constant/filterData";

const DetailProduct = ({ checkLoginBeforeAction, dispatch }) => {

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
    const [skuShow, setSkuShow] = useState(productData?.skus[0]);
    const totalPrice = quantity * price;
    const handleImageClick = (img) => {
        setSelectedImage(img);
    };
    const category = productData?.category;

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
        window.scrollTo(0, 0);
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
        <div class="font-sans mt-5 p-10 ">
            {productData && (
                <div className="grid grid-cols-12 gap-4 border-4 p-10">
                    <div className="col-span-4">
                        <div className="sticky top-4">
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
                    </div>
                    <div className="col-span-5 bg-white p-5 rounded-xl">
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

                            </p>
                        </div>

                        <div class="flex space-x-2 mt-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                    key={i}
                                    className={
                                        i < productData.stars
                                            ? "text-yellow-500"
                                            : "text-gray-300"
                                    }
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        <div className="mt-2">
                            <span className="font-bold text-lg">
                                Màu sắc:{" "}
                            </span>
                            {fillUniqueATTSkus(productData?.skus, "color").length >
                                2 && (
                                    <div className="flex gap-2 ">
                                        {fillUniqueATTSkus(productData?.skus, "color").map(
                                            (sku) => (
                                                <Tooltip
                                                    title={sku?.attributes?.color}
                                                >
                                                    <div
                                                        className={`w-8 h-8 rounded-full border border-gray-400  
                                                    ${COLOR_DATA_OPTIONS_PANEL.find(
                                                            (dataColor) =>
                                                                sku?.attributes?.color
                                                                    ?.toLowerCase()
                                                                    .includes(
                                                                        dataColor.key
                                                                    )
                                                        )?.color
                                                            }
                                                   cursor-pointer`}
                                                        onMouseEnter={() =>
                                                            setSkuShow(sku)
                                                        }
                                                    ></div>
                                                </Tooltip>
                                            )
                                        )}
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
                                                    className={`px-2 bg-slate-200 rounded cursor-pointer  ${selectedATT["size"] ===
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
                            <RelatedProducts category={category}></RelatedProducts>

                        </div>
                    </div>
                    <div className="col-span-3 bg-white rounded-2xl">
                        <div className="sticky top-4">
                            <h1 className="text-xl p-2 font-bold mb-4">
                                Tiến Hành Thanh Toán
                            </h1>
                            <div className="mb-4">
                                <label
                                    className="block p-2 text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="quantity"
                                >
                                    Số Lượng
                                </label>
                                <div className="flex p-2 items-center space-x-2">
                                    <button
                                        onClick={() =>
                                            setQuantity((prev) =>
                                                prev > 1 ? --prev : prev
                                            )
                                        }
                                        className="w-10  h-10 border rounded-md flex items-center justify-center text-gray-700"
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
                            <div className="mb-4 p-2 text-red-700 text-xl font-bold">
                                Tổng Tiền:{" "}
                                {totalPrice
                                    ? formatCurrency(`${totalPrice}`)
                                    : "Liên hệ"}
                            </div>

                            <button
                                type="button"
                                className="w-[90%] mx-auto mt-8 px-4 p-3 bg-red-600 hover:bg-red-700 flex justify-center items-center text-white rounded-md text-center"
                            >
                                Mua Ngay
                            </button>

                            <button
                                onClick={() => checkLoginBeforeAction(() => handleAddCart())}
                                type="button"
                                className="w-[90%] mx-auto mt-8 px-4 p-3 bg-blue-500 hover:bg-blue-700 flex justify-center items-center text-white rounded-md text-center "
                            >
                                Thêm vào giỏ hàng
                            </button>

                        </div>
                    </div>
                </div>
            )}

            <CommentProduct />
        </div>
    );
};

export default withBaseComponent(DetailProduct);

