import { notification } from "antd";
import { updateChangePassword } from "apis/user.api";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import Icons from "utils/icons";

const ChangePasswordForm = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const userInfo = useSelector((state) => state.auth.userInfo.data);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    dispatch(changeLoading());
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      notification.error({ message: "Mật khẩu xác nhận không khớp!" });
      return;
    }

    if (newPassword.length < 6) {
      notification.error({ message: "Mật khẩu mới phải có ít nhất 6 ký tự." });
      return;
    }

    try {
      const res = await updateChangePassword({
        email: userInfo.email,
        oldPassword,
        newPassword,
      });
      notification.success({ message: "Cập nhật mật khẩu thành công!" });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      notification.error({ message: error.response?.data?.message || "Lỗi cập nhật mật khẩu" });
    }
    dispatch(changeLoading());

  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white rounded-lg shadow-md p-8 w-96">
        <h2 className="text-center text-[#704214] text-2xl font-bold mb-6">
          ĐỔI MẬT KHẨU
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Mật khẩu cũ */}
          <PasswordInput
            label="Mật khẩu cũ"
            value={oldPassword}
            onChange={setOldPassword}
            showPassword={showOldPassword}
            setShowPassword={setShowOldPassword}
          />
          {/* Mật khẩu mới */}
          <PasswordInput
            label="Mật khẩu mới"
            value={newPassword}
            onChange={setNewPassword}
            showPassword={showNewPassword}
            setShowPassword={setShowNewPassword}
          />
          {/* Xác nhận mật khẩu */}
          <PasswordInput
            label="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={setConfirmPassword}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
          />
          <button
            type="submit"
            className="w-full py-3 bg-[#704214] text-white font-bold rounded-md uppercase transition hover:bg-[#8c6239]"
          >
            Cập nhật
          </button>
        </form>
      </div>
    </div>
  );
};

const PasswordInput = ({ label, value, onChange, showPassword, setShowPassword }) => (
  <div className="mb-4 relative">
    <label className="block mb-2 text-sm text-gray-700">{label}</label>
    <input
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="w-full p-2 border border-gray-300 rounded-md bg-[#fefcfb] text-sm"
    />
    <button
      type="button"
      className="absolute right-3 top-1/2 transform -translate-y-1/2"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? (
        <Icons.FaRegEye className="h-5 w-5 mt-5 text-gray-600" />
      ) : (
        <Icons.FaRegEyeSlash className="h-5 mt-5 text-gray-600" />
      )}
    </button>
  </div>
);

export default ChangePasswordForm;
