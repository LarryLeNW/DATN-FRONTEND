import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
    baseURL: process.env.REACT_APP_URI_API,
    withCredentials: true,
});

instance.interceptors.request.use(
    function (config) {
        const token = Cookies.get("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

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
        return Promise.reject(error?.response?.data || "Something went wrong");
    }
);

export default instance;
