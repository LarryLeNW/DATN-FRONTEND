import axios from "config/axios";

export const getUsers = (params) =>
    axios({
        url: "/users",
        method: "get",
        params,
    });
