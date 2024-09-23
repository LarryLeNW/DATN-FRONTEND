import React, { useState } from "react";
import LoginIMG from "assets/images/log1.png";
import RegisterIMG from "assets/images/register1.png";
import "./index.css";
import ICONS from "utils/icons";
import { RegisterForm, registerSchema } from "utils/rules";
import { useForm } from "react-hook-form";

const Login: React.FC = () => {
    const [signUpMode, setSignUpMode] = useState(false);

    const authSchema = yup.object({
        username: yup
            .string()
            .required("Vui lòng nhập trường này!")
            .min(2, "Độ dài tối thiểu 2 kí tự"),
        email: yup
            .string()
            .required("Vui lòng nhập email!")
            .email("Email này không hợp lệ"),
        password: yup
            .string()
            .required("Vui lòng nhập trường này !")
            .min(6, "Độ dài tối thiếu 6 kí tự !")
            .max(162, "Độ dài tối đa 162 kí tự"),
        confirm_password: yup
            .string()
            .required("Vui lòng nhập trường này !")
            .min(6, "Độ dài tối thiếu 6 kí tự !")
            .max(162, "Độ dài tối đa 162 kí tự")
            .oneOf(
                [yup.ref("password")],
                "Mật khẩu xác nhận không chính xác !"
            ),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: yupResolver(registerSchema),
    });

    return (
        <div
            className={`wrapper relative w-full h-[100vh] bg-[#fff] overflow-hidden  ${
                signUpMode ? "sign-up-mode" : ""
            }`}
        >
            <div className="forms-wrapper absolute w-full h-full top-0 left-0">
                <div className="signin-signup absolute top-1/2 translate-x-1/2 translate-y-1/2 left-[75%] w-1/2 transition-all duration-1000 ease-[cubic-bezier(0.25, 0.1, 0.25, 1.0)]  grid grid-cols-1 z-5 ">
                    {/* Sign In Form */}
                    <form
                        className={`sign-in-form ${signUpMode ? "hidden" : ""}`}
                    >
                        <h2 className="title">Sign in</h2>
                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input type="text" placeholder="Username" />
                        </div>
                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input type="password" placeholder="Password" />
                        </div>
                        <input
                            type="submit"
                            value="Login"
                            className="btn solid"
                        />
                        <p className="social-text">
                            Or Sign in with social platforms
                        </p>
                        <div className="social-media">
                            <a href="#" className="social-icon">
                                <ICONS.FaFacebook />
                            </a>
                            <a href="#" className="social-icon">
                                <ICONS.FaGoogle />
                            </a>
                        </div>
                    </form>

                    {/* Sign Up Form */}
                    <form
                        className={`sign-up-form ${signUpMode ? "" : "hidden"}`}
                    >
                        <h2 className="title">Sign up</h2>
                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input type="text" placeholder="Username" />
                        </div>
                        <div className="input-field">
                            <i className="fas fa-envelope"></i>
                            <input type="email" placeholder="Email" />
                        </div>
                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input type="password" placeholder="Password" />
                        </div>
                        <input type="submit" value="Sign up" className="btn" />
                        <p className="social-text">
                            Or Sign up with social platforms
                        </p>
                        <div className="social-media">
                            <a href="#" className="social-icon">
                                <ICONS.FaFacebook />
                            </a>
                            <a href="#" className="social-icon">
                                <ICONS.FaGoogle />
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            <div className="panels-wrapper">
                <div className="panel left-panel">
                    <div className="content">
                        <h3>Chưa có tài khoản ?</h3>
                        <p>
                            Đăng ký ngay để bắt đầu hành trình của bạn cùng
                            chúng tôi. Trải nghiệm nhiều tính năng độc đáo và
                            nhận những ưu đãi dành riêng cho thành viên mới!
                        </p>
                        <button
                            className="btn transparent"
                            onClick={() => setSignUpMode(true)}
                        >
                            Sign up
                        </button>
                    </div>
                    <img src={RegisterIMG} className="image" alt="Log" />
                </div>
                <div className="panel right-panel">
                    <div className="content">
                        <h3>Trở thành một phần của chúng tôi!</h3>
                        <p>
                            Đăng nhập ngay để khám phá nhiều cơ hội hơn và tận
                            hưởng trải nghiệm được cá nhân hóa dành riêng cho
                            bạn.
                        </p>
                        <button
                            className="btn transparent"
                            onClick={() => setSignUpMode(false)}
                        >
                            Sign in
                        </button>
                    </div>
                    <img src={LoginIMG} className="image" alt="Register" />
                </div>
            </div>
        </div>
    );
};

export default Login;
