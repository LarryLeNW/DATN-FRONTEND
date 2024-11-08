import Icons from "utils/icons";
import logo from "assets/logo.png";
import Button from "components/Button";
import { useEffect, useMemo, useState } from "react";
import { fillUniqueATTSkus } from "utils/helper";
import ReactStars from "react-stars";
import { Input } from "antd";
import Slider from "react-slick";

function CartForm({ data }) {
    const [selectedATT, setSelectedATT] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [selectedSku, setSelectedSku] = useState(0);
    const [stock, setStock] = useState(999);

    useEffect(() => {
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

        setStock(stockCal);
    }, [selectedATT]);

    const handleSelectAttSku = (key, value) => {
        const att = { [key]: value };
        setSelectedATT((prev) => ({ ...prev, ...att }));
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
                    <span className="border-l text-gray-400 px-2 ">
                        Đã bán 323
                    </span>
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
                                        className={`px-2 bg-slate-200 rounded cursor-pointer  ${
                                            selectedATT["color"] ===
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
                                        className={`px-2 bg-slate-200 rounded cursor-pointer  ${
                                            selectedATT["size"] ===
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

                <Button
                    fw
                    style={
                        "bg-primary rounded p-2 cursor-pointer text-lg font-bold text-white"
                    }
                    iconAfter={<Icons.FaCartPlus />}
                    name={"Add"}
                />
            </div>
        ),
        [data?.skus, quantity, selectedATT, stock]
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
                    <span>Thêm Vào Giỏ Hàng Của Bạn</span>
                </div>
                <div className="flex gap-2 mt-2">
                    <div className="w-1/2 border bg-white rounded p-6">
                        {data?.skus[selectedSku]?.images?.split(",").length >
                        2 ? (
                            <Slider {...settings}>
                                {data?.skus[selectedSku]?.images
                                    ?.split(",")
                                    .map((img, index) => {
                                        console.log("log .. .: ", img);
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

export default CartForm;