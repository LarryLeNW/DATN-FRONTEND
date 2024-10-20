import axios from "config/axios";

export const getProductBrands = (params) =>
    axios({
        url: "/brands",
        method: "get",
        params,
    });

export const deleteProductBrand = (id) =>
    axios({
        url: `/brands/${id}`,
        method: "delete",
    });

export const createProductBrand = (data) =>
    axios({
        url: "/brands",
        method: "post",
        data,
    });

export const updateProductBrand = (id, data) =>
    axios({
        url: `/brands/${id}`,
        method: "put",
        data,
    });
