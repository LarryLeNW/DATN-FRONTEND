import axios from "config/axios";

export const replyQuestion = (data) =>
    axios({
        url: "/questions",
        method: "post",
        data,
    });
