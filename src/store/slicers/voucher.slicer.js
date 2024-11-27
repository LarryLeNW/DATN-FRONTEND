import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userVouchers: {
        data: [],
        loading: false,
        error: null,
    },
    selectedVouchers: {
        data: [],
    },
};

export const voucherSlicer = createSlice({
    name: "voucher",
    initialState,
    reducers: {
        saveVoucherRequest: (state, action) => {
            state.userVouchers.loading = true;
            state.userVouchers.error = null;
        },
        saveVoucherSuccess: (state, action) => {
            const { data } = action.payload;
            state.userVouchers.loading = false;
            state.userVouchers.data = data;
        },
        saveVoucherFailure: (state, action) => {
            const { error } = action.payload;
            state.userVouchers.loading = false;
            state.userVouchers.error = error;
        },
        getCustomerVouchersRequest: (state, action) => {
            state.userVouchers.loading = true;
            state.userVouchers.error = null;
        },
        getCustomerVouchersSuccess: (state, action) => {
            const { data } = action.payload;
            state.userVouchers.loading = false;
            state.userVouchers.data = data;
        },
        getCustomerVouchersFailure: (state, action) => {
            const { error } = action.payload;
            state.userVouchers.loading = false;
            state.userVouchers.error = error;
        },
        setSelectedVouchers: (state, action) => {
            state.selectedVouchers.data = action.payload;
        },
    },
});

export const {
    saveVoucherRequest,
    saveVoucherSuccess,
    saveVoucherFailure,
    getCustomerVouchersRequest,
    getCustomerVouchersSuccess,
    getCustomerVouchersFailure,
    setSelectedVouchers,
} = voucherSlicer.actions;

export default voucherSlicer.reducer;
