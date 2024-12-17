import axios from "config/axios";

export const createRental = (data) => {
    return axios({
        url: `/rental`,
        method: "post",
        data,
    });
};

export const updateRental = (data) => {
    return axios({
        url: `/rental`,
        method: "PUT",
        data,
    });
};

export const getRentals = (params) => {
    return axios({
        url: `/rental`,
        method: "get",
        params,
    });
};

export const getRentalById = (id) => {
    return axios({
        url: `/rental/${id}`,
        method: "get",
    });
};

export const changeRentalStatus = (id, status) => {
    return axios({
        url: `/rental/${id}/${status}`,
        method: "put",
    });
};

export const getRentalStatisticStatus = (params) =>
    axios({
        url: `/rental/statistics/status`,
        method: "get",
        params,
    });

export const getRentalStatisticTotal = (params) =>
    axios({
        url: `/rental/statistics/totals`,
        method: "get",
        params,
    });
export const getRentalStatisticDaily = (params) =>
    axios({
        url: `/rental/statistics/daily`,
        method: "get",
        params,
    });
