import axios from "config/axios";

export const getProductCate = (params) =>
    axios({
        url: "/categories",
        method: "get",
        params,
    });

export const deleteProductCate = (id) =>
    axios({
        url: `/categories/${id}`,
        method: "delete",
    });

export const createCategory = (data) =>
    axios({
        url: "/categories",
        method: "post",
        data,
    });

export const updateCategory = (id, data) =>
    axios({
        url: `/categories/${id}`,
        method: "put",
        data,
    });
