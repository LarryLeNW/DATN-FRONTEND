import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userVouchers: {
        data: [],
        loading: false,
        error: null,
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
    },
});

export const { saveVoucherRequest, saveVoucherSuccess, saveVoucherFailure } =
    voucherSlicer.actions;

export default voucherSlicer.reducer;
