import { Button, Input, Tooltip, Select } from "antd";
import { memo, useMemo, useState } from "react";
import { capitalizeWords } from "utils/helper";
import Icons from "utils/icons";

const { Option } = Select;

function SkuTable({ variants, setVariants, variantErrors }) {
    const [isEdit, setIsEdit] = useState(true);

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

    const EditControllerUI = useMemo(
        () => (
            <div className="flex gap-2  items-center my-2 justify-between border rounded px-4 py-2">
                <div className="flex gap-2">
                    <Select defaultValue="All" style={{ width: 100 }}>
                        <Option value="All">All</Option>
                        <Option value="Option1">Option 1</Option>
                        <Option value="Option2">Option 2</Option>
                    </Select>
                    <Select defaultValue="All" style={{ width: 100 }}>
                        <Option value="All">All</Option>
                        <Option value="Option1">Option 1</Option>
                        <Option value="Option2">Option 2</Option>
                    </Select>
                </div>
                <div className="flex gap-2">
                    <Input
                        prefix="$"
                        placeholder="Retail price"
                        style={{ width: 150, borderColor: "#00ADB5" }}
                    />
                    <Input placeholder="Quantity" style={{ width: 100 }} />
                    <Input placeholder="Seller SKU" style={{ width: 150 }} />
                    <Button type="primary">Apply</Button>
                </div>
            </div>
        ),
        []
    );

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-primary">Variant List</h1>
                <Button onClick={() => setIsEdit(!isEdit)}>Batch Edit</Button>
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
                        <tr key={e.id} className="relative">
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
