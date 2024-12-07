import axios from "config/axios";

export const replyQuestion = (data) =>
    axios({
        url: "/question-reply",
        method: "post",
        data,
    });
