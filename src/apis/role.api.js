import axios from "config/axios";

export const getRoles = (params) =>
    axios({
        url: "/roles",
        method: "get",
        params,
    });
