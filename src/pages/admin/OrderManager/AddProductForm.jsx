import Icons from "utils/icons";
import logo from "assets/logo.png";
import Button from "components/Button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fillUniqueATTSkus, formatCurrency } from "utils/helper";
import ReactStars from "react-stars";
import { Input, notification } from "antd";
import Slider from "react-slick";
import DOMPurify from "dompurify";
import withBaseComponent from "hocs";
import { useDispatch, useSelector } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import { createOrderDetail } from "apis/order.api";
import { useParams } from "react-router-dom";

function AddProductForm({ data, checkLoginBeforeAction, closeModal }) {
    const [selectedATT, setSelectedATT] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [selectedSku, setSelectedSku] = useState(0);
    const [price, setPrice] = useState(data.skus[0].price);
    const [stock, setStock] = useState(999);
    const totalPrice = quantity * price;
    const { orderId } = useParams();
    const dispatch = useDispatch();

 
    useEffect(() => {
        let selectedPrice = price;
        let stockCal = data?.skus.reduce((acc, sku, index) => {
            const isMatch = Object.entries(selectedATT).every(
                ([key, value]) => {
                    return sku?.attributes[key] === value;
                }
            );

            if (isMatch) {
                setSelectedSku(index);
                acc += sku?.stock;
            }
            return acc;
        }, 0);
        setPrice(selectedPrice);
        setStock(stockCal);
    }, [selectedATT, price]);

    useEffect(() => {
        if (data?.skus[0]?.attributes) {
            setSelectedATT(data?.skus[0]?.attributes);
        }
    }, [data]);

    const handleSelectAttSku = (key, value) => {
        const att = { [key]: value };
        setSelectedATT((prev) => ({ ...prev, ...att }));
    };

    const handleAddCart = async () => {
        dispatch(changeLoading());
        const dataOrderDetail = {
            quantity,
            orderId: orderId,
            productId: data.id,
            skuId: data.skus[selectedSku].id,
            price
        }
        try {
            await createOrderDetail(dataOrderDetail)
            notification.success({ message: "Thêm sản phẩm vào order thành công!" });
        } catch (error) {
            console.log(error);
        }
        dispatch(changeLoading());
    };

    const renderPanelRight = useMemo(
        () => (
            <div className="w-1/2 border bg-white rounded p-2 flex flex-col justify-between gap-2 ">
           
                <p className="font-bold">
                    <span className="text-gray-500">Product : </span>
                    <span className="text-primary">{data.name}</span>
                </p>
                <p className="flex gap-2">
                    <ReactStars
                        value={data?.stars || 5}
                        color2="#E9C71B"
                        half={true}
                        edit={false}
                    />
                    {data?.totalSold > 0 && (
                        <span className="border-l text-gray-400 px-2 ">
                            {data?.totalSold}
                        </span>
                    )}

                    <span className="ml-auto text-blue-700 font-bold">
                        Còn lại {stock}
                    </span>
                </p>
                {fillUniqueATTSkus(data?.skus, "size").length > 2 && (
                    <div className="flex flex-col gap-2">
                        <span className="font-bold text-lg">Color : </span>
                        <div className="flex gap-2 ">
                            {fillUniqueATTSkus(data?.skus, "color").map(
                                (el, index) => (
                                    <span
                                        onClick={() =>
                                            handleSelectAttSku(
                                                "color",
                                                el.attributes.color
                                            )
                                        }
                                        key={index}
                                        className={`px-2 bg-slate-200 rounded cursor-pointer  ${selectedATT["color"] ===
                                            el.attributes.color &&
                                            "shadow-md shadow-blue-700"
                                            } `}
                                    >
                                        {el.attributes.color}
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                )}
                {fillUniqueATTSkus(data?.skus, "size").length > 2 && (
                    <div className="flex flex-col gap-2">
                        <span className="font-bold text-lg">Size : </span>
                        <div className="flex gap-2 ">
                            {fillUniqueATTSkus(data?.skus, "size").map(
                                (el, index) => (
                                    <span
                                        onClick={() =>
                                            handleSelectAttSku(
                                                "size",
                                                el.attributes.size
                                            )
                                        }
                                        key={index}
                                        className={`px-2 bg-slate-200 rounded cursor-pointer  ${selectedATT["size"] ===
                                            el.attributes.size &&
                                            "shadow-md shadow-blue-700"
                                            } `}
                                    >
                                        {el.attributes.size}
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                )}

                <div className=" p-2 text-red-700 text-sm font-bold">
                    Tổng Tiền:{" "}
                    {totalPrice
                        ? formatCurrency(`${totalPrice}`)
                        : "Liên hệ"}
                </div>

                <div className="flex gap-2 border p-2 rounded overflow-y-auto overflow-x-hidden flex-1 bg-slate-100">
                    <h1 className="text-primary font-bold text-nowrap">
                        Mô tả :{" "}
                    </h1>
                    <div
                        className="max-h-60 overflow-auto"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(data?.description),
                        }}
                    ></div>
                </div>

                <div className="bg-light p-1 rounded mt-auto ">
                    <div className="flex gap-2 bg-white px-2 py-1">
                        <span
                            className="px-1   border  border-primary rounded-full text-lg cursor-pointer select-none"
                            onClick={() =>
                                setQuantity((prev) =>
                                    prev > 1 ? --prev : prev
                                )
                            }
                        >
                            -
                        </span>
                        <Input
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                                setQuantity(() => {
                                    let cal = parseInt(
                                        Math.abs(e.target.value) || 1
                                    );
                                    return cal > stock ? stock : cal;
                                });
                            }}
                        />
                        <span
                            className="px-1  border border-primary rounded-full text-lg cursor-pointer select-none "
                            onClick={() =>
                                setQuantity((prev) =>
                                    prev < stock ? ++prev : prev
                                )
                            }
                        >
                            +
                        </span>
                    </div>
                </div>

                <button
                    onClick={() =>
                        checkLoginBeforeAction(() => handleAddCart())
                    }
                    className="bg-primary rounded p-2 cursor-pointer text-lg font-bold text-white flex items-center justify-center"
                >
                    <div>Thêm vào Order</div>
                    <Icons.FaCartPlus />
                </button>
            </div>
        ),
        [data?.skus, quantity, selectedATT, stock, selectedSku]
    );

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 2000,
    };

    return (
        <div className="px-4 py-2 ">
            <div className="bg-slate-100 p-2">
                <div className="bg-light p-2 text-lg rounded text-white flex justify-between items-center">
                    <img src={logo} alt="Logo" className="h-8 w-8" />
                    <span className="text-center">Thêm vào order của bạn</span>
                </div>
                <div className="flex gap-2 mt-2">
                    <div className="w-1/2 border bg-white rounded p-6">
                        {data?.skus[selectedSku]?.images?.split(",").length >
                            1 ? (
                            <Slider {...settings}>
                                {data?.skus[selectedSku]?.images
                                    ?.split(",")
                                    .map((img, index) => {
                                        return (
                                            <img
                                                src={img}
                                                alt="img"
                                                key={index}
                                            />
                                        );
                                    })}
                            </Slider>
                        ) : (
                            <img
                                src={data?.skus[selectedSku]?.images}
                                alt="img"
                            />
                        )}
                    </div>
                    {renderPanelRight}
                </div>
            </div>
        </div>
    );
}

export default withBaseComponent(AddProductForm);