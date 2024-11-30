function EditAccount() {
    return (
        <div className="flex flex-col items-center  p-8">
            <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-2xl border border-[#D1BFAF]">
                <h1 className="text-4xl font-bold text-center text-[#8B5E34] mb-8">My Profile</h1>
                <form className="space-y-6">
                    {/* Username Input */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-800">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="mt-2 p-3 bg-[#F9F5F2] block w-full border border-gray-300 rounded-lg focus:border-[#9C7653] focus:ring-[#9C7653] transition-all duration-200"
                            placeholder="Enter your username"
                        />
                    </div>

                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-800">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="mt-2 p-3 bg-[#F9F5F2] block w-full border border-gray-300 rounded-lg focus:border-[#9C7653] focus:ring-[#9C7653] transition-all duration-200"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-2 p-3 bg-[#F9F5F2] block w-full border border-gray-300 rounded-lg focus:border-[#9C7653] focus:ring-[#9C7653] transition-all duration-200"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Phone Number Input */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-800">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            id="phone"
                            className="mt-2 p-3 bg-[#F9F5F2] block w-full border border-gray-300 rounded-lg focus:border-[#9C7653] focus:ring-[#9C7653] transition-all duration-200"
                            placeholder="Enter your phone number"
                        />
                    </div>

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
    );
}

export default EditAccount;
