import axios from "config/axios";

export const login = (data) => {
    return axios({
        url: "/auth/login",
        method: "post",
        data,
    });
};

export const register = (data) => {
    return axios({
        url: "/auth/register",
        method: "post",
        data,
    });
};

export const confirmRegister = (token) => {
    return axios({
        url: "/auth/" + token,
        method: "get",
    });
};

export const getUserInfo = (data) => {
    return axios({
        url: "/auth/me",
        method: "get",
        data,
    });
};
