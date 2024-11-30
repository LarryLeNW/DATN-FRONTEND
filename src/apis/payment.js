import axios from "config/axios";

export const getPaymentByTransId = (transId) =>
    axios({
        url: `/payment/check/${transId}`,
        method: "get",
    });
