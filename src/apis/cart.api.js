import axios from "config/axios";

export const getCarts = () => {
    return axios({
        url: "/cart",
        method: "get",
    });
};

export const createCart = (data) => {
    return axios({
        url: "/cart",
        method: "post",
        data,
    });
};
