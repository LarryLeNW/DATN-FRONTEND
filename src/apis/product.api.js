import axios from "config/axios";

export const getProducts = (params) =>
    axios({
        url: "/product",
        method: "get",
        params,
    });

export const getProductById = (id) =>
    axios({
        url: `/product/${id}`,
        method: "get",
    });

export const createProduct = (data) =>
    axios({
        url: "/product",
        method: "post",
        data,
    });

export const updateProduct = (id, data) =>
    axios({
        url: "/product/" + id,
        method: "put",
        data,
    });

export const deleteProduct = (id) =>
    axios({
        url: "/product/" + id,
        method: "delete",
    });
