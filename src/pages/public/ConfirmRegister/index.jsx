import { notification } from "antd";
import paths from "constant/paths";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { confirmRegisterRequest } from "store/slicers/auth.slicer";
import { resetMessageData, setMessageData } from "store/slicers/common.slicer";

function ConfirmRegister() {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (token)
            dispatch(
                confirmRegisterRequest({
                    token,
                    onSuccess: () => {
                        notification.success({
                            message:
                                "Chúc mừng bạn đã đăng kí tài khoản thành công...",
                            duration: 2,
                        });
                        dispatch(
                            setMessageData({
                                isShow: true,
                                typeEffect: {
                                    particleCount: 100,
                                    spread: 70,
                                    origin: { y: 0.6 },
                                },
                            })
                        );
                        setTimeout(() => {
                            dispatch(resetMessageData());
                        }, 2000);
                    },
                    onError: () => navigate(paths.LOGIN),
                })
            );
        else navigate(paths.HOME);
    }, []);

    return <div></div>;
}

export default ConfirmRegister;
