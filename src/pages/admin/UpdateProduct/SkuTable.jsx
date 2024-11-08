import { Button, Input, Tooltip, Select } from "antd";
import { memo, useEffect, useMemo, useState } from "react";
import { capitalizeWords } from "utils/helper";
import Icons from "utils/icons";

const { Option } = Select;

function SkuTable({ variants, setVariants, variantErrors, variantAtts }) {
    const [isEdit, setIsEdit] = useState(false);
    const [selectedAttEdit, setSelectedAttEdit] = useState({});
    const [skuCodeChange, setSKUCodeChange] = useState(null);
    const [priceChange, setPriceChange] = useState(null);
    const [stockChange, setStockChange] = useState(null);
    const [discountChange, setDiscountChange] = useState(null);

    useEffect(() => {
        const selectedCompine = {};
        variantAtts.forEach((v) => {
            selectedCompine[v.value] = "All";
        });
        setSelectedAttEdit(selectedCompine);
    }, [variantAtts]);

    const handleVariantTableChange = async (index, field, value) => {
        setVariants((prevVariants) => {
            const updatedVariants = [...prevVariants];
            updatedVariants[index] = {
                ...updatedVariants[index],
                [field]: value,
            };
            return updatedVariants;
        });
    };

    const editATTVariants = () => {
        if (!priceChange && !stockChange && !discountChange && !skuCodeChange)
            return;

        setVariants((prevVariants) => {
            return prevVariants.map((variant) => {
                const isMatchingVariant = Object.keys(selectedAttEdit).every(
                    (att) =>
                        selectedAttEdit[att] === "All" ||
                        variant[att] === selectedAttEdit[att]
                );

                if (isMatchingVariant) {
                    return {
                        ...variant,
                        ...(priceChange && { price: priceChange }),
                        ...(stockChange && { stock: stockChange }),
                        ...(discountChange && { discount: discountChange }),
                        ...(skuCodeChange && { code: skuCodeChange }),
                    };
                }

                return variant;
            });
        });
    };

    const EditControllerUI = useMemo(
        () => (
            <div className="flex gap-2  items-center my-2 justify-between border rounded px-4 py-2">
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
                            <Option value="All">All</Option>
                            {att.options.map((op, iOption) => (
                                <Option value={op.raw} key={iOption}>
                                    {capitalizeWords(op.raw)}
                                </Option>
                            ))}
                        </Select>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input
                        prefix="$"
                        placeholder="Retail price"
                        value={priceChange}
                        type="number"
                        min={0}
                        onChange={(e) =>
                            setPriceChange(Math.abs(e.target.value))
                        }
                        style={{ width: 150, borderColor: "#00ADB5" }}
                    />
                    <Input
                        placeholder="Stock"
                        type="number"
                        style={{ width: 100 }}
                        min={0}
                        value={stockChange}
                        onChange={(e) =>
                            setStockChange(Math.abs(e.target.value))
                        }
                    />
                    <Input
                        placeholder="Seller SKU"
                        style={{ width: 150 }}
                        type="number"
                        min={0}
                        value={skuCodeChange}
                        onChange={(e) =>
                            setSKUCodeChange(Math.abs(e.target.value))
                        }
                    />
                    <Input
                        placeholder="Discount"
                        style={{ width: 150 }}
                        min={0}
                        value={discountChange}
                        type="number"
                        onChange={(e) =>
                            setDiscountChange(Math.abs(e.target.value))
                        }
                    />
                    <Button type="primary" onClick={() => editATTVariants()}>
                        Apply
                    </Button>
                </div>
            </div>
        ),
        [
            variantAtts,
            priceChange,
            stockChange,
            skuCodeChange,
            discountChange,
            selectedAttEdit,
        ]
    );

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-primary">Variant List</h1>
                {variants.some((el) => el["color"] || el["size"]) && (
                    <Button onClick={() => setIsEdit(!isEdit)}>
                        Batch Edit
                    </Button>
                )}
            </div>

            {isEdit && EditControllerUI}

            <table className="table-auto rounded p-2 bg-slate-50 mb-1 text-left w-full border-separate transition-all duration-300 ease-in">
                <thead className="font-bold bg-light text-white text-[13px] text-center border border-blue-300">
                    <tr>
                        <th className="px-4 py-2">#</th>
                        {variants.length > 0 &&
                            Object.keys(variants[0]).map(
                                (att, idx) =>
                                    att !== "images" && (
                                        <th key={idx} className="px-4 py-2">
                                            {capitalizeWords(att)}
                                        </th>
                                    )
                            )}
                    </tr>
                </thead>
                <tbody>
                    {variants?.map((e, index) => (
                        <tr key={index} className="relative">
                            <td className="px-2 py-1 border border-slate-500 text-center text-lg font-bold">
                                {index + 1}
                            </td>
                            {Object.entries(e).map(
                                ([field, value]) =>
                                    field !== "images" && (
                                        <td
                                            key={field}
                                            className="px-2 py-1 border border-slate-500 "
                                        >
                                            <Tooltip
                                                title={
                                                    value ? (
                                                        `${capitalizeWords(
                                                            field
                                                        )}: ${value}`
                                                    ) : (
                                                        <span>No value</span>
                                                    )
                                                }
                                                placement="top"
                                            >
                                                <Input
                                                    value={value}
                                                    onChange={(ev) =>
                                                        handleVariantTableChange(
                                                            index,
                                                            field,
                                                            ev.target.value
                                                        )
                                                    }
                                                    className={` ${
                                                        variantErrors[index] &&
                                                        variantErrors[index][
                                                            field
                                                        ]
                                                            ? "outline-red-400  placeholder:text-red-500 italic outline-dotted "
                                                            : "text-lg font-bold"
                                                    } `}
                                                    placeholder={
                                                        variantErrors[index] &&
                                                        variantErrors[index][
                                                            field
                                                        ]
                                                            ? "Required ..."
                                                            : ""
                                                    }
                                                    disabled={
                                                        field === "size" ||
                                                        field === "color"
                                                    }
                                                />
                                            </Tooltip>
                                        </td>
                                    )
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default memo(SkuTable);