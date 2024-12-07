import axios from "config/axios";

export const getOrders = (params) => {
    return axios({
        url: "/orders",
        method: "get",
        params,
    });
};

export const deleteOrder = (id) => {
    return axios({
        url: `/orders/${id}`,
        method: "delete",
        id,
    });
};
export const updateOrder = (id, data) => {
    return axios({
        url: `/orders/${id}`,
        method: "put",
        data,
    });
};
export const createOrder = (data) => {
    return axios({
        url: `/orders`,
        method: "post",
        data,
    });
};
export const getOrderById = (id) => {
    return axios({
        url: `/orders/${id}`,
        method: "get",
    });
};
export const getAllStatusOrder = () => {
    return axios({
        url: `/orders/getAllStatusOrder`,
        method: "get",
    });
};

export const getOneOrderByCode = (orderCode) =>
    axios({
        url: `/orders/code/` + orderCode,
        method: "get",
    });
