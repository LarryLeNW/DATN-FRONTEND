import { Checkbox, Input, notification, Radio, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import logo from "assets/images/logo.jpg";
import InputForm from "components/InputForm";
import { convertBase64ToImage, convertImageToBase64 } from "utils/helper";
import MarkdownEditor from "components/MarkdownEditor";
import { changeLoading } from "store/slicers/common.slicer";
import { createCategory, updateCategory } from "apis/productCate.api";
import { useDispatch } from "react-redux";
import moment from "moment";
import Button from "components/Button";
import Icons from "utils/icons";

function UpdateProduct({ closeModal, fetchData }) {
    const [productCurrent, setProductCurrent] = useState({});
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm();

    const [variants, setVariants] = useState([
        {
            price: null,
            stock: null,
            code: null,
            discount: null,
            images: [],
        },
    ]);

    const [variantErrors, setVariantErrors] = useState([]);
    const [isVariantMode, setIsVariantMode] = useState(false);
    const dispatch = useDispatch();
    const [previewImg, setPreviewImg] = useState(null);
    const [imgUpload, setImageUpload] = useState(null);
    const [description, setDescription] = useState("");

    const handleResetForm = () => {
        reset();
        setImageUpload(null);
        setPreviewImg(null);
    };

    const handleOnchangeThumb = async (file) => {
        if (file.type !== "image/png" && file.type !== "image/jpeg") {
            notification.error({ message: "File not supported..." });
            return;
        }
        let base64 = await convertImageToBase64(file);
        setPreviewImg(base64);
        setImageUpload(file);
    };

    const handleFillTableChange = async (index, field, value) => {
        if (field === "images" && value.length > 0) {
            value = await Promise.all(
                value.map((file) => convertImageToBase64(file))
            );
        }

        setVariants((prevVariants) => {
            const updatedVariants = [...prevVariants];
            updatedVariants[index] = {
                ...updatedVariants[index],
                [field]: value,
            };
            return updatedVariants;
        });
    };

    const validateVariants = () => {
        const errors = variants.map((variant) => {
            const variantError = {};
            if (!variant.code) variantError.code = "SKU code is required";
            if (!variant.price) variantError.price = "Price is required";
            if (!variant.stock) variantError.stock = "Stock is required";
            if (!variant.discount)
                variantError.discount = "Discount is required";
            if (variant.images.length === 0)
                variantError.images = "At least one image is required";
            return variantError;
        });
        setVariantErrors(errors);
        return errors.every((error) => Object.keys(error).length === 0);
    };

    const renderProductTableControl = useMemo(
        () => (
            <table
                data-aos="zoom-in"
                className="table-auto rounded p-2 bg-slate-50 mb-1 text-left w-full border-separate  transition-all duration-300 ease-in"
            >
                <thead className="font-bold bg-light text-white text-[13px] text-center border border-blue-300">
                    <tr>
                        {isVariantMode && <th className="px-4 py-2">#</th>}
                        <th className="px-4 py-2">Sku Code</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Stock</th>
                        <th className="px-4 py-2">Discount</th>
                        <th className="px-4 py-2">Images</th>
                    </tr>
                </thead>
                <tbody>
                    {variants?.map((e, index) => (
                        <Tooltip
                            title={
                                e?.images.length > 0 ? (
                                    <div class="flex flex-col">
                                        <div class="font-bold mx-auto ">
                                            {e?.images.length} images
                                        </div>
                                        <div class="flex gap-2  overflow-x-scroll">
                                            {e?.images.map((img) => (
                                                <img
                                                    key={img}
                                                    src={img}
                                                    alt={img}
                                                    class="w-[50%]  object-cover"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <span>No image available</span>
                                )
                            }
                            placement="top"
                        >
                            <tr key={e.id} className="relative">
                                {isVariantMode && (
                                    <td className="px-2 py-1 border border-slate-500 text-center text-lg font-bold">
                                        {index + 1}
                                    </td>
                                )}
                                <td className="px-2 py-1 border border-slate-500 ">
                                    <Input
                                        value={e?.code}
                                        onChange={(e) =>
                                            handleFillTableChange(
                                                index,
                                                "code",
                                                e.target.value
                                            )
                                        }
                                        className={` ${
                                            variantErrors[index]?.code
                                                ? "outline-red-400  placeholder:text-red-500 italic outline-dotted "
                                                : "text-lg font-bold"
                                        } `}
                                        placeholder={
                                            variantErrors[index]?.code
                                                ? "Required ..."
                                                : ""
                                        }
                                    />
                                </td>
                                <td className="px-2 py-1 border border-slate-500 text-lg font-bold">
                                    <Input
                                        value={e?.price}
                                        onChange={(e) =>
                                            handleFillTableChange(
                                                index,
                                                "price",
                                                e.target.value
                                            )
                                        }
                                        type="number"
                                        className={` ${
                                            variantErrors[index]?.price
                                                ? "outline-red-400  placeholder:text-red-500 italic outline-dotted "
                                                : "text-lg font-bold"
                                        } `}
                                        placeholder={
                                            variantErrors[index]?.price
                                                ? "Required ..."
                                                : ""
                                        }
                                    />
                                </td>
                                <td className="px-2 py-1 border border-slate-500 text-lg font-bold">
                                    <Input
                                        value={e?.stock}
                                        onChange={(e) =>
                                            handleFillTableChange(
                                                index,
                                                "stock",
                                                e.target.value
                                            )
                                        }
                                        type="number"
                                        className={` ${
                                            variantErrors[index]?.stock
                                                ? "outline-red-400  placeholder:text-red-500 italic outline-dotted "
                                                : "text-lg font-bold"
                                        } `}
                                        placeholder={
                                            variantErrors[index]?.stock
                                                ? "Required ..."
                                                : ""
                                        }
                                    />
                                </td>
                                <td className="px-2 py-1 border border-slate-500 text-lg font-bold text-center">
                                    <Input
                                        value={e?.discount}
                                        onChange={(e) =>
                                            handleFillTableChange(
                                                index,
                                                "discount",
                                                e.target.value
                                            )
                                        }
                                        type="number"
                                        className={` ${
                                            variantErrors[index]?.discount
                                                ? "outline-red-400  placeholder:text-red-500 italic outline-dotted "
                                                : "text-lg font-bold"
                                        } `}
                                        placeholder={
                                            variantErrors[index]?.discount
                                                ? "Required ..."
                                                : ""
                                        }
                                    />
                                </td>
                                <td className="px-2 py-1 border border-slate-500 text-sm  text-center">
                                    <label
                                        class="px-2 flex gap-2 items-center justify-center"
                                        for={index}
                                    >
                                        {e?.images.length > 0 && (
                                            <span>{e?.images.length}</span>
                                        )}
                                        <Icons.FaFileImage
                                            color={e?.images && "green"}
                                        />
                                        <span>
                                            {e?.images.length > 0
                                                ? "Change"
                                                : "Choose"}
                                        </span>
                                    </label>
                                    <input
                                        id={index}
                                        class="hidden"
                                        onChange={(e) =>
                                            handleFillTableChange(
                                                index,
                                                "images",
                                                Array.from(e.target.files)
                                            )
                                        }
                                        multiple
                                        type="file"
                                    />
                                    {variantErrors[index]?.images && (
                                        <span className="text-red-500 text-sm">
                                            {variantErrors[index].images}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        </Tooltip>
                    ))}
                </tbody>
            </table>
        ),
        [variants, variantErrors]
    );

    const handleFormSubmit = () => {
        if (!validateVariants()) {
            notification.error({ message: "Please fill all required fields" });
            return;
        }
        // Xử lý logic sau khi form hợp lệ
    };

    return (
        <div className="flex flex-col justify-center items-center px-6 py-4 ">
            <div className="flex  justify-between  w-full items-center border-b border-blue-300 ">
                <img
                    src={logo}
                    alt="logo"
                    className="w-20 object-contain"
                    data-aos="fade"
                />
                <div class="text-2xl font-bold" data-aos="fade">
                    {productCurrent ? `Update ` : "Create "} Product
                </div>
                <button
                    className=" rounded px-4 py-2 bg-light text-lg text-white "
                    type="submit"
                    onClick={handleFormSubmit}
                >
                    Submit
                </button>
            </div>

            <form className="flex flex-col w-full gap-2 mt-2">
                <InputForm
                    errors={errors}
                    id={"name"}
                    register={register}
                    fullWidth
                    validate={{
                        required: `Require this field`,
                    }}
                />
                <div className="flex flex-col border justify-between p-6 gap-2">
                    <div className="flex  justify-between">
                        <div>
                            <p className="font-thin italic">
                                You can add variations if this product has
                                options, like size or color.
                            </p>
                            <Radio> Enable Variations </Radio>
                        </div>
                        <div className="font-bold text-lg">
                            Sales Information
                        </div>
                    </div>
                    {renderProductTableControl}
                </div>
                <MarkdownEditor
                    height={500}
                    label={"Description : "}
                    name={"description"}
                    id={"description"}
                    value={description}
                    register={register}
                    validate={{}}
                    errors={errors}
                    setValue={setDescription}
                />
            </form>
        </div>
    );
}

export default UpdateProduct;
