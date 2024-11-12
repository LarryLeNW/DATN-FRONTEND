import axios from "config/axios";

export const getOrders = (params) => {
    return axios({
        url: "/orders",
        method: "get",
        params,
    });
}   
export const deleteOrder = (id) => {
    return axios({
        url: `/orders/${id}`,
        method: "delete",
        id,
    });
}
export const updateOrder = (id,data) => {
    return axios({
        url: `/orders/${id}`,
        method: "put",
        data,
    });
}
export const createOrder = (data) => {
    return axios({
        url: `/orders`,
        method: "post",
        data,
    });
}

