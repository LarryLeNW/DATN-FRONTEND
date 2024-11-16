import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
    userInfo: {
        data: null,
        loading: false,
        error: null,
    },
    authInfo: {
        loading: false,
        error: null,
        message: null,
        isShowMessage: false,
    },
    isLogged: false,
};

export const authSlicer = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginRequest: (state) => {
            state.authInfo.loading = true;
            state.authInfo.error = null;
        },
        loginSuccess: (state, action) => {
            const { user } = action.payload;
            state.authInfo.loading = false;
            state.userInfo.data = user;
            state.isLogged = true;
        },
        loginFailure: (state, action) => {
            const { error } = action.payload;
            state.authInfo.loading = false;
            state.authInfo.error = error?.message;
        },
        registerRequest: (state) => {
            state.authInfo.loading = true;
            state.authInfo.error = null;
        },
        registerSuccess: (state, action) => {
            state.authInfo.loading = false;
            state.authInfo.isShowMessage = true;
            state.authInfo.message = action.payload;
        },
        registerFailure: (state, action) => {
            const { error } = action.payload;
            state.authInfo.loading = false;
            state.authInfo.error = error?.message;
        },
        clearAuthInfo: (state) => {
            state.authInfo.message = "";
            state.authInfo.isShowMessage = false;
        },
        getUserInfoRequest: (state) => {
            state.userInfo.loading = true;
            state.userInfo.error = null;
        },
        getUserInfoSuccess: (state, action) => {
            const { user } = action.payload;
            state.userInfo.data = user;
            state.isLogged = true;
            state.userInfo.loading = false;
        },
        getUserInfoFailure: (state, action) => {
            const { error } = action.payload;
            state.userInfo.error = error;
            state.userInfo.loading = false;
        },

        changeAvatarRequest: (state) => {
            state.userInfo.error = null;
            state.userInfo.loading = true;
        },
        changeAvatarSuccess: (state, action) => {
            const { avatar } = action.payload;
            if (state.userInfo.data) {
                state.userInfo.data.avatar = avatar;
            }
            state.userInfo.loading = false;
        },
        changeAvatarFailure: (state, action) => {
            const { error } = action.payload;
            state.userInfo.error = error;
            state.userInfo.loading = false;
        },
        changeInfoRequest: (state) => {
            state.userInfo.error = null;
            state.userInfo.loading = true;
        },
        changeInfoSuccess: (state, action) => {
            const { data } = action.payload;
            state.userInfo.data = data;
            state.userInfo.loading = false;
        },
        changeInfoFailure: (state, action) => {
            const { error } = action.payload;
            state.userInfo.error = error;
            state.userInfo.loading = false;
        },
        logoutRequest: (state) => {
            Cookies.remove("accessToken");
            state.userInfo.data = null;
            state.isLogged = false;
        },
    },
});

export const {
    loginRequest,
    loginSuccess,
    loginFailure,
    registerRequest,
    registerSuccess,
    registerFailure,
    clearAuthInfo,
    getUserInfoRequest,
    getUserInfoSuccess,
    getUserInfoFailure,
    changeAvatarRequest,
    changeAvatarSuccess,
    changeAvatarFailure,
    changeInfoRequest,
    changeInfoSuccess,
    changeInfoFailure,
    logoutRequest,
} = authSlicer.actions;

export default authSlicer.reducer;
