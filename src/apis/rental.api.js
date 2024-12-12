import axios from "config/axios";

export const createRental = (data) => {
    return axios({
        url: `/rental`,
        method: "post",
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
