import axios from "config/axios";

export const getQuestions = (params) =>
    axios({
        url: "/questions",
        method: "get",
        params,
    });

export const createQuestion = (data) =>
    axios({
        url: "/questions",
        method: "post",
        data,
    });
