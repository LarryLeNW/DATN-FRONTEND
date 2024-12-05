import axios from "config/axios";

export const getQuestions = (params) =>
    axios({
        url: "/questions",
        method: "get",
        params,
    });
