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

export const deleteCart = (data) => {
    return axios({
        url: "/cart/" + data,
        method: "delete",
    });
};

export const updateCart = (data) => {
    return axios({
        url: "/cart",
        method: "put",
        data,
    });
};
