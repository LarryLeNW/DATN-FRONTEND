import axios from "config/axios";

export const getReviews = (params) => {
    return axios({
        url: "/reviews",
        method: "get",
        params,
    });
};

export const createReview = (data) => {
    return axios({
        url: "/reviews",
        method: "post",
        data,
    });
};
