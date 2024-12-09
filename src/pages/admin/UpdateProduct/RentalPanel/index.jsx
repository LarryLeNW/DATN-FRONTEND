import { Button, Input, Select, Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import { capitalizeWords } from "utils/helper";

function RentalPanel({ variants, setVariants, variantAtts }) {
    const selectedRentalVariants = variants.map((v) => v.canBeRented);
    const [hourlyRentPriceChange, setHourlyRentPriceChange] = useState(null);
    const [dailyRentPriceChange, setDailyRentPriceChange] = useState(null);
    const [minRentalQuantityChange, setMinRentalQuantityChange] =
        useState(null);
    const [maxRentalQuantityChange, setMaxRentalQuantityChange] =
        useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedAttEdit, setSelectedAttEdit] = useState({});

    useEffect(() => {
        setVariants((prev) => {
            const formatVariants = [...prev];
            console.log("🚀 ~ setVariants ~ formatVariants:", formatVariants);
            formatVariants.forEach((v) => {
                if (v.price) {
                    if (!v.hourlyRentPrice)
                        v.hourlyRentPrice = +(v.price * 0.1).toFixed(0);
                    if (!v.dailyRentPrice)
                        v.dailyRentPrice = +(v.price * 0.2).toFixed(0);
                }
                if (v.stock && !v.maxRentalQuantity) {
                    v.maxRentalQuantity = v.stock;
                }
            });
            return formatVariants;
        });
    }, []);

    useEffect(() => {
        const selectedCompine = {};
        variantAtts.forEach((v) => {
            selectedCompine[v.value] = "All";
        });
        setSelectedAttEdit(selectedCompine);
    }, [variantAtts]);

    const onRowSelectionChange = (newSelectedRowKeys) => {
        const variantEdited = variants.map((el, index) => ({
            ...el,
            canBeRented: newSelectedRowKeys.includes(index),
        }));
        setVariants(variantEdited);
    };

    const handleVariantTableChange = (index, field, value) => {
        setVariants((prevVariants) => {
            const updatedVariants = [...prevVariants];
            updatedVariants[index] = {
                ...updatedVariants[index],
                [field]: value,
            };
            return updatedVariants;
        });
    };

    const handleEditATTVariants = () => {
        if (
            !hourlyRentPriceChange &&
            !dailyRentPriceChange &&
            !minRentalQuantityChange &&
            !maxRentalQuantityChange
        )
            return;

        setVariants((prevVariants) => {
            return prevVariants.map((variant) => {
                const isMatchingVariant = Object.keys(selectedAttEdit).every(
                    (att) =>
                        selectedAttEdit[att] === "All" ||
                        variant?.attributes[att] === selectedAttEdit[att]
                );

                if (isMatchingVariant) {
                    return {
                        ...variant,
                        ...(hourlyRentPriceChange && {
                            hourlyRentPrice: +hourlyRentPriceChange,
                        }),
                        ...(dailyRentPriceChange && {
                            dailyRentPrice: +dailyRentPriceChange,
                        }),
                        ...(minRentalQuantityChange && {
                            minRentalQuantity: +minRentalQuantityChange,
                        }),
                        ...(maxRentalQuantityChange && {
                            maxRentalQuantity: +maxRentalQuantityChange,
                        }),
                    };
                }

                return variant;
            });
        });
    };

    const columns = [
        ...Object.keys(variants[0]?.attributes || {}).map((att) => ({
            title: capitalizeWords(att),
            dataIndex: ["attributes", att],
            key: `attributes_${att}`,
            render: (value) => (
                <div className="font-bold text-lg">
                    {capitalizeWords(value)}
                </div>
            ),
        })),
        {
            title: "Giá theo giờ",
            dataIndex: "hourlyRentPrice",
            key: "hourlyRentPrice",
            render: (value, rc, index) => (
                <Input
                    value={value}
                    type="number"
                    onChange={(ev) =>
                        handleVariantTableChange(
                            index,
                            "hourlyRentPrice",
                            +ev.target.value
                        )
                    }
                />
            ),
        },
        {
            title: "Giá theo ngày",
            dataIndex: "dailyRentPrice",
            key: "dailyRentPrice",
            render: (value, rc, index) => (
                <Input
                    value={value}
                    type="number"
                    onChange={(ev) =>
                        handleVariantTableChange(
                            index,
                            "dailyRentPrice",
                            +ev.target.value
                        )
                    }
                />
            ),
        },
        {
            title: "Số lượng tối thiểu",
            dataIndex: "minRentalQuantity",
            key: "minRentalQuantity",
            render: (value, index) => (
                <Input
                    value={value}
                    type="number"
                    onChange={(ev) =>
                        handleVariantTableChange(
                            index,
                            "minRentalQuantity",
                            +ev.target.value
                        )
                    }
                />
            ),
        },
        {
            title: "Số lượng tối đa",
            dataIndex: "maxRentalQuantity",
            key: "maxRentalQuantity",
            render: (value, rc, index) => (
                <Input
                    value={value}
                    type="number"
                    onChange={(ev) =>
                        handleVariantTableChange(
                            index,
                            "maxRentalQuantity",
                            +ev.target.value
                        )
                    }
                />
            ),
        },
    ];

    const EditControllerUI = useMemo(
        () => (
            <div className="flex gap-2 items-center my-2 justify-between border rounded px-4 py-2">
                <div className="flex gap-2">
                    {variantAtts.map((att, iAtt) => (
                        <Select
                            value={selectedAttEdit[att.value]}
                            style={{ width: 100 }}
                            key={iAtt}
                            onChange={(value) =>
                                setSelectedAttEdit((prev) => ({
                                    ...prev,
                                    [att.value]: value,
                                }))
                            }
                        >
                            <Select.Option value="All">All</Select.Option>
                            {att.options.map((op, iOption) => (
                                <Select.Option value={op.raw} key={iOption}>
                                    {capitalizeWords(op.raw)}
                                </Select.Option>
                            ))}
                        </Select>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder="Giá theo giờ"
                        value={hourlyRentPriceChange}
                        type="number"
                        min={0}
                        onChange={(e) =>
                            setHourlyRentPriceChange(Math.abs(e.target.value))
                        }
                        style={{ width: "fit-content", borderColor: "#00ADB5" }}
                    />
                    <Input
                        placeholder="Giá theo ngày"
                        type="number"
                        style={{ width: 150 }}
                        min={0}
                        value={dailyRentPriceChange}
                        onChange={(e) =>
                            setDailyRentPriceChange(Math.abs(e.target.value))
                        }
                    />
                    <Input
                        placeholder="Số lương tối thiểu"
                        style={{ width: 200 }}
                        type="number"
                        min={0}
                        value={minRentalQuantityChange}
                        onChange={(e) =>
                            setMinRentalQuantityChange(Math.abs(e.target.value))
                        }
                    />
                    <Input
                        placeholder="Số lượng tối đa"
                        style={{ width: "fit-content" }}
                        min={0}
                        value={maxRentalQuantityChange}
                        type="number"
                        onChange={(e) =>
                            setMaxRentalQuantityChange(Math.abs(e.target.value))
                        }
                    />
                    <Button type="primary" onClick={handleEditATTVariants}>
                        Apply
                    </Button>
                </div>
            </div>
        ),
        [
            hourlyRentPriceChange,
            dailyRentPriceChange,
            minRentalQuantityChange,
            maxRentalQuantityChange,
            selectedRentalVariants,
        ]
    );

    return (
        <div className="flex flex-col border justify-between p-6 gap-2 bg-white rounded">
            <div className="flex justify-between ">
                <div className="font-bold text-lg text-primary">
                    Cập nhật thông tin thuê
                </div>
                {variants.length > 1 && (
                    <Button onClick={() => setIsEdit(!isEdit)}>
                        Chỉnh sửa hàng loạt
                    </Button>
                )}
            </div>
            {isEdit && EditControllerUI}
            <div>
                <Table
                    rowSelection={{
                        selectedRentalVariants,
                        onChange: onRowSelectionChange,
                    }}
                    columns={columns}
                    dataSource={variants?.map((variant, index) => ({
                        key: index,
                        ...variant,
                    }))}
                />
            </div>
        </div>
    );
}

export default RentalPanel;
