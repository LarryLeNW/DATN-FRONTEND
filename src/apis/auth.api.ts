import axios from "config/axios";
import { LoginForm, RegisterForm } from "utils/rules";
import { AUTH } from "./routes";

class authApi {
    login(data: LoginForm) {
        return axios({
            url: AUTH.LOGIN,
            method: "post",
            data,
        });
    }

    register(data: RegisterForm) {
        return axios({
            url: AUTH.REGISTER,
            method: "post",
            data,
        });
    }

    // logout() {
    //     return http.post<{ message: string }>(
    //         AUTH.LOGOUT,
    //         {},
    //         { withCredentials: true }
    //     );
    // }
}
