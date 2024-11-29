import axios from "config/axios";

export const getComment = (params) =>
    axios({
        url: "/comments",
        method: "get",
        params,
    });

export const createComment = (data) =>
    axios({
        url: "/comments",
        method: "post",
        data,
    });

export const deleteComment = (id) =>
    axios({
        url: `/comments/${id}`,
        method: "delete",
    });

export const putComment = (id, data) =>
    axios({
        url: `/comments/${id}`,
        method: "put",
        data
    });
export const getCommentsByBlogId = (id) =>
    axios({
        url: `/comments/blog/${id}`,
        method: "get",
    });