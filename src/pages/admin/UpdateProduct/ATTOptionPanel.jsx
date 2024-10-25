import { Input, notification } from "antd";
import Button from "components/Button";
import { memo } from "react";
import Icons from "utils/icons";

function ATTOptionPanel({
    setVariantAtts,
    variantAtts,
    handleAttSkuTableChange,
}) {
    const handleAddNewVariantAtt = () => {
        setVariantAtts((prev) => [...prev, ["", [""]]]);
    };

    const handleRemoveVariantAtt = (attIndex) => {
        if (variantAtts.length === 1) {
            notification.warning({
                message: "Please at least have one variant",
            });
            return;
        }

        setVariantAtts((prev) => {
            const updatedAtt = prev.filter((_, i) => i !== attIndex);
            return [...updatedAtt];
        });
    };

    const handleAddNewVariantAttOption = (index) => {
        setVariantAtts((prev) => {
            const newAtt = [...prev[index][1], ""];
            prev[index][1] = newAtt;
            return [...prev];
        });
    };

    const removeVariantAttOption = (attIndex, optionIndex) => {
        if (variantAtts[attIndex][1].length === 1) {
            notification.warning({
                message: "Please at least have one variant option",
            });
            return;
        }

        setVariantAtts((prev) => {
            const newAtts = [...prev];
            newAtts[attIndex][1] = newAtts[attIndex][1].filter(
                (_, i) => i !== optionIndex
            );
            return newAtts;
        });
    };

    const handleVariantNameChange = (indexAtt, e) => {
        const newValue = e.target.value;
        setVariantAtts((prev) => {
            const updatedAtts = [...prev];
            updatedAtts[indexAtt][0] = newValue;
            return updatedAtts;
        });
    };

    const handleVariantOptionChange = (attIndex, optionIndex, e) => {
        const newValue = e.target.value;
        setVariantAtts((prev) => {
            const updatedAtts = [...prev];
            updatedAtts[attIndex][1][optionIndex] = newValue;
            return updatedAtts;
        });
    };

    return (
        <div className="px-6 py-4 border rounded flex flex-col gap-4">
            {variantAtts.map((data, indexAtt) => (
                <div
                    key={indexAtt}
                    className="px-6 py-4 bg-slate-100 border rounded flex flex-col gap-4"
                >
                    <div className="flex flex-col justify-center gap-2">
                        <label
                            htmlFor="name-option-variant"
                            className="text-blue-600 font-bold"
                        >
                            Variant Name
                        </label>
                        <div className="flex items-center gap-4">
                            <Input
                                id="name-option-variant"
                                value={data[0]}
                                onChange={(e) =>
                                    handleVariantNameChange(indexAtt, e)
                                }
                            />
                            <Icons.MdDeleteForever
                                onClick={() => handleRemoveVariantAtt(indexAtt)}
                                size={24}
                                color="red"
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                        <label
                            htmlFor="name-option-variant"
                            className="text-primary font-bold"
                        >
                            Option
                        </label>
                        {data[1].map((el, indexOption) => (
                            <div
                                key={indexOption}
                                className="flex items-center gap-4"
                            >
                                <Input
                                    id="name-option-variant"
                                    value={el}
                                    onChange={(e) =>
                                        handleVariantOptionChange(
                                            indexAtt,
                                            indexOption,
                                            e
                                        )
                                    }
                                />
                                <Icons.MdDeleteForever
                                    onClick={() =>
                                        removeVariantAttOption(
                                            indexAtt,
                                            indexOption
                                        )
                                    }
                                    size={18}
                                    color="red"
                                    className="cursor-pointer"
                                />
                            </div>
                        ))}
                    </div>
                    <div
                        className="cursor-pointer flex gap-2 items-center text-black rounded px-4 py-2 w-fit"
                        onClick={() => handleAddNewVariantAttOption(indexAtt)}
                    >
                        <Icons.FaPlus color="green" />
                    </div>
                </div>
            ))}

            <div className="flex justify-between items-center">
                <Button
                    style="cursor-pointer flex gap-2 items-center text-white rounded px-4 py-2 w-fit bg-green-600"
                    handleClick={() => handleAttSkuTableChange()}
                    name={"Done"}
                    iconBefore={<Icons.MdDone />}
                />

                <div
                    className="cursor-pointer flex gap-2 items-center text-green-500 rounded px-4 py-2 w-fit"
                    onClick={() => handleAddNewVariantAtt()}
                >
                    <Icons.FaPlus />
                    <p>Add Variation</p>
                </div>
            </div>
        </div>
    );
}

export default memo(ATTOptionPanel);
