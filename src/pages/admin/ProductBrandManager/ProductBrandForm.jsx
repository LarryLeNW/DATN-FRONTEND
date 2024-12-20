import { notification } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import logo from "assets/images/logo.jpg";
import InputForm from "components/InputForm";
import { convertBase64ToImage, convertImageToBase64 } from "utils/helper";
import MarkdownEditor from "components/MarkdownEditor";
import { changeLoading } from "store/slicers/common.slicer";
import { useDispatch } from "react-redux";
import { createProductBrand, updateProductBrand } from "apis/productBrand.api";

function ProductBrandForm({ closeModal, fetchData, brandCurrent }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm();

    const dispatch = useDispatch();

    const [previewImg, setPreviewImg] = useState(null);
    const [imgUpload, setImageUpload] = useState(null);
    const [description, setDescription] = useState("");

    useEffect(() => {
        const handleFillToForm = async () => {
            setValue("name", brandCurrent["name"]);
            setDescription(brandCurrent?.description);
            if (brandCurrent?.image) {
                setPreviewImg(brandCurrent?.image);
                let file = await convertBase64ToImage(brandCurrent?.image);
                setImageUpload(file);
            }
        };

        handleResetForm();

        if (brandCurrent?.id) handleFillToForm();
    }, [brandCurrent]);

    const handleResetForm = () => {
        reset();
        setImageUpload(null);
        setPreviewImg(null);
    };

    const handleUpdate = async (data) => {
        if (description) data = { ...data, description };

        if (!imgUpload) {
            notification.error({ message: "Please upload an image" });
            return;
        }

        const formData = new FormData();

        formData.append("image", imgUpload);
        formData.append("brandData", JSON.stringify(data));

        try {
            dispatch(changeLoading());
            if (brandCurrent?.id) {
                await updateProductBrand(brandCurrent.id, formData);
                notification.success({
                    message: "Cập nhật thành công",
                });
            } else {
                await createProductBrand(formData);
                notification.success({
                    message: "Tạo thành công",
                });
            }
            await fetchData();
            closeModal();
            handleResetForm();
        } catch (error) {
            const errorMessage = brandCurrent?.id
                ? "Cập nhật không thành công ..."
                : "Tạo không thành công...";
            notification.error({
                message: `${errorMessage}: ${error.message}`,
            });
        } finally {
            dispatch(changeLoading());
        }
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

    return (
        <div className="flex flex-col justify-center items-center  ">
            <div className="flex flex-col justify-center  w-full items-center ">
                <img src={logo} alt="logo" className="w-20 object-contain" />
                <h2 className="text-center border border-y-main w-full bg-light text-white">
                    {brandCurrent ? `Edit Brand` : "Create Brand"}
                </h2>
            </div>

            <form
                onSubmit={handleSubmit(handleUpdate)}
                className="flex flex-col w-full gap-2 mt-2"
            >
                <div className="flex items-center gap-8 justify-center">
                    <span className="font-bold">Thumb nail </span>
                    <label
                        className="h-[160px] w-[160px] border-2 border-main p-2 flex justify-center items-center"
                        htmlFor="thumbnail"
                    >
                        {previewImg ? (
                            <img
                                src={previewImg}
                                alt=""
                                className="object-contain w-full h-full"
                            />
                        ) : (
                            <h1 className="font-bold text-blue-600 ">
                                Chọn hình ảnh
                            </h1>
                        )}
                    </label>
                </div>
                <input
                    type="file"
                    id="thumbnail"
                    accept=".jpg, .jpeg, .png"
                    onChange={(e) => handleOnchangeThumb(e.target.files[0])}
                    className="hidden"
                />
                <InputForm
                    errors={errors}
                    id={"name"}
                    register={register}
                    fullWidth
                    validate={{
                        required: `Require this field`,
                    }}
                />
                <MarkdownEditor
                    height={200}
                    label={"Description : "}
                    name={"description"}
                    id={"description"}
                    value={description}
                    register={register}
                    validate={{}}
                    errors={errors}
                    setValue={setDescription}
                />
                <button
                    className="w-full p-2 bg-light text-lg text-white "
                    type="submit"
                >
                    {brandCurrent ? `Update` : "Create"}
                </button>
            </form>
        </div>
    );
}

export default ProductBrandForm;
