import axios from "config/axios";

export const getBlog = (params) => {
    return axios({
        url: "/blogs",
        method: "get",
        params,
    });
}   
export const deleteBlog = (id) => {
    return axios({
        url: `/blogs/${id}`,
        method: "delete",
        id,
    });
}
export const updateBlog = (id,data) => {
    return axios({
        url: `/blogs/${id}`,
        method: "put",
        data,
    });
}
export const createBlog = (data) => {
    return axios({
        url: `/blogs`,
        method: "post",
        data,
    });
}
