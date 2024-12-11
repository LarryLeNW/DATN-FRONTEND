import { DatePicker, Input, notification, Tooltip } from "antd";
import logo from "assets/logo.png";
import withBaseComponent from "hocs";
import moment from "moment";
import "moment/locale/vi";
import { useEffect, useMemo, useState } from "react";
import {
    fillUniqueATTSkus,
    findSkuByMultipleAttributes,
    formatCurrency,
} from "utils/helper";
import Icons from "utils/icons";

function RentalForm({ data, checkLoginBeforeAction, dispatch, closeModal }) {
    const [convertedSkus, setConvertedSkus] = useState([]);
    console.log("🚀 ~ RentalForm ~ convertedSkus:", convertedSkus);
    const [selectedSkus, setSelectedSkus] = useState([]);

    useEffect(() => {
        const convertRentalSkus = data.skus.reduce(
            (acc, current) => {
                if (
                    !acc.seen.has(current?.attributes["color"]) &&
                    !!current.attributes["color"] &&
                    current.canBeRented
                ) {
                    acc.seen.add(current?.attributes["color"]);
                    acc.result.push({
                        ...current,
                        quantity: 1,
                    });
                }
                return acc;
            },
            { seen: new Set(), result: [] }
        ).result;
        setConvertedSkus(convertRentalSkus);
    }, []);

    useEffect(() => {}, [data]);

    const handleSelectAttSku = (keyAtt, valueAtt, value) => {};

    const handleChangeConvertedSkus = (keyAtt, valueATT, index) => {
        console.log("🚀 ~ handleChangeConvertedSkus ~ index:", index);
        setConvertedSkus((prev) => {
            const newConvertedSku = [...prev];

            const newSelectedSkuAtt = [
                ...Object.entries({
                    ...newConvertedSku[index]?.attributes,
                    [keyAtt]: valueATT,
                }).map(([key, value]) => ({
                    key,
                    value,
                })),
            ];

            const replaceSku = findSkuByMultipleAttributes(
                data.skus,
                newSelectedSkuAtt
            );
            newConvertedSku[index] = {
                ...newConvertedSku[index],
                ...replaceSku,
            };

            return newConvertedSku;
        });
    };

    const renderPanelRight = useMemo(
        () => (
            <div className="w-1/3 border bg-white rounded p-2 flex flex-col justify-between gap-2 ">
                <p className="font-bold">
                    <span className="text-gray-500">Sản phẩm : </span>
                    <span className="text-primary text-lg">{data.name}</span>
                </p>
                <div className="flex flex-col gap-4  ">
                    {data.rentalPackages.map((el) => (
                        <div className="border  rounded p-2 border-green-600 cursor-pointer">
                            <p className="flex gap-2 items-center ">
                                <span className="font-bold text-lg">
                                    {el.name}
                                </span>
                            </p>
                            <p className="flex gap-2 items-center ">
                                <span className="font-bold text-lg">
                                    {el.discountPercentage}%
                                </span>
                                <span className="font-bold text-lg">
                                    {el.price}%
                                </span>
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center">
                    <p>Tổng tiền</p>
                    <p className="font-bold text-lg text-orange-700 ">
                        {formatCurrency(213213123)}
                    </p>
                </div>
                <button
                    // onClick={() =>
                    //     checkLoginBeforeAction(() => handleAddCart())
                    // }
                    className="bg-primary rounded p-2 cursor-pointer text-lg font-bold text-white flex items-center justify-center"
                >
                    <div>Tiến hành thanh toán</div>
                </button>
            </div>
        ),
        [data?.skus]
    );

    const renderLeftPanel = useMemo(
        () => (
            <div className="w-2/3 border bg-white rounded p-2 h-96 overflow-auto">
                {convertedSkus.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-4 flex-col">
                            {convertedSkus.map((el, index) => (
                                <div
                                    key={index}
                                    className={`px-2 flex gap-2 bg-slate-100 rounded cursor-pointer p-2  `}
                                >
                                    <div className="flex-1 flex justify-center items-center ">
                                        <img
                                            src={el.images.split(",")[0]}
                                            alt=""
                                            className="w-28 h-32 rounded border object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 flex-2">
                                        <div className="flex gap-2 font-bold">
                                            <p>Màu :</p>
                                            <p>
                                                {
                                                    convertedSkus[index]
                                                        .attributes?.color
                                                }
                                            </p>
                                        </div>
                                        <div className="flex gap-2 flex-wrap items-center">
                                            <h1 className="text-blue-600 ">
                                                Kính thước :{" "}
                                            </h1>
                                            <div className="flex gap-2">
                                                {fillUniqueATTSkus(
                                                    data?.skus,
                                                    "size"
                                                ).map((el) => (
                                                    <div
                                                        onClick={() =>
                                                            handleChangeConvertedSkus(
                                                                "size",
                                                                el.attributes
                                                                    .size,
                                                                index
                                                            )
                                                        }
                                                        className={`py-1 border rounded px-2 bg-white ${
                                                            convertedSkus[index]
                                                                ?.attributes
                                                                ?.size ===
                                                                el.attributes
                                                                    .size &&
                                                            "shadow-md shadow-blue-600 "
                                                        }`}
                                                    >
                                                        {el.attributes.size}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 flex-wrap items-center">
                                            <h1 className="text-blue-600">
                                                Chất liệu :{" "}
                                            </h1>
                                            <div className="flex gap-2">
                                                {fillUniqueATTSkus(
                                                    data?.skus,
                                                    "material"
                                                ).map((el) => (
                                                    <div
                                                        className={`py-1 border rounded px-2 bg-white ${
                                                            convertedSkus[index]
                                                                ?.attributes
                                                                ?.material ===
                                                                el.attributes
                                                                    .material &&
                                                            "shadow-md shadow-blue-600 "
                                                        }`}
                                                        onClick={() =>
                                                            handleChangeConvertedSkus(
                                                                "material",
                                                                el.attributes
                                                                    .material,
                                                                index
                                                            )
                                                        }
                                                    >
                                                        {el.attributes.material}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-4 py-2 border rounded px-2 items-center">
                                            <div className="flex gap-2 items-center">
                                                <p>Còn lại :</p>
                                                <p className="font-bold text-primary ">
                                                    {
                                                        convertedSkus[index]
                                                            ?.stock
                                                    }
                                                </p>
                                            </div>
                                            <div className="flex gap-1 items-center">
                                                <p>
                                                    {formatCurrency(
                                                        convertedSkus[index]
                                                            ?.dailyRentPrice
                                                    )}
                                                    /
                                                </p>
                                                <p className="font-bold  text-primary">
                                                    ngày
                                                </p>
                                            </div>
                                            <div className="flex gap-1 items-center">
                                                <p>
                                                    {formatCurrency(
                                                        convertedSkus[index]
                                                            ?.hourlyRentPrice
                                                    )}
                                                    /
                                                </p>
                                                <p className="font-bold  text-primary">
                                                    giờ
                                                </p>
                                            </div>
                                            <Tooltip
                                                title={`Sản phẩm này thuê ít nhất là ${convertedSkus[index]?.minRentalQuantity} nhiều nhất là ${convertedSkus[index]?.maxRentalQuantity}`}
                                            >
                                                <Icons.BsInfoCircleFill
                                                    className="ml-auto text-primary"
                                                    size={24}
                                                />
                                            </Tooltip>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-2 bg-white px-2 py-1 flex-1">
                                                <span
                                                    className="px-1   border border-blue-600 rounded-full text-lg cursor-pointer select-none"
                                                    onClick={() =>
                                                        setConvertedSkus(
                                                            (prev) => {
                                                                const backPrev =
                                                                    [...prev];
                                                                backPrev[
                                                                    index
                                                                ] = {
                                                                    ...backPrev[
                                                                        index
                                                                    ],
                                                                    quantity:
                                                                        backPrev[
                                                                            index
                                                                        ]
                                                                            .quantity >
                                                                        1
                                                                            ? --backPrev[
                                                                                  index
                                                                              ]
                                                                                  .quantity
                                                                            : backPrev[
                                                                                  index
                                                                              ]
                                                                                  .quantity,
                                                                };

                                                                return backPrev;
                                                            }
                                                        )
                                                    }
                                                >
                                                    -
                                                </span>
                                                <Input
                                                    type="number"
                                                    className="w-20"
                                                    value={
                                                        convertedSkus[index]
                                                            ?.quantity
                                                    }
                                                    onChange={(e) => {
                                                        const result = parseInt(
                                                            Math.abs(
                                                                e.target.value
                                                            )
                                                        );
                                                        setConvertedSkus(
                                                            (prev) => {
                                                                const backPrev =
                                                                    [...prev];
                                                                backPrev[
                                                                    index
                                                                ] = {
                                                                    ...backPrev[
                                                                        index
                                                                    ],
                                                                    quantity:
                                                                        result <=
                                                                        backPrev[
                                                                            index
                                                                        ].stock
                                                                            ? result
                                                                            : backPrev[
                                                                                  index
                                                                              ]
                                                                                  .stock,
                                                                };

                                                                return backPrev;
                                                            }
                                                        );
                                                    }}
                                                />
                                                <span
                                                    className="px-1  border border-blue-600 rounded-full text-lg cursor-pointer select-none "
                                                    onClick={() =>
                                                        setConvertedSkus(
                                                            (prev) => {
                                                                const backPrev =
                                                                    [...prev];
                                                                backPrev[
                                                                    index
                                                                ] = {
                                                                    ...backPrev[
                                                                        index
                                                                    ],
                                                                    quantity:
                                                                        backPrev[
                                                                            index
                                                                        ]
                                                                            .quantity <
                                                                        backPrev[
                                                                            index
                                                                        ].stock
                                                                            ? ++backPrev[
                                                                                  index
                                                                              ]
                                                                                  .quantity
                                                                            : backPrev[
                                                                                  index
                                                                              ]
                                                                                  .quantity,
                                                                };

                                                                return backPrev;
                                                            }
                                                        )
                                                    }
                                                >
                                                    +
                                                </span>
                                            </div>
                                            <div className="flex-2"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        ),
        [data?.skus, convertedSkus]
    );

    return (
        <div className="px-4 py-2 ">
            <div className="bg-slate-100 p-2">
                <div className="bg-gradient-to-r from-primary to-secondary p-2 text-lg rounded text-white flex gap-2 items-center">
                    <img src={logo} alt="Logo" className="h-8 w-8" />
                    <span>Thuê đồ chất lượng theo sở thích của bạn</span>
                </div>
                <div className="flex gap-2 mt-2">
                    {renderLeftPanel}
                    {renderPanelRight}
                </div>
            </div>
        </div>
    );
}

export default withBaseComponent(RentalForm);
