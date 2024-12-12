import { Button, DatePicker, Input, notification, Select, Tooltip } from "antd";
import logo from "assets/logo.png";
import paths from "constant/paths";
import withBaseComponent from "hocs";
import moment from "moment";
import "moment/locale/vi";
import { useEffect, useMemo, useState } from "react";
import {
    fillUniqueATTSkus,
    findSkuByMultipleAttributes,
    formatCurrency,
    formatMoney,
} from "utils/helper";
import Icons from "utils/icons";

function RentalForm({ data, checkLoginBeforeAction, dispatch, navigate }) {
    const [convertedSkus, setConvertedSkus] = useState([]);
    const [totalRental, setTotalRental] = useState(0);
    const [selectedPackage, setSelectedPackage] = useState(null);
    console.log("🚀 ~ RentalForm ~ selectedPackage:", selectedPackage);

    useEffect(() => {
        setTotalRental(
            convertedSkus.reduce((sum, prev, index) => {
                if (prev.isChoose) return sum + calTotalRental(index);

                return sum;
            }, 0)
        );
    }, [convertedSkus, selectedPackage]);

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
                        hour: 1,
                        day: 0,
                        isChoose: false,
                    });
                }
                return acc;
            },
            { seen: new Set(), result: [] }
        ).result;

        if (convertRentalSkus.length < 1) {
            setConvertedSkus([
                {
                    ...data.skus[0],
                    quantity: 1,
                    hour: 1,
                    day: 0,
                    isChoose: true,
                },
            ]);
            return;
        }

        setConvertedSkus(convertRentalSkus);
    }, []);

    const handleRental = () => {
        const chooseRentalProducts = convertedSkus.filter((el) => el.isChoose);
        console.log("🚀 ~ handleRental ~ chooseRentalProducts:", chooseRentalProducts)

        if (chooseRentalProducts.length === 0 && convertedSkus.length > 1)  {
            notification.warning({
                message: "Vui lòng chọn sản phẩm để thuê",
                duration: 1,
                placement: "top",
            });

            return;
        }

        navigate(paths.CHECKOUT.RENTAL_PAYMENT, {
            state: {
                product: data,
                selectedPackage,
                rentalProducts: convertedSkus.length > 1 ? chooseRentalProducts : convertedSkus,
                totalRental,
            },
        });
    };

    const calTotalRental = (index) => {
        let total = 0;

        if (selectedPackage) {
            total +=
                convertedSkus[index].price *
                (selectedPackage.price / 100) *
                selectedPackage.durationDays;
        } else {
            if (convertedSkus[index].hour)
                total +=
                    convertedSkus[index].hourlyRentPrice *
                    convertedSkus[index].hour;

            if (convertedSkus[index].day) {
                total +=
                    convertedSkus[index].dailyRentPrice *
                    convertedSkus[index].day;
            }
        }

        return total * convertedSkus[index].quantity;
    };

    const handleChangeConvertedSkus = (keyAtt, valueATT, index) => {
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
            <div className="w-1/3 border bg-white rounded p-2 flex flex-col gap-2 ">
                <p className="font-bold">
                    <span className="text-gray-500">Sản phẩm : </span>
                    <span className="text-primary text-lg">{data.name}</span>
                </p>
                <div className="flex flex-col gap-4">
                    {data.rentalPackages.map((el) => (
                        <div
                            className={`border flex  justify-between rounded p-2 cursor-pointer ${
                                selectedPackage?.id === el.id
                                    ? "border-purple-700 border-2"
                                    : " border-purple-400 "
                            }`}
                            onClick={() => {
                                if (selectedPackage?.id === el.id) {
                                    setSelectedPackage(null);
                                } else setSelectedPackage(el);
                            }}
                        >
                            <p className="flex gap-2 items-center ">
                                <span
                                    className={`font-bold text-lg italic ${
                                        selectedPackage?.id === el.id &&
                                        "text-primary"
                                    }`}
                                >
                                    {el.name}
                                </span>
                            </p>
                            <p className="flex gap-2 items-center ">
                                <del className="font-bold text-lg text-gray-500">
                                    {el.discountPercentage}%
                                </del>
                                <span className="font-bold text-lg text-orange-600">
                                    {el.price}%
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center mt-auto ">
                    <p>Tổng tiền</p>
                    <p className="font-bold  text-orange-700 ">
                        {totalRental > 0
                            ? `${formatMoney(totalRental)} vnđ`
                            : "Vui lòng chọn sản phẩm"}
                    </p>
                </div>
                <button
                    onClick={() => checkLoginBeforeAction(() => handleRental())}
                    className=" bg-primary rounded p-2 cursor-pointer text-lg font-bold text-white flex items-center justify-center"
                >
                    <div>Tiến hành thanh toán</div>
                </button>
            </div>
        ),
        [data?.skus, totalRental, selectedPackage, convertedSkus]
    );

    const renderLeftPanel = useMemo(
        () => (
            <div className="w-2/3 border bg-white rounded p-2 max-h-96 overflow-auto">
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
                                        {convertedSkus[index].attributes
                                            ?.color && (
                                            <div className="flex gap-2 font-bold">
                                                <p>Màu :</p>
                                                <p>
                                                    {
                                                        convertedSkus[index]
                                                            .attributes?.color
                                                    }
                                                </p>
                                            </div>
                                        )}

                                        {convertedSkus[index].attributes
                                            ?.size && (
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
                                                                    el
                                                                        .attributes
                                                                        .size,
                                                                    index
                                                                )
                                                            }
                                                            className={`py-1 border rounded px-2 bg-white ${
                                                                convertedSkus[
                                                                    index
                                                                ]?.attributes
                                                                    ?.size ===
                                                                    el
                                                                        .attributes
                                                                        .size &&
                                                                "shadow-md shadow-blue-600 "
                                                            }`}
                                                        >
                                                            {el.attributes.size}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {convertedSkus[index].attributes
                                            ?.material && (
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
                                                                convertedSkus[
                                                                    index
                                                                ]?.attributes
                                                                    ?.material ===
                                                                    el
                                                                        .attributes
                                                                        .material &&
                                                                "shadow-md shadow-blue-600 "
                                                            }`}
                                                            onClick={() =>
                                                                handleChangeConvertedSkus(
                                                                    "material",
                                                                    el
                                                                        .attributes
                                                                        .material,
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            {
                                                                el.attributes
                                                                    .material
                                                            }
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

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
                                            {!selectedPackage ? (
                                                <>
                                                    <div className="flex-2 flex gap-2 items-center">
                                                        <p>Giờ :</p>
                                                        <Select
                                                            className="w-20"
                                                            options={Array.from(
                                                                { length: 23 },
                                                                (_, value) => ({
                                                                    label: `${++value} Giờ`,
                                                                    value,
                                                                })
                                                            )}
                                                            value={
                                                                convertedSkus[
                                                                    index
                                                                ].hour
                                                            }
                                                            onChange={(value) =>
                                                                setConvertedSkus(
                                                                    (prev) => {
                                                                        const backPrev =
                                                                            [
                                                                                ...prev,
                                                                            ];
                                                                        backPrev[
                                                                            index
                                                                        ] = {
                                                                            ...backPrev[
                                                                                index
                                                                            ],
                                                                            hour: value,
                                                                        };

                                                                        return backPrev;
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex-2 flex gap-2 items-center">
                                                        <p>Ngày :</p>
                                                        <Input
                                                            type="number"
                                                            className="w-20"
                                                            value={
                                                                convertedSkus[
                                                                    index
                                                                ]?.day
                                                            }
                                                            onChange={(e) => {
                                                                const result =
                                                                    parseInt(
                                                                        Math.abs(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    );
                                                                setConvertedSkus(
                                                                    (prev) => {
                                                                        const backPrev =
                                                                            [
                                                                                ...prev,
                                                                            ];
                                                                        backPrev[
                                                                            index
                                                                        ] = {
                                                                            ...backPrev[
                                                                                index
                                                                            ],
                                                                            day: result,
                                                                        };

                                                                        return backPrev;
                                                                    }
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="italic text-primary">
                                                    Đã áp dụng gói{" "}
                                                    {selectedPackage.name}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-end gap-2 items-center">
                                            <div className="flex gap-1 text-orange-700">
                                                <p>Tổng tiền</p>
                                                <p>
                                                    {formatMoney(
                                                        calTotalRental(index)
                                                    )}{" "}
                                                    vnđ
                                                </p>
                                            </div>
                                            {convertedSkus.length > 1 && (
                                                <Button
                                                    onClick={() => {
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
                                                                    isChoose:
                                                                        !backPrev[
                                                                            index
                                                                        ]
                                                                            .isChoose,
                                                                };

                                                                return backPrev;
                                                            }
                                                        );
                                                    }}
                                                    className={`text-white ${
                                                        convertedSkus[index]
                                                            .isChoose
                                                            ? "bg-red-500"
                                                            : "bg-primary"
                                                    }`}
                                                >
                                                    {convertedSkus[index]
                                                        .isChoose
                                                        ? "Bỏ chọn"
                                                        : "Chọn"}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        ),
        [data?.skus, convertedSkus, selectedPackage]
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
