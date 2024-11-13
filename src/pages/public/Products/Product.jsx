import { Modal } from "antd";
import CartForm from "components/CartForm";
import { useState } from "react";
import ReactStars from "react-stars";
import {
    fillUniqueATTSkus,
    fillUniqueItems,
    formatMoney,
    trunCateText,
} from "utils/helper";
import Icons from "utils/icons";

function Product({ data }) {
    const [isShowModal, setIsShowModal] = useState(false);

    const openFormCart = (event) => {
        event.stopPropagation();
        setIsShowModal(true);
    };

    return (
        <>
            <Modal
                width={800}
                open={isShowModal}
                onCancel={() => setIsShowModal(false)}
                footer={false}
                onClick={(e) => e.stopPropagation()}
            >
                <CartForm data={data} />
            </Modal>
            <div
                key={data.id}
                className="py-2 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                data-aos="fade-up"
                onClick={() => alert("detail product ")}
            >
                <div className="px-4 ">
                    <img
                        src={data?.skus[0]?.images?.split(",")[0]}
                        alt={data?.skus[0]?.images?.split(",")[0]}
                        className="w-full h-46 object-cover"
                    />
                </div>
                <div className="py-1 px-2 flex flex-col gap-2">
                    <h2 className="text-sm">{trunCateText(data.name, 46)}</h2>
                    <div className="flex gap-2 items-center">
                        <p className="text-gray-900 font-bold ">
                            {formatMoney(data?.skus[0]?.price)}
                            <sup>
                                <u>đ</u>
                            </sup>
                        </p>
                        <p className="bg-gray-200 p-1 rounded text-sm ">
                            -{data?.skus[0]?.discount}%
                        </p>
                    </div>
                    {
                        <div className="flex gap-2">
                            {fillUniqueATTSkus(data?.skus, "color").length >
                                2 && (
                                <div className=" px-2 bg-gray-100 rounded text-sm">
                                    {
                                        fillUniqueATTSkus(data?.skus, "color")
                                            .length
                                    }{" "}
                                    Màu
                                </div>
                            )}
                            {fillUniqueATTSkus(data?.skus, "size").length >
                                2 && (
                                <div className=" px-2 bg-gray-100 rounded text-sm">
                                    {
                                        fillUniqueATTSkus(data?.skus, "size")
                                            .length
                                    }{" "}
                                    Size
                                </div>
                            )}
                        </div>
                    }
                    <div className="flex gap-2 text-sm items-center pr-2  ">
                        <ReactStars
                            value={data?.stars || 5}
                            color2="#E9C71B"
                            half={true}
                            edit={false}
                        />
                        <span className="border-l text-gray-400 px-2 ">
                            Đã bán 323
                        </span>
                        <div
                            onClick={(e) => openFormCart(e, data)}
                            className="ml-auto p-1"
                        >
                            <Icons.FaCartPlus color="green" size={18} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Product;
