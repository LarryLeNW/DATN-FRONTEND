import axios from "config/axios";

export const getProducts = (params) =>
    axios({
        url: "/product",
        method: "get",
        params,
    });

export const createProduct = (data) =>
    axios({
        url: "/product",
        method: "post",
        data,
    });
