import {
    Button,
    Input,
    Modal,
    notification,
    Radio,
    Select,
    Table,
    Tooltip,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { capitalizeWords, formatCurrency } from "utils/helper";
import RentalPackage from "./RentalPackage";
import Icons from "utils/icons";
import PackageForm from "./PackageForm";

function RentalPanel({
    variants,
    setVariants,
    variantAtts,
    rentalPackages,
    setRentalPackages,
}) {
    const [rentalPackageSelected, setRentalPackageSelected] = useState(null);
    const [isShowPackageForm, setIsShowPackageForm] = useState(false);

    const selectedRentalVariants = variants.map((v) => v.canBeRented);
    const [hourlyRentPriceChange, setHourlyRentPriceChange] = useState(null);
    const [dailyRentPriceChange, setDailyRentPriceChange] = useState(null);
    const [minRentalQuantityChange, setMinRentalQuantityChange] =
        useState(null);
    const [maxRentalQuantityChange, setMaxRentalQuantityChange] =
        useState(null);
    const [isOpenBatchEdit, setIsOpenBatchEdit] = useState(false);
    const [selectedAttEdit, setSelectedAttEdit] = useState({});
    const [isOpenPackageEdit, setIsOpenPackageEdit] = useState(false);

    useEffect(() => {
        setVariants((prev) => {
            const formatVariants = [...prev];
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
        if (isOpenPackageEdit && rentalPackages.length === 0) {
            setRentalPackages([
                {
                    name: "Gói 7 ngày",
                    durationDays: 7,
                    price: 8,
                    discountPercentage: 20,
                },
                {
                    name: "Gói 1 tháng",
                    durationDays: 30,
                    price: 7,
                    discountPercentage: 20,
                },
                {
                    name: "Gói 3 tháng",
                    durationDays: 90,
                    price: 5,
                    discountPercentage: 20,
                },
            ]);
        }
    }, [isOpenPackageEdit]);

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
            <Modal
                width={600}
                open={isShowPackageForm}
                onCancel={() => {
                    setIsShowPackageForm(false);
                    setRentalPackageSelected(null);
                }}
                footer={false}
                destroyOnClose={true}
            >
                <PackageForm
                    closeModal={() => setIsShowPackageForm(false)}
                    packageCurrent={rentalPackageSelected}
                    handleUpdate={(data) => {
                        if (rentalPackageSelected) {
                            setRentalPackages((prev) =>
                                prev.map((pkg) =>
                                    pkg.name === rentalPackageSelected.name
                                        ? { ...pkg, ...data }
                                        : pkg
                                )
                            );
                        } else {
                            if (
                                rentalPackages.some(
                                    (el) => el.name === data.name
                                )
                            ) {
                                notification.warning({
                                    message:
                                        "Gói này đã tồn tại, chọn tên khác",
                                    duration: 1,
                                    placement: "top",
                                });
                                return;
                            }
                            setRentalPackages((prev) => [...prev, data]);
                        }
                        setIsShowPackageForm(false);
                    }}
                />
            </Modal>
            <div className="flex justify-between ">
                <div className="font-bold text-lg text-primary">
                    Cập nhật thông tin thuê
                </div>
                {variants.length > 1 && (
                    <Button
                        onClick={() => setIsOpenBatchEdit(!isOpenBatchEdit)}
                    >
                        Chỉnh sửa hàng loạt
                    </Button>
                )}
            </div>
            {isOpenBatchEdit && EditControllerUI}
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
            <Radio
                onClick={(e) => setIsOpenPackageEdit(!isOpenPackageEdit)}
                checked={isOpenPackageEdit}
            >
                Tạo gói thuê
            </Radio>
            {isOpenPackageEdit && (
                <div className="bg-light p-1 rounded">
                    <div className="py-2 px-4 bg-white">
                        <div className="flex justify-between">
                            <h1 className="text-primary font-bold">
                                Danh sách gói thuê
                            </h1>
                            <Tooltip title={"Thêm gói thuê"}>
                                <Button
                                    onClick={() => setIsShowPackageForm(true)}
                                >
                                    <Icons.FaPlus />
                                </Button>
                            </Tooltip>
                        </div>
                        <div className="mt-4 flex gap-6 justify-center flex-wrap">
                            {rentalPackages.map((el) => (
                                <RentalPackage
                                    data={el}
                                    openEdit={() => {
                                        setRentalPackageSelected(el);
                                        setIsShowPackageForm(true);
                                    }}
                                    handleDelete={() => {
                                        if (rentalPackages.length === 1) {
                                            setIsOpenPackageEdit(false);
                                        }

                                        const updatedPackages =
                                            rentalPackages.filter(
                                                (pkg) => pkg.name !== el.name
                                            );
                                        setRentalPackages(updatedPackages);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RentalPanel;
