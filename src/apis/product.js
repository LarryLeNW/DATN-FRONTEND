import axios from "config/axios";

export const getProducts = (params) =>
    axios({
        url: "/product",
        method: "get",
        params,
    });
