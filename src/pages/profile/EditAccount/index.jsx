import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "antd";
import { convertImageToBase64 } from "utils/helper";
import { updateInfoUser } from "apis/user.api";
import { getUserInfoRequest } from "store/slicers/auth.slicer";
import { useForm } from "react-hook-form";
import { changeLoading } from "store/slicers/common.slicer";

function EditAccount() {
    const userInfo = useSelector((state) => state.auth.userInfo.data);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm();

    const [isEditing, setIsEditing] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(userInfo?.avatar);
    const [avatarFile, setAvatarFile] = useState(null);

    useEffect(() => {
        if (userInfo) {
            setValue("username", userInfo.username);
            setValue("email", userInfo.email);
            setValue("phone_number", userInfo.phone_number);
        }
    }, [userInfo, setValue]);

    const toggleEdit = () => setIsEditing((prev) => !prev);

    const handleAvatarChange = async (file) => {
        if (file.type !== "image/png" && file.type !== "image/jpeg") {
            notification.error({ message: "File không được hỗ trợ." });
            return;
        }
        const base64 = await convertImageToBase64(file);
        setAvatarPreview(base64);
        setAvatarFile(file);
    };

    const onSubmit = async (data) => {
        dispatch(changeLoading())
        const updatedData = new FormData();
        Object.keys(data).forEach((key) => {
            if (data[key]) updatedData.append(key, data[key]);
        });
        if (avatarFile) updatedData.append("avatar", avatarFile);
        updatedData.append("userData", JSON.stringify(data));
        
        try {
            await updateInfoUser(userInfo.id, updatedData);
            notification.success({ message: "Cập nhật thành công!" });
            dispatch(getUserInfoRequest());
            setIsEditing(false);
        } catch (error) {
            notification.error({ message: "Cập nhật thất bại!" });
        }
        dispatch(changeLoading())

    };

    return (
        <div className="flex flex-col items-center p-8">
            <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-2xl border border-[#D1BFAF]">
                <h1 className="text-4xl font-bold text-center text-[#8B5E34] mb-8">My Profile</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Avatar Input */}
                    <div className="flex flex-col items-center mb-6">
                        <label htmlFor="avatar" className="cursor-pointer w-32 h-32 rounded-full border-2 border-[#9C7653] shadow-md overflow-hidden flex justify-center items-center">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-500">Chọn ảnh</span>
                            )}
                        </label>
                        {isEditing && (
                            <input
                                type="file"
                                id="avatar"
                                accept=".jpg, .jpeg, .png"
                                onChange={(e) => handleAvatarChange(e.target.files[0])}
                                className="hidden"
                            />
                        )}
                    </div>

                    {/* Username Input */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-800">Họ và tên:</label>
                        <input
                            id="username"
                            className="mt-2 p-3 bg-[#F9F5F2] block w-full border rounded-lg focus:border-[#9C7653] focus:ring-[#9C7653]"
                            disabled={!isEditing}
                            {...register("username", {
                                required: "Vui lòng nhập tên",
                                minLength: { value: 6, message: "Tên ít nhất 6 ký tự" },
                            })}
                        />
                        {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-800">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="mt-2 p-3 bg-[#F9F5F2] block w-full border rounded-lg focus:border-[#9C7653]"
                            disabled={!isEditing}
                            {...register("email", { required: "Vui lòng nhập email" })}
                        />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    </div>

                    {/* Phone Input */}
                    <div>
                        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-800">Số điện thoại:</label>
                        <input
                            type="tel"
                            id="phone_number"
                            className="mt-2 p-3 bg-[#F9F5F2] block w-full border rounded-lg focus:border-[#9C7653]"
                            disabled={!isEditing}
                            {...register("phone_number")}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between mt-8">
                        <button type="button" onClick={toggleEdit} className="py-3 px-5 bg-[#9C7653] text-white rounded-lg">
                            {isEditing ? "Thoát" : "Chỉnh sửa thông tin"}
                        </button>
                        {isEditing && (
                            <button type="submit" className="py-3 px-5 bg-[#9C7653] text-white rounded-lg">Lưu</button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditAccount;
