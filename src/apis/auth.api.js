import axios from "config/axios";

export const login = (data) => {
    return axios({
        url: "/auth/login",
        method: "post",
        data,
    });
};

export const getUserInfo = (data) => {
    return axios({
        url: "/auth/me",
        method: "get",
        data,
    });
};
