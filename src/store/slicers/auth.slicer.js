import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    userInfo: {
        data: null,
        loading: false,
        error: null,
    },
    authInfo: {
        loading: false,
        error: null,
    },
    cart: {
        loading: false,
        error: null,
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
        getUserInfoRequest: (state) => {
            state.userInfo.loading = true;
            state.userInfo.error = null;
        },
        getUserInfoSuccess: (state, action) => {
            const { data } = action.payload;
            state.userInfo.data = data;
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
        // cart
        updateCartRequest: (state) => {
            state.cart.loading = true;
            state.cart.error = null;
        },
        updateCartSuccess: (state, action) => {
            const { listCart } = action.payload;
            if (state.userInfo.data) {
                state.userInfo.data.cart = listCart;
            }
            state.cart.loading = false;
        },
        updateCartFailure: (state, action) => {
            const { error } = action.payload;
            state.cart.error = error;
            state.cart.loading = false;
        },
        removeCartRequest: (state) => {
            state.cart.loading = true;
            state.cart.error = null;
        },
        removeCartSuccess: (state, action) => {
            const { data } = action.payload;
            if (state.userInfo.data) {
                state.userInfo.data.cart = data.cart;
            }
            state.cart.loading = false;
        },
        removeCartFailure: (state, action) => {
            const { error } = action.payload;
            state.cart.error = error;
            state.cart.loading = false;
        },
        logoutRequest: (state) => {
            document.cookie = "accessToken=; Max-Age=0; ";
            state.userInfo.data = null;
            state.isLogged = false;
        },
    },
});

export const {
    loginRequest,
    loginSuccess,
    loginFailure,
    getUserInfoRequest,
    getUserInfoSuccess,
    getUserInfoFailure,
    changeAvatarRequest,
    changeAvatarSuccess,
    changeAvatarFailure,
    changeInfoRequest,
    changeInfoSuccess,
    changeInfoFailure,
    // cart
    updateCartRequest,
    updateCartSuccess,
    updateCartFailure,
    removeCartRequest,
    removeCartSuccess,
    removeCartFailure,
    logoutRequest,
} = authSlicer.actions;

export default authSlicer.reducer;
