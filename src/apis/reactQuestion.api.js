import axios from "config/axios";

export const createReactQuestion = (data) =>
    axios({
        url: "/question-reaction",
        method: "post",
        data,
    });

export const updateReactQuestion = (id, data) =>
    axios({
        url: `/question-reaction/${id}`,
        method: "put",
        data,
    });
