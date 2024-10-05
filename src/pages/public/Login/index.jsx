import LoginIMG from "assets/images/log1.png";
import RegisterIMG from "assets/images/register1.png";
import paths from "constant/paths";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import ICONS from "utils/icons";

const Login = () => {
    const [signUpMode, setSignUpMode] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = (data) => {
        if (signUpMode) {
            console.log("Register data:", data);
        } else {
            console.log("Login data:", data);
        }
        reset();
    };

    return (
        <div className="flex min-h-screen justify-center items-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <div className="signin-signup">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <h2 className="text-2xl font-semibold text-center">
                            {signUpMode ? "Sign up" : "Sign In"}
                        </h2>

                        {signUpMode && (
                            <div className="relative">
                                <i className="fas fa-user absolute left-3 top-3 text-gray-500"></i>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    {...register("username")}
                                    className="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:border-indigo-500"
                                />
                                {errors.username && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.username?.message}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="relative">
                            <i className="fas fa-envelope absolute left-3 top-3 text-gray-500"></i>
                            <input
                                type="email"
                                placeholder="Email"
                                {...register("email")}
                                className="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:border-indigo-500"
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <i className="fas fa-lock absolute left-3 top-3 text-gray-500"></i>
                            <input
                                type="password"
                                placeholder="Password"
                                {...register("password")}
                                className="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:border-indigo-500"
                            />
                            {errors.password && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {signUpMode && (
                            <div className="relative">
                                <i className="fas fa-lock absolute left-3 top-3 text-gray-500"></i>
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    {...register("confirm_password")}
                                    className="w-full py-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:border-indigo-500"
                                />
                                {errors.confirm_password && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.confirm_password?.message}
                                    </p>
                                )}
                            </div>
                        )}

                        <input
                            type="submit"
                            value={signUpMode ? "Sign up" : "Sign In"}
                            className="w-full py-2 mt-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none cursor-pointer"
                        />

                        <p className="text-center text-gray-500 mt-4">
                            {signUpMode
                                ? "Or Sign up with social platforms"
                                : "Or Sign in with social platforms"}
                        </p>

                        <div className="flex justify-center space-x-4 mt-4">
                            <a href="#" className="text-blue-600">
                                <ICONS.FaFacebook size={24} />
                            </a>
                            <a href="#" className="text-red-500">
                                <ICONS.FaGoogle size={24} />
                            </a> <br />

                        </div>
                        <div>
                            <Link to={paths.HOME}>
                            <button class="flex items-center bg-red-200 hover:bg-red-600 text-white py-1 px-4 rounded">
                                <ICONS.FaArrowLeft size={18} class="mr-2" />
                                Trang chủ
                            </button>
                            </Link>
                        </div>

                    </form>
                </div>
            </div>

            <div className="hidden m-5 lg:flex w-1/2 items-center justify-center p-8 bg-gray-200">
                <div className="text-center">
                    <h3 className="text-lg font-semibold">
                        {signUpMode
                            ? "Already have an account?"
                            : "Don't have an account?"}
                    </h3>
                    <p className="text-gray-400 mt-2">
                        {signUpMode
                            ? "Sign in to explore more features."
                            : "Sign up now to start your journey with us!"}
                    </p>
                    <button
                        className="mt-4 px-4 py-2 bg-transparent border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition"
                        onClick={() => setSignUpMode(!signUpMode)}
                    >
                        {signUpMode ? "Sign In" : "Sign Up"}
                    </button>
                </div>
                <img
                    src={signUpMode ? RegisterIMG : LoginIMG}
                    className="w-64 mt-4"
                    alt={signUpMode ? "Register" : "Login"}
                />
            </div>
        </div>
    );
};

export default Login;
