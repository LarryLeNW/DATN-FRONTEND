import axios from "config/axios";

export const login = (data) => {
    return axios({
        url: "/auth/token",
        method: "post",
        data,
    });
};
