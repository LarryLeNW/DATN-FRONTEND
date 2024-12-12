import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: {},
};

export const rentalProductSlicer = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setSelectedRentalProduct: (state, action) => {
            state.data = action.payload;
        },
    },
});

export const { setSelectedRentalProduct } = rentalProductSlicer.actions;

export default rentalProductSlicer.reducer;
