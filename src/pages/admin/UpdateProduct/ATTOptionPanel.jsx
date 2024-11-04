import { Input, notification, Radio, Select } from "antd";
import Button from "components/Button";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Icons from "utils/icons";
import ImageProductCtrl from "./ImageProductCtrl";

function ATTOptionPanel({
    setVariantAtts,
    variantAtts,
    handleAttSkuTableChange,
    variants,
}) {
    useEffect(() => {
        if (variantAtts.length < 1) {
            setVariantAtts([
                {
                    label: "Color",
                    value: "color",
                    options: [{ raw: "", images: variants[0].images }],
                },
            ]);
        }
    }, [variantAtts]);

    const [ATTErrors, setATTErrors] = useState([]);
    const [isUpdate, setIsUpdate] = useState(true);

    const handleAddNewVariantAtt = () => {
        const newATT = {
            label: variantAtts[0].label == "Color" ? "Size" : "Color",
            value: variantAtts[0].value == "color" ? "size" : "color",
            options: [{ raw: "", images: [] }],
        };

        setVariantAtts((prev) => [...prev, newATT]);
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

    const handleVariantNameChange = (indexAtt, value) => {
        const ATTUpdated = {
            label: variantAtts[0].label == "Color" ? "Size" : "Color",
            value: variantAtts[0].value == "color" ? "size" : "color",
            options: [{ raw: "", images: [] }],
        };

        setVariantAtts((prev) => {
            const updatedAtts = [...prev];
            updatedAtts[indexAtt] = ATTUpdated;
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
        validateATTs();
    };

    const setImagesVariant = (value, indexOption, indexAtt) => {
        setVariantAtts((prev) => {
            const updatedAtts = prev.map((att, attIdx) => {
                if (attIdx === indexAtt) {
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
        validateATTs();
    };

    const validateATTs = () => {
        setATTErrors([]);

        const errors = variantAtts.map((att) => {
            const attError = [];

            att.options.forEach((el, index) => {
                const optionError = {};
                if (!el.raw) {
                    optionError.raw = "Option Name required";
                }
                if (
                    att.value === "color" &&
                    (!el.images || el.images.length === 0)
                ) {
                    optionError.image =
                        "Please select at least one image in field color";
                }
                attError[index] = optionError;
            });

            return attError;
        });

        setATTErrors(errors);

        return errors.every((attError) =>
            attError.every(
                (optionError) => Object.keys(optionError).length === 0
            )
        );
    };

    const confirmInputATT = () => {
        if (!validateATTs()) {
            notification.warning({
                message: "Please fill all field...",
                duration: 1,
            });
            return;
        }
        handleAttSkuTableChange();
        setIsUpdate(false);
    };

    const EditUI = useMemo(
        () => (
            <>
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
                            </div>
                            <div className="flex items-center gap-4">
                                <Select
                                    id="name-option-variant"
                                    options={[
                                        { label: "Color", value: "color" },
                                        { label: "Size", value: "size" },
                                    ]}
                                    defaultValue={data.value}
                                    className="w-full"
                                    onChange={(value) =>
                                        handleVariantNameChange(indexAtt, value)
                                    }
                                    disabled={variantAtts.length === 2}
                                />
                                {variantAtts.length > 1 && (
                                    <Icons.MdDeleteForever
                                        onClick={() =>
                                            handleRemoveVariantAtt(indexAtt)
                                        }
                                        size={24}
                                        color="red"
                                        className="cursor-pointer"
                                    />
                                )}
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
                                            placeholder={
                                                ATTErrors[indexAtt] &&
                                                ATTErrors[indexAtt][indexOption]
                                                    ?.raw
                                                    ? ATTErrors[indexAtt][
                                                          indexOption
                                                      ]?.raw
                                                    : ""
                                            }
                                            className={`${
                                                ATTErrors[indexAtt] &&
                                                ATTErrors[indexAtt][indexOption]
                                                    ?.raw
                                                    ? "outline-red-400 placeholder:text-red-500 italic outline-dotted"
                                                    : "text-lg font-bold"
                                            }`}
                                        />
                                        {data.options.length > 1 && (
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
                                        )}
                                    </div>
                                    {data.value === "color" && (
                                        <ImageProductCtrl
                                            error={
                                                ATTErrors[indexAtt] &&
                                                ATTErrors[indexAtt][indexOption]
                                                    ?.image
                                            }
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
                                            isShowLocalUpload={false}
                                            isWarning={false}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div
                            className="cursor-pointer flex gap-2 items-center text-black rounded px-4 py-2 w-fit"
                            onClick={() =>
                                handleAddNewVariantAttOption(indexAtt)
                            }
                        >
                            <Icons.FaPlus color="green" />
                        </div>
                    </div>
                ))}

                <div className="flex justify-between items-center">
                    <Button
                        style="cursor-pointer flex gap-2 items-center text-white rounded px-4 py-2 w-fit bg-green-600"
                        handleClick={() => confirmInputATT()}
                        name={"Done"}
                        iconBefore={<Icons.MdDone />}
                    />
                    {variantAtts.length != 2 && (
                        <div
                            className="cursor-pointer flex gap-2 items-center text-green-500 rounded px-4 py-2 w-fit"
                            onClick={() => handleAddNewVariantAtt()}
                        >
                            <Icons.FaPlus />
                            <p>Add Variation</p>
                        </div>
                    )}
                </div>
            </>
        ),
        [variantAtts, ATTErrors]
    );

    const ViewUI = useMemo(
        () => (
            <>
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
                                    Variant : {data.label}
                                </label>
                            </div>
                        </div>
                        <div className="flex  items-center gap-2">
                            {data.options.map((el, indexOption) => (
                                <div
                                    key={indexOption}
                                    className="flex items-center gap-4 border px-4 py-2 rounded border-primary bg-white text-lg font-bold"
                                >
                                    {el.raw}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <div
                    className="text-primary flex items-center gap-2 cursor-pointer ml-auto text-lg"
                    onClick={() => setIsUpdate(true)}
                >
                    <Icons.FaEdit />
                    <span>Update</span>
                </div>
            </>
        ),
        [variantAtts]
    );

    return (
        <div className="px-6 py-4 border rounded flex flex-col gap-4">
            {isUpdate ? EditUI : ViewUI}
        </div>
    );
}

export default memo(ATTOptionPanel);
