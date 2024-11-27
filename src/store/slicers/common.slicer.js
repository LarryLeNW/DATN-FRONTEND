import { createSlice } from "@reduxjs/toolkit";
import qs from "qs";

const locationSearch = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
});

const initialState = {
    modal: {
        isShow: false,
        children: null,
    },
    isLoading: false,
    filterParams: {
        category: locationSearch.category,
        keyword: locationSearch.keyword || "",
        sort: locationSearch.sort || undefined,
        priceFrom: locationSearch.priceFrom || undefined,
        priceTo: locationSearch.priceTo || undefined,
    },
    messageSystem: {
        isShow: false,
        message: "",
        typeEffect: null,
    },
};

export const commonSlicer = createSlice({
    name: "common",
    initialState,
    reducers: {
        showModal: (state, action) => {
            state.modal.isShow = action.payload.isShowModal;
            state.modal.children = action.payload.children;
        },
        setFilterParams: (state, action) => {
            state.filterParams = action.payload;
        },
        clearFilterParams: (state) => {
            state.filterParams = {
                category: [],
                keyword: "",
                sort: undefined,
                priceFrom: undefined,
                priceTo: undefined,
            };
        },
        changeLoading: (state, action) => {
            state.isLoading =
                action.payload !== undefined
                    ? action.payload
                    : !state.isLoading;
        },
        setMessageData: (state, action) => {
            const { isShow, message, typeEffect } = action.payload;
            state.messageSystem.isShow = isShow;
            state.messageSystem.message = message;
            state.messageSystem.typeEffect = typeEffect || {
                spread: 360,
                ticks: 50,
                gravity: 0,
                decay: 0.94,
                startVelocity: 30,
                colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
                particleCount: 40,
                scalar: 1.2,
                shapes: ["star"],
            };
        },
        resetMessageData: (state) => {
            state.messageSystem.isShow = false;
            state.messageSystem.message = null;
            state.messageSystem.typeEffect = {
                spread: 360,
                ticks: 50,
                gravity: 0,
                decay: 0.94,
                startVelocity: 30,
                colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
                particleCount: 40,
                scalar: 1.2,
                shapes: ["star"],
            };
        },
    },
});

export const {
    showModal,
    setFilterParams,
    clearFilterParams,
    changeLoading,
    setMessageData,
    resetMessageData,
} = commonSlicer.actions;

export default commonSlicer.reducer;
