import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartList: {
        data: [],
        loading: false,
        error: null,
    },
};

export const cartSlicer = createSlice({
    name: "cart",
    initialState,
    reducers: {
        getCartListRequest: (state, action) => {
            state.cartList.loading = true;
            state.cartList.error = null;
        },
        getCartListSuccess: (state, action) => {
            const { data } = action.payload;
            state.cartList.loading = false;
            state.cartList.data = data;
        },
        getCartListFailure: (state, action) => {
            const { error } = action.payload;
            state.cartList.loading = false;
            state.cartList.error = error;
        },
        createCartRequest: (state, action) => {
            state.cartList.loading = true;
            state.cartList.error = null;
        },
        createCartSuccess: (state, action) => {
            const { data } = action.payload;
            state.cartList.loading = false;
            state.cartList.data = data;
        },
        createCartFailure: (state, action) => {
            const { error } = action.payload;
            state.cartList.loading = false;
            state.cartList.error = error;
        },
        updateCartRequest: (state, action) => {
            state.cartList.loading = true;
            state.cartList.error = null;
        },
        updateCartSuccess: (state, action) => {
            const { data } = action.payload;
            state.cartList.loading = false;
            state.cartList.data = data;
        },
        updateCartFailure: (state, action) => {
            const { error } = action.payload;
            state.cartList.loading = false;
            state.cartList.error = error;
        },
        deleteCartRequest: (state, action) => {
            state.cartList.loading = true;
            state.cartList.error = null;
        },
        deleteCartSuccess: (state, action) => {
            const { data } = action.payload;
            state.cartList.loading = false;
            state.cartList.data = data;
        },
        deleteCartFailure: (state, action) => {
            const { error } = action.payload;
            state.cartList.loading = false;
            state.cartList.error = error;
        },
    },
});

export const {
    getCartListRequest,
    getCartListSuccess,
    getCartListFailure,
    createCartRequest,
    createCartSuccess,
    createCartFailure,
    updateCartRequest,
    updateCartSuccess,
    updateCartFailure,
    deleteCartRequest,
    deleteCartSuccess,
    deleteCartFailure,
} = cartSlicer.actions;

export default cartSlicer.reducer;
