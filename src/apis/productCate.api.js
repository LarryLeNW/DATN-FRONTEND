import axios from "config/axios";

export const getProductCate = (params) =>
    axios({
        url: "/categories",
        method: "get",
        params,
    });
