import React, { useState } from "react";

const Profile = () => {
    const [profilePic, setProfilePic] = useState("https://via.placeholder.com/150");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfilePic(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-[#F5E3DC] to-[#E6D4C3]">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 p-8 bg-[#D9C5B2] space-y-8 shadow-xl">
                <div className="text-center">
                    {/* Circular image frame */}
                    <label htmlFor="profile-pic" className="cursor-pointer">
                        <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#9C7653] transition-transform transform hover:scale-105">
                            <img
                                src={profilePic}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </label>
                    <input
                        type="file"
                        id="profile-pic"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <h2 className="text-2xl font-bold text-[#8B5E34]">Username</h2>
                </div>

                <nav>
                    <ul className="space-y-4">
                        {['Tài khoản của tôi', 'Đơn mua', 'Tin nhắn', 'Địa chỉ nhận hàng', 'Đổi mật khẩu', 'Thoát'].map((item, index) => (
                            <li key={index}>
                                <a href="" className="text-black-600 hover:text-blue-800">{item}</a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Profile Form */}
            <div className="flex flex-col items-center w-full md:w-3/4 p-8 md:p-16">
                <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-2xl border border-[#D1BFAF]">
                    <h1 className="text-4xl font-bold text-center text-[#8B5E34] mb-8">My Profile</h1>
                    <form className="space-y-6">
                        {[
                            { id: "username", label: "Username", type: "text" },
                            { id: "name", label: "Name", type: "text" },
                            { id: "email", label: "Email", type: "email" },
                            { id: "phone", label: "Phone Number", type: "text" }
                        ].map((input) => (
                            <div key={input.id}>
                                <label htmlFor={input.id} className="block text-sm font-medium text-gray-800">
                                    {input.label}
                                </label>
                                <input
                                    type={input.type}
                                    id={input.id}
                                    className="mt-2 p-3 bg-[#F9F5F2] block w-full border border-gray-300 rounded-lg focus:border-[#9C7653] focus:ring-[#9C7653] transition-all duration-200"
                                    placeholder={`Enter your ${input.label.toLowerCase()}`}
                                />
                            </div>
                        ))}

                        {/* Gender Selection */}
                        <div className="flex flex-wrap gap-6 mt-4">
                            {["Male", "Female", "Other"].map((gender) => (
                                <div className="flex items-center" key={gender}>
                                    <input
                                        id={`gender_${gender.toLowerCase()}`}
                                        type="radio"
                                        name="gender"
                                        className="h-4 w-4 text-[#9C7653] border-gray-300 focus:ring-[#9C7653]"
                                    />
                                    <label htmlFor={`gender_${gender.toLowerCase()}`} className="ml-2 block text-sm text-gray-800">
                                        {gender}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Terms Agreement */}
                        <div className="flex items-start mt-6">
                            <input
                                id="agree"
                                type="checkbox"
                                className="h-4 w-4 text-[#9C7653] border-gray-300 rounded focus:ring-[#9C7653]"
                            />
                            <label htmlFor="agree" className="ml-2 block text-sm text-gray-800">
                                I agree to the Terms & Conditions and Privacy Policy
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8">
                            <button
                                type="submit"
                                className="w-full py-3 px-5 text-sm font-semibold text-white bg-[#9C7653] rounded-lg shadow-lg hover:bg-[#865c41] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#9C7653] focus:ring-offset-2"
                            >
                                SAVE
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
