import axios from "config/axios";

export const getCategoryBlog = (params) => {
    return axios({
        url: "/categoryBlog",
        method: "get",
        params,
    });
};

export const createCategoryBlog = (data) => {
    return axios({
        url: "/categoryBlog",
        method: "post",
        data,
    });
};

export const deleteCategoryBlog = (id) => {
    return axios({
        url: `/categoryBlog/${id}`,
        method: "delete",
        id,
    });
};
export const updateCategoryBlog = (id, data) => {
    return axios({
        url: `/categoryBlog/${id}`,
        method: "put",
        data,
    });
};
