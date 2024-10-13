import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    productDetail: {
        data: {},
        loading: false,
        error: null,
    },
    productList: {
        data: [],
        meta: {},
        loading: false,
        error: null,
    },
};

export const productSlicer = createSlice({
    name: "product",
    initialState,
    reducers: {
        getProductDetailRequest: (state, action) => {
            state.productDetail.loading = true;
            state.productDetail.error = null;
        },
        getProductDetailSuccess: (state, action) => {
            const { data } = action.payload;
            state.productDetail.loading = false;
            state.productDetail.data = data;
        },
        getProductDetailFailure: (state, action) => {
            const { error } = action.payload;
            state.productDetail.loading = false;
            state.productDetail.error = error;
        },
        getProductListRequest: (state, action) => {
            state.productList.loading = true;
            state.productList.error = null;
        },
        getProductListSuccess: (state, action) => {
            const { data, meta, more } = action.payload;
            state.productList.loading = false;
            state.productList.meta = meta;
            state.productList.data = more
                ? [...state.productList.data, ...data]
                : data;
        },
        getProductListFailure: (state, action) => {
            const { error } = action.payload;
            state.productList.loading = false;
            state.productList.error = error;
        },
    },
});

export const {
    getProductDetailRequest,
    getProductDetailSuccess,
    getProductDetailFailure,
    getProductListRequest,
    getProductListSuccess,
    getProductListFailure,
} = productSlicer.actions;

export default productSlicer.reducer;
