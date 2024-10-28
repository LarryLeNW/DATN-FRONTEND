import axios from "axios";
import { useDispatch } from "react-redux";

const instance = axios.create({
    baseURL: process.env.REACT_APP_URI_API,
    withCredentials: true,
});

instance.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        return error?.response?.data || "Something wen't wrong";
    }
);

export default instance;
