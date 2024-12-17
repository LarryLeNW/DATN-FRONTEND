import axios from "config/axios";

export const getPaymentStatistics = () =>
    axios({
        url: `/payment/statistics/totals`,
        method: "get",
    });

export const getPaymentDailyStatistics = (month, year) =>
    axios({
        url: `/payment/statistics/${month}/${year}`,
        method: "get",
    });
