import axios from "config/axios";

export const createDelivery = (data) =>
    axios({
        url: "/delivery",
        method: "post",
        data,
    });

export const updateDelivery = (id, data) =>
    axios({
        url: "/delivery/" + id,
        method: "put",
        data,
    });

export const getDeliveries = (params) =>
    axios({
        url: "/delivery",
        method: "get",
        params,
    });

export const deleteDelivery = (deliveryId) =>
    axios({
        url: "/delivery/" + deliveryId,
        method: "delete",
    });

export const getDelivery = (deliveryId) =>
    axios({
        url: "/delivery/" + deliveryId,
        method: "get",
    });
