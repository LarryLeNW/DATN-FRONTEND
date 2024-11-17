import axios from "config/axios";

export const getUsers = (params) =>
    axios({
        url: "/users",
        method: "get",
        params,
    });

export const deleteUsers = (id) =>
    axios({
        url: "/users/" + id,
        method: "delete",
    });
