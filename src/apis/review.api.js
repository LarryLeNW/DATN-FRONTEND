import axios from "config/axios";

export const getReviews = (params) => {
    return axios({
        url: "/reviews",
        method: "get",
        params,
    });
};
