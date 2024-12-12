import InputForm from "components/InputForm";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

function PackageForm({ packageCurrent, handleUpdate }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm();

    useEffect(() => {
        const handleFillToForm = async () => {
            setValue("name", packageCurrent["name"]);
            setValue("durationDays", packageCurrent["durationDays"]);
            setValue("price", packageCurrent["price"]);
            setValue(
                "discountPercentage",
                packageCurrent["discountPercentage"]
            );
        };

        if (packageCurrent) handleFillToForm();
    }, [packageCurrent]);

    return (
        <div>
            <h1
                className={`font-bold text-lg ${
                    packageCurrent ? "text-purple-700" : "text-green-700"
                }`}
            >
                {packageCurrent ? "Sửa gói thuê" : "Thêm gói thuê"}
            </h1>
            <form
                className="flex flex-col gap-4 mt-4"
                onSubmit={handleSubmit(handleUpdate)}
            >
                <InputForm
                    errors={errors}
                    id={"name"}
                    placeholder={"Nhập tên gói..."}
                    register={register}
                    fullWidth
                    validate={{
                        required: "Yêu cầu điền tên gói...",
                    }}
                />
                <div className="flex gap-4 items-center font-bold">
                    <InputForm
                        label={"Thời hạn"}
                        errors={errors}
                        id={"durationDays"}
                        type="number"
                        register={register}
                        placeholder={"ngày"}
                        fullWidth
                        validate={{
                            required: "Yêu cầu điền thời gian...",
                        }}
                    />
                    <InputForm
                        label={"Giảm giá"}
                        errors={errors}
                        id={"price"}
                        type="number"
                        register={register}
                        placeholder={"%"}
                        fullWidth
                        validate={{
                            required: "Yêu cầu điền giá...",
                        }}
                    />
                    <InputForm
                        errors={errors}
                        id={"discountPercentage"}
                        type="number"
                        label={"Phần trăm gốc"}
                        register={register}
                        placeholder={"%"}
                        fullWidth
                        validate={{
                            required: "Yêu cầu điền phần trăm...",
                            max: {
                                value: 20,
                                message: "Phần trăm phải nhỏ hơn 20%",
                            },
                            min: {
                                value: 0,
                                message: "Phần trăm không thể âm",
                            },
                        }}
                    />
                </div>
                <button
                    className={`w-full p-2 text-lg text-white ${
                        packageCurrent ? "bg-purple-700" : "bg-green-700"
                    }`}
                    type="submit"
                >
                    {packageCurrent ? `Cập nhật` : "Tạo"}
                </button>
            </form>
        </div>
    );
}

export default PackageForm;
