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

export const deleteVoucher = (voucherId) =>
    axios({
        url: "/vouchers/" + voucherId,
        method: "delete",
    });

export const saveVoucherByCustomer = (voucherCode) =>
    axios({
        url: "/vouchers/save/" + voucherCode,
        method: "post",
    });
