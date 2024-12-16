import axios from "config/axios";

export const getUsers = (params) =>
    axios({
        url: "/users",
        method: "get",
        params,
    });
export const createUser = (data) =>
    axios({
        url: "/users",
        method: "post",
        data,
    });

export const updateUser = (userId, data) =>
    axios({
        url: "/users/" + userId,
        method: "put",
        data,
    });

export const deleteUsers = (id) =>
    axios({
        url: "/users/" + id,
        method: "delete",
    });

export const updateInfoUser = (id, data) =>
    axios({
        url: `/users/${id}/info`,
        method: "put",
        data,
    });

export const updateChangePassword = (data) =>
    axios({
        url: `/users/changePassword`,
        method: "put",
        data,
    });

export const getTopReactUsers = () =>
    axios({
        url: "/users/top-reactions",
        method: "get",
    });

export const getStatisticUserByRole = () =>
    axios({
        url: "/users/statistics/roles",
        method: "get",
    });

export const getStatisticUserByStatus = () =>
    axios({
        url: "/users/statistics/status",
        method: "get",
    });
