import axios from "config/axios";

export const getRoles = (params) =>
    axios({
        url: "/roles",
        method: "get",
        params,
    });

export const createRole = (data) =>
    axios({
        url: "/roles",
        method: "post",
        data,
    });

export const updateRole = (roleId, data) =>
    axios({
        url: "/roles/" + roleId,
        method: "put",
        data,
    });

export const deleteRole = (roleId) =>
    axios({
        url: "/roles/" + roleId,
        method: "delete",
    });

export const getModules = (params) =>
    axios({
        url: "/modules",
        method: "get",
        params,
    });

export const getPermissions = (params) =>
    axios({
        url: "/permissions",
        method: "get",
        params,
    });
