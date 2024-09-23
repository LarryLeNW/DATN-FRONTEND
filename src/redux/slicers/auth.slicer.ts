import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
    data: {
        cart?: any[];
        avatar?: string;
    } | null;
    loading: boolean;
    error: string | null;
}

interface LoginData {
    loading: boolean;
    error: string | null;
}

interface Cart {
    loading: boolean;
    error: string | null;
}

interface AuthState {
    userInfo: UserInfo;
    loginData: LoginData;
    cart: Cart;
    isLogged: boolean;
}

const initialState: AuthState = {
    userInfo: {
        data: null,
        loading: false,
        error: null,
    },
    loginData: {
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
        loginRequest: (state: AuthState) => {
            state.loginData.loading = true;
            state.loginData.error = null;
        },
        loginSuccess: (
            state: AuthState,
            action: PayloadAction<{ data: any }>
        ) => {
            const { data } = action.payload;
            state.loginData.loading = false;
            state.userInfo.data = data;
            state.isLogged = true;
        },
        loginFailure: (
            state: AuthState,
            action: PayloadAction<{ error: string }>
        ) => {
            const { error } = action.payload;
            state.loginData.loading = false;
            state.loginData.error = error;
        },
        getUserInfoRequest: (state: AuthState) => {
            state.userInfo.loading = true;
            state.userInfo.error = null;
        },
        getUserInfoSuccess: (
            state: AuthState,
            action: PayloadAction<{ data: any }>
        ) => {
            const { data } = action.payload;
            state.userInfo.data = data;
            state.isLogged = true;
            state.userInfo.loading = false;
        },
        getUserInfoFailure: (
            state: AuthState,
            action: PayloadAction<{ error: string }>
        ) => {
            const { error } = action.payload;
            state.userInfo.error = error;
            state.userInfo.loading = false;
        },
        changeAvatarRequest: (state: AuthState) => {
            state.userInfo.error = null;
            state.userInfo.loading = true;
        },
        changeAvatarSuccess: (
            state: AuthState,
            action: PayloadAction<{ avatar: string }>
        ) => {
            const { avatar } = action.payload;
            if (state.userInfo.data) {
                state.userInfo.data.avatar = avatar;
            }
            state.userInfo.loading = false;
        },
        changeAvatarFailure: (
            state: AuthState,
            action: PayloadAction<{ error: string }>
        ) => {
            const { error } = action.payload;
            state.userInfo.error = error;
            state.userInfo.loading = false;
        },
        changeInfoRequest: (state: AuthState) => {
            state.userInfo.error = null;
            state.userInfo.loading = true;
        },
        changeInfoSuccess: (
            state: AuthState,
            action: PayloadAction<{ data: any }>
        ) => {
            const { data } = action.payload;
            state.userInfo.data = data;
            state.userInfo.loading = false;
        },
        changeInfoFailure: (
            state: AuthState,
            action: PayloadAction<{ error: string }>
        ) => {
            const { error } = action.payload;
            state.userInfo.error = error;
            state.userInfo.loading = false;
        },
        // cart
        updateCartRequest: (state: AuthState) => {
            state.cart.loading = true;
            state.cart.error = null;
        },
        updateCartSuccess: (
            state: AuthState,
            action: PayloadAction<{ listCart: any[] }>
        ) => {
            const { listCart } = action.payload;
            if (state.userInfo.data) {
                state.userInfo.data.cart = listCart;
            }
            state.cart.loading = false;
        },
        updateCartFailure: (
            state: AuthState,
            action: PayloadAction<{ error: string }>
        ) => {
            const { error } = action.payload;
            state.cart.error = error;
            state.cart.loading = false;
        },
        removeCartRequest: (state: AuthState) => {
            state.cart.loading = true;
            state.cart.error = null;
        },
        removeCartSuccess: (
            state: AuthState,
            action: PayloadAction<{ data: { cart: any[] } }>
        ) => {
            const { data } = action.payload;
            if (state.userInfo.data) {
                state.userInfo.data.cart = data.cart;
            }
            state.cart.loading = false;
        },
        removeCartFailure: (
            state: AuthState,
            action: PayloadAction<{ error: string }>
        ) => {
            const { error } = action.payload;
            state.cart.error = error;
            state.cart.loading = false;
        },
        logoutRequest: (state: AuthState) => {
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
