import { Input, Modal, Tooltip } from "antd";
import CartForm from "components/CartForm";
import { COLOR_DATA_OPTIONS_PANEL } from "constant/filterData";
import paths from "constant/paths";
import withBaseComponent from "hocs";
import { useCallback, useEffect, useState } from "react";
import { generatePath } from "react-router-dom";
import ReactStars from "react-stars";
import { fillUniqueATTSkus, formatMoney, trunCateText } from "utils/helper";
import Icons from "utils/icons";
import AddProductForm from "./AddProductForm";
import { getProductListRequest } from "store/slicers/product.slicer";
import { useDispatch } from "react-redux";

function AddProductToOrder({ data, navigate }) {
    const [isShowModal, setIsShowModal] = useState(false);
    const [skuShow, setSkuShow] = useState(data?.skus[0]);
    const dispatch = useDispatch();

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
            >
                <AddProductForm
                    data={data}
                    closeModal={() => setIsShowModal(false)}
                />
            </Modal>
            <div
                key={data.id}
                className="py-2 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            // onClick={() =>
            //     navigate(
            //         generatePath(paths.DETAIL_PRODUCT, { id: data?.id }),
            //         { state: { productData: data } }
            //     )
            // }
            >
                <div className="px-4">
                    <img
                        src={skuShow?.images?.split(",")[0]}
                        alt={skuShow?.code}
                        className="h-40 w-full object-contain"
                    />
                </div>
                <div className="py-1 px-2 flex flex-col gap-2">
                    <h2 className="text-sm">{trunCateText(data.name, 46)}</h2>
                    <div className="flex gap-2 items-center">
                        <p className="text-gray-900 font-bold ">
                            {formatMoney(skuShow?.price)}
                            <sup>
                                <u>đ</u>
                            </sup>
                        </p>
                        <p className="bg-gray-200 p-1 rounded text-sm ">
                            -{skuShow?.discount}%
                        </p>
                    </div>
                    {
                        <div className="flex gap-2 flex-wrap items-center">
                            {fillUniqueATTSkus(data?.skus, "color").length >
                                2 && (
                                    <div className="px-2 bg-gray-100 rounded text-sm flex gap-2 p-1">
                                        {fillUniqueATTSkus(data?.skus, "color").map(
                                            (sku) => (
                                                <Tooltip
                                                    title={sku?.attributes?.color}
                                                >
                                                    <div
                                                        className={`w-5 h-5 rounded-full border border-gray-400  
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
                            {fillUniqueATTSkus(data?.skus, "size").length >
                                2 && (
                                    <div className="px-2 bg-gray-100 rounded text-sm">
                                        {
                                            fillUniqueATTSkus(data?.skus, "size")
                                                .length
                                        }{" "}
                                        Size
                                    </div>
                                )}
                        </div>
                    }
                    <div className="flex gap-2 text-sm items-center pr-2">
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

export default withBaseComponent(AddProductToOrder);
