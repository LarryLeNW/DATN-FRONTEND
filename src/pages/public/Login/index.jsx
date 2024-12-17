import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import LoginIMG from "assets/images/log1.png";
import RegisterIMG from "assets/images/register1.png";
import paths from "constant/paths";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import ICONS from "utils/icons";
import { jwtDecode } from "jwt-decode";
import FacebookLogin from "react-facebook-login";
import withBaseComponent from "hocs";
import { loginRequest, registerRequest } from "store/slicers/auth.slicer";
import { useSelector } from "react-redux";
import { notification } from "antd";
import TypingText from "components/TypingText";
import Icons from "utils/icons";
import { resetMessageData, setMessageData } from "store/slicers/common.slicer";

const Login = ({ dispatch, navigate }) => {
    const [signUpMode, setSignUpMode] = useState(false);
    const { error, loading } = useSelector((state) => state.auth.authInfo);
    const { messageSystem } = useSelector((state) => state.common);
    useEffect(() => {
        dispatch(resetMessageData());
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();
    const password = watch("password");

    const onSubmit = (data) => {
        if (signUpMode) {
            dispatch(
                registerRequest({
                    data,
                    onSuccess: (message) => {
                        dispatch(
                            setMessageData({
                                isShow: true,
                                message,
                            })
                        );
                    },
                    onError: (message) => {
                        notification.warning({
                            message,
                            duration: 3,
                        });
                    },
                })
            );
        } else {
            handleLogin(data);
        }
    };

    const handleLogin = (dataLogin) => {
        dispatch(
            loginRequest({
                dataLogin,
                onSuccess: () => {
                    notification.success({
                        message: "Chào mừng quay trở lại.",
                        duration: 2,
                    });
                    navigate("/");
                },
                onError: () => {
                    notification.warning({
                        message: "Tài khoản hoặc mật khẩu sai...",
                        duration: 3,
                    });
                },
            })
        );
    };

    const responseFacebook = (response) => {
        console.log(response);
    };

    return (
        <GoogleOAuthProvider clientId="1092538276024-m6skkb7i3lhdmilk6mssvnjs0r5egolm.apps.googleusercontent.com">
            <div className="flex min-h-screen justify-center items-center bg-light">
                {messageSystem.isShow ? (
                    <div
                        key={signUpMode}
                        className="w-1/2 bg-white flex justify-center items-center rounded py-4 px-8"
                        data-aos={"zoom-out-down"}
                    >
                        <h1 className="w-full flex flex-col gap-2 ">
                            <Link to={paths.HOME}>
                                <button className="flex items-center text-red-500 hover:bg-opacity-90 py-1 rounded my-2">
                                    <ICONS.FaArrowLeft
                                        size={14}
                                        className="mr-2"
                                    />
                                    Trang chủ
                                </button>
                            </Link>
                            <div className="flex justify-between">
                                <div className="font-bold text-blue-600 text-lg">
                                    Cảm ơn bạn đã tham gia dịch vụ!
                                </div>
                                <span
                                    className="cursor-pointer text-primary font-bold"
                                    onClick={() => dispatch(resetMessageData())}
                                >
                                    Đăng kí với mail khác
                                </span>
                            </div>
                            {messageSystem.message && (
                                <TypingText
                                    text={messageSystem.message}
                                    typeSpeed={10}
                                />
                            )}
                        </h1>
                    </div>
                ) : (
                    <div
                        key={signUpMode}
                        className="bg-white flex justify-center items-center rounded py-4 px-8"
                        data-aos={signUpMode ? "flip-right" : "flip-left"}
                    >
                        <div className="w-full">
                            <Link to={paths.HOME}>
                                <button className="flex items-center text-red-500 hover:bg-opacity-90 py-1 rounded my-2">
                                    <ICONS.FaArrowLeft
                                        size={14}
                                        className="mr-2"
                                    />
                                    Trang chủ
                                </button>
                            </Link>
                            <div
                                className={`signin-signup max-w-md shadow-sm rounded-lg p-8 ${
                                    signUpMode
                                        ? "shadow-orange-600"
                                        : "shadow-blue-600"
                                }`}
                            >
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="space-y-4"
                                >
                                    <h2
                                        className={`text-2xl font-semibold text-center ${
                                            signUpMode
                                                ? "text-orange-600"
                                                : "text-indigo-600"
                                        }`}
                                    >
                                        {signUpMode ? "Sign up" : "Sign In"}
                                    </h2>

                                    <div className="relative">
                                        <i className="fas fa-envelope absolute left-3 top-3 text-gray-500"></i>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /\S+@\S+\.\S+/,
                                                    message:
                                                        "Invalid email format",
                                                },
                                            })}
                                            className="w-full py-2 px-2 border rounded-lg focus:outline-none focus:border-indigo-500"
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
                                            {...register("password", {
                                                required:
                                                    "Password is required",
                                                minLength: {
                                                    value: 6,
                                                    message:
                                                        "Password must be at least 6 characters",
                                                },
                                            })}
                                            className="w-full py-2 px-2 border rounded-lg focus:outline-none focus:border-indigo-500"
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
                                                {...register(
                                                    "confirm_password",
                                                    {
                                                        validate: (value) =>
                                                            value ===
                                                                password ||
                                                            "Passwords do not match",
                                                    }
                                                )}
                                                className="w-full p-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                                            />
                                            {errors.confirm_password && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    {
                                                        errors.confirm_password
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div
                                        className={`w-full py-2 mt-4 ${
                                            signUpMode
                                                ? "bg-orange-600 hover:bg-orange-500"
                                                : "bg-indigo-600 hover:bg-indigo-500"
                                        } text-white rounded-lg focus:outline-none cursor-pointer flex  gap-2 items-center `}
                                    >
                                        <input
                                            className="w-full h-full flex relative"
                                            type="submit"
                                            value={
                                                loading
                                                    ? "Loading..."
                                                    : signUpMode
                                                    ? "Sign up"
                                                    : "Sign In"
                                            }
                                            disabled={loading}
                                        />
                                    </div>

                                    <p className="text-center text-gray-500 mt-4">
                                        {signUpMode
                                            ? "Or Sign up with social platforms"
                                            : "Or Sign in with social platforms"}
                                    </p>

                                    <div className="flex justify-center space-x-4 mt-4 items-center">
                                        <FacebookLogin
                                            textButton={
                                                <div className="text-[12px] font-sans">
                                                    Đăng nhập bằng Facebook
                                                </div>
                                            }
                                            cssClass="flex gap-2 rounded border p-2 items-center text-sm text-nowrap text-black flex-1 h-[40px] text-sm"
                                            appId="2041983982905103"
                                            autoLoad={false}
                                            fields="name,email,picture"
                                            callback={responseFacebook}
                                            icon={
                                                <ICONS.FaFacebook
                                                    size={24}
                                                    color={"blue"}
                                                />
                                            }
                                        />
                                        <GoogleLogin
                                            text="Login With Google"
                                            onSuccess={(credentialResponse) => {
                                                console.log(
                                                    jwtDecode(
                                                        credentialResponse.credential
                                                    )
                                                );
                                            }}
                                            onError={() => {
                                                console.log("Login Failed");
                                            }}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div
                            className="flex flex-col w-1/2 items-center justify-center p-4"
                            data-aos="zoom-in"
                        >
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-neutral-500">
                                    {signUpMode
                                        ? "Already have an account?"
                                        : "Don't have an account?"}
                                </h3>
                                <div
                                    className={`font-bold cursor-pointer rounded mt-4 px-2 py-1 border transition-all ${
                                        signUpMode
                                            ? "text-indigo-600 hover:text-indigo-500"
                                            : "text-orange-600 hover:text-orange-500"
                                    }`}
                                    onClick={() => setSignUpMode(!signUpMode)}
                                >
                                    {signUpMode
                                        ? "Sign In Now."
                                        : "Sign Up Now."}
                                </div>
                            </div>
                            <img
                                src={signUpMode ? RegisterIMG : LoginIMG}
                                className="w-64 mt-4"
                                alt={signUpMode ? "Register" : "Login"}
                            />
                        </div>
                    </div>
                )}
            </div>
        </GoogleOAuthProvider>
    );
};

export default withBaseComponent(Login);
