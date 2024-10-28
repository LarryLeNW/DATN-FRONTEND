import { Input, notification, Radio } from "antd";
import Button from "components/Button";
import { memo, useCallback, useState } from "react";
import Icons from "utils/icons";
import ImageProductCtrl from "./ImageProductCtrl";

function ATTOptionPanel({
    setVariantAtts,
    variantAtts,
    handleAttSkuTableChange,
}) {
    const handleAddNewVariantAtt = () => {
        setVariantAtts((prev) => [
            ...prev,
            {
                name: "Something",
                isImage: false,
                options: [{ raw: "", images: [] }],
            },
        ]);
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
            const updatedAtt = [...prev];
            updatedAtt[index].options.push({ raw: "", images: [] });
            return [...updatedAtt];
        });
    };

    const removeVariantAttOption = (attIndex, optionIndex) => {
        if (variantAtts[attIndex].options.length === 1) {
            notification.warning({
                message: "Please at least have one variant option",
            });
            return;
        }

        setVariantAtts((prev) => {
            const newAtts = [...prev];
            newAtts[attIndex].options = newAtts[attIndex].options.filter(
                (_, i) => i !== optionIndex
            );
            return newAtts;
        });
    };

    const handleVariantNameChange = (indexAtt, e) => {
        const newValue = e.target.value;
        setVariantAtts((prev) => {
            const updatedAtts = [...prev];
            updatedAtts[indexAtt].name = newValue;
            return updatedAtts;
        });
    };

    const handleVariantOptionInputChange = (attIndex, optionIndex, e) => {
        const newValue = e.target.value;
        setVariantAtts((prev) => {
            const updatedAtts = [...prev];
            updatedAtts[attIndex].options[optionIndex].raw = newValue;
            return updatedAtts;
        });
    };

    const activeImageVariant = (indexATT) => {
        setVariantAtts((prev) => {
            const newAtts = [...prev];
            return newAtts.map((el, index) => {
                if (index === indexATT) return { ...el, isImage: true };
                else return { ...el, isImage: false };
            });
        });
    };

    const setImagesVariant = (value, indexOption, indexAtt) => {
        console.log("🚀 ~ setImagesVariant ~ indexAtt:", indexAtt);
        console.log("🚀 ~ setImagesVariant ~ indexOption:", indexOption);
        setVariantAtts((prev) => {
            // Deep clone mảng `variantAtts`
            const updatedAtts = prev.map((att, attIdx) => {
                if (attIdx === indexAtt) {
                    // Deep clone object `options` cho `att` được chọn
                    return {
                        ...att,
                        options: att.options.map((option, optIdx) => {
                            if (optIdx === indexOption) {
                                return {
                                    ...option,
                                    images: value,
                                };
                            }
                            return option;
                        }),
                    };
                }
                return att;
            });

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
                        <div className="flex justify-between items-center">
                            <label
                                htmlFor="name-option-variant"
                                className="text-blue-600 font-bold"
                            >
                                Variant Name
                            </label>
                            <Radio
                                onClick={() => activeImageVariant(indexAtt)}
                                checked={data.isImage}
                            >
                                Image
                            </Radio>
                        </div>
                        <div className="flex items-center gap-4">
                            <Input
                                id="name-option-variant"
                                value={data.name}
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
                        {data.options.map((el, indexOption) => (
                            <div key={indexOption}>
                                <div className="flex items-center gap-4">
                                    <Input
                                        id="name-option-variant"
                                        value={el.raw}
                                        onChange={(e) => {
                                            handleVariantOptionInputChange(
                                                indexAtt,
                                                indexOption,
                                                e
                                            );
                                        }}
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
                                {data.isImage && (
                                    <ImageProductCtrl
                                        widthItems={"78px"}
                                        heightItems={"100px"}
                                        images={el.images}
                                        setImages={(value) => {
                                            setImagesVariant(
                                                value,
                                                indexOption,
                                                indexAtt
                                            );
                                        }}
                                        isWarning={false}
                                    />
                                )}
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
