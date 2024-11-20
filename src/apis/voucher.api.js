import axios from "config/axios";

export const getVouchers = (params) =>
    axios({
        url: "/vouchers",
        method: "get",
        params,
    });

export const createVoucher = (data) =>
    axios({
        url: "/vouchers",
        method: "post",
        data,
    });
