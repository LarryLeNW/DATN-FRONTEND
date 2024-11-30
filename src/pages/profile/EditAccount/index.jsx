import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "antd";
import { convertImageToBase64 } from "utils/helper";
import { updateInfoUser, updateUser } from "apis/user.api";
import { getUserInfoRequest } from "store/slicers/auth.slicer";

function EditAccount() {
    const userInfo = useSelector((state) => state.auth.userInfo.data);
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(userInfo?.avatar);
    const [avatarFile, setAvatarFile] = useState(null);
    const [formData, setFormData] = useState({
        username: userInfo?.username,
        email: userInfo?.email,
        phone_number: userInfo?.phone_number,
        avatar: userInfo?.avatar,
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const toggleEdit = () => {
        setIsEditing((prev) => !prev);
    };
    const handleAvatarChange = async (file) => {
        if (file.type !== "image/png" && file.type !== "image/jpeg") {
            notification.error({ message: "File not supported..." });
            return;
        }
        let base64 = await convertImageToBase64(file);
        setAvatarPreview(base64);
        setAvatarFile(file);
    };

    const handleEditAccount = async () => {
        const updatedData = new FormData();
    
        Object.keys(formData).forEach((key) => {
            if (formData[key]) {
                updatedData.append(key, formData[key]);
            }
        });
    
        updatedData.append("avatar", avatarFile);
        updatedData.append("userData", JSON.stringify(formData));
    
        try {
            const res = await updateInfoUser(userInfo.id, updatedData);
            notification.success({ message: "Cập nhật thành công!" });
            dispatch(getUserInfoRequest());
            setIsEditing(false);
        } catch (error) {
            notification.error({ message: "Cập nhật thất bại!" });
        }
    };

return (
    <div className="flex flex-col items-center p-8">
        <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-2xl border border-[#D1BFAF]">
            <h1 className="text-4xl font-bold text-center text-[#8B5E34] mb-8">My Profile</h1>
            <form className="space-y-6">
                {/* Avatar Input */}
                <div className="flex flex-col items-center mb-6">
                    <label
                        htmlFor="avatar"
                        className="cursor-pointer w-32 h-32 rounded-full border-2 border-[#9C7653] shadow-md overflow-hidden flex justify-center items-center"
                    >
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt=""
                                className="w-full h-full object-cover"
                            />
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
                    <label htmlFor="username" className="block text-sm font-medium text-gray-800">
                        Họ và tên:
                    </label>
                    <input
                        type="username"
                        id="username"
                        onChange={handleChange}
                        className="mt-2 p-3 bg-[#F9F5F2] block w-full border border-gray-300 rounded-lg focus:border-[#9C7653] focus:ring-[#9C7653] transition-all duration-200"
                        value={formData?.username}
                        disabled={!isEditing}
                    />
                </div>

                {/* Email Input */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        onChange={handleChange}
                        className="mt-2 p-3 bg-[#F9F5F2] block w-full border border-gray-300 rounded-lg focus:border-[#9C7653] focus:ring-[#9C7653] transition-all duration-200"
                        value={formData?.email}
                        disabled={!isEditing}
                    />
                </div>
                {/* Email Input */}
                <div>
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-800">
                        Số điện thoại:
                    </label>
                    <input
                        type="phone_number"
                        id="phone_number"
                        onChange={handleChange}
                        className="mt-2 p-3 bg-[#F9F5F2] block w-full border border-gray-300 rounded-lg focus:border-[#9C7653] focus:ring-[#9C7653] transition-all duration-200"
                        value={formData?.phone_number}
                        disabled={!isEditing}
                    />
                </div>

                <div className="flex justify-between mt-8">
                    <button
                        type="button"
                        onClick={toggleEdit}
                        className="py-3 px-5 text-sm font-semibold text-white bg-[#9C7653] rounded-lg shadow-lg hover:bg-[#865c41] transition-colors duration-200"
                    >
                        {isEditing ? "Thoát" : "Chỉnh sửa thông tin"}
                    </button>

                    {isEditing && (
                        <button
                            type="button"
                            className="py-3 px-5 text-sm font-semibold text-white bg-[#9C7653] rounded-lg shadow-lg hover:bg-[#865c41] transition-colors duration-200"
                            onClick={handleEditAccount}
                        >
                            Lưu
                        </button>
                    )}
                </div>
            </form>
        </div>
    </div>
);
}

export default EditAccount;
