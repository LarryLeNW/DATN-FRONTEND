import React, { useState } from "react";

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#fdf2ec] to-[#fcefe8]">
      <div className="bg-white rounded-lg shadow-md p-8 w-96">
        <h2 className="text-center text-[#704214] text-2xl font-bold mb-6">
          ĐỔI MẬT KHẨU
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 text-sm text-gray-700">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-[#fefcfb] text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="oldPassword" className="block mb-2 text-sm text-gray-700">
              Mật khẩu cũ
            </label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md bg-[#fefcfb] text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block mb-2 text-sm text-gray-700">
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md bg-[#fefcfb] text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 text-sm text-gray-700">
              Nhập lại mật khẩu mới
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md bg-[#fefcfb] text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#704214] text-white font-bold rounded-md uppercase transition hover:bg-[#8c6239]">
            Cập nhật
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
