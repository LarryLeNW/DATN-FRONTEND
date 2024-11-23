function EditAccount() {
    return (
        <div className="flex flex-col items-center w-3/4 p-8">
            <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">My Profile</h1>

                <form className="space-y-4">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="mt-1 p-2 bg-slate-200 block w-full border-gray-300 "
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="mt-1 p-2 bg-slate-200 block w-full border-gray-300 "
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="mt-1 p-2 bg-slate-200 block w-full border-gray-300 "
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Phone number
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="mt-1 p-2 bg-slate-200 block w-full border-gray-300 "
                        />
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex items-center">
                            <input
                                id="gender_male"
                                type="radio"
                                name="gender"
                                className="focus:ring-[#9C7653] h-4 w-4 text-[#9C7653] border-gray-300"
                            />
                            <label
                                htmlFor="gender_male"
                                className="ml-2 block text-sm text-gray-900"
                            >
                                Male
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="gender_female"
                                type="radio"
                                name="gender"
                                className="focus:ring-[#9C7653] h-4 w-4 text-[#9C7653] border-gray-300"
                            />
                            <label
                                htmlFor="gender_female"
                                className="ml-2 block text-sm text-gray-900"
                            >
                                Female
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="gender_other"
                                type="radio"
                                name="gender"
                                className="focus:ring-[#9C7653] h-4 w-4 text-[#9C7653] border-gray-300"
                            />
                            <label
                                htmlFor="gender_other"
                                className="ml-2 block text-sm text-gray-900"
                            >
                                Other
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="agree"
                            type="checkbox"
                            className="focus:ring-[#9C7653] h-4 w-4 text-[#9C7653] border-gray-300 rounded"
                        />
                        <label
                            htmlFor="agree"
                            className="ml-2 block text-sm text-gray-900"
                        >
                            I agree to Terms & Conditions & Privacy Policy
                        </label>
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#9C7653] hover:bg-[#865c41] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9C7653]"
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
