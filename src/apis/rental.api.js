import axios from "config/axios";

export const createRental = (data) => {
    return axios({
        url: `/rental`,
        method: "post",
        data,
    });
};
