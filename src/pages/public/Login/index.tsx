import React, { useState } from "react";
import LoginIMG from "assets/images/log1.png";
import RegisterIMG from "assets/images/register1.png";
import "./index.css";
import ICONS from "utils/icons";
import { FieldErrors, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, registerSchema } from "utils/rules";

interface CombinedForm {
    email: string;
    password: string;
    username?: string;
    confirm_password?: string;
}

const Login: React.FC = () => {
    const [signUpMode, setSignUpMode] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CombinedForm>({
        resolver: yupResolver(signUpMode ? registerSchema : loginSchema),
        mode: "onChange",
    });

    const onSubmit = (data: CombinedForm) => {
        if (signUpMode) {
            console.log("Register data:", data);
        } else {
            console.log("Login data:", data);
        }
        reset();
    };

    return (
        <div className="flex">
            <div className="forms-wrapper">
                <div className="signin-signup">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h2 className="title">
                            {signUpMode ? "Sign up" : "Sign In"}
                        </h2>

                        {signUpMode && (
                            <div className="input-field">
                                <i className="fas fa-user"></i>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    {...register("username")}
                                />
                            </div>
                        )}
                        {signUpMode && errors.username && (
                            <p className="text-red-600">
                                {errors.username?.message}
                            </p>
                        )}

                        <div className="input-field">
                            <i className="fas fa-envelope"></i>
                            <input
                                type="email"
                                placeholder="Email"
                                {...register("email")}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-600">
                                {errors.email.message}
                            </p>
                        )}

                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input
                                type="password"
                                placeholder="Password"
                                {...register("password")}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-600">
                                {errors.password.message}
                            </p>
                        )}

                        {signUpMode && (
                            <div className="input-field">
                                <i className="fas fa-lock"></i>
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    {...register("confirm_password")}
                                />
                            </div>
                        )}
                        {signUpMode && errors.confirm_password && (
                            <p className="text-red-600">
                                {errors.confirm_password?.message}
                            </p>
                        )}

                        <input
                            type="submit"
                            value={signUpMode ? "Sign up" : "Sign In"}
                            className="btn"
                        />

                        <p className="social-text">
                            {signUpMode
                                ? "Or Sign up with social platforms"
                                : "Or Sign in with social platforms"}
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
                        <h3>
                            {signUpMode
                                ? "Already have an account?"
                                : "Don't have an account?"}
                        </h3>
                        <p>
                            {signUpMode
                                ? "Sign in to explore more features."
                                : "Sign up now to start your journey with us!"}
                        </p>
                        <button
                            className="btn transparent"
                            onClick={() => setSignUpMode(!signUpMode)}
                        >
                            {signUpMode ? "Sign In" : "Sign Up"}
                        </button>
                    </div>
                    <img
                        src={signUpMode ? RegisterIMG : LoginIMG}
                        className="image"
                        alt={signUpMode ? "Register" : "Login"}
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
