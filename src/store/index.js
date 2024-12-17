import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import commonReducer from "./slicers/common.slicer";
import authReducer from "./slicers/auth.slicer";
import productReducer from "./slicers/product.slicer";
import cartReducer from "./slicers/cart.slicer";
import voucherReducer from "./slicers/voucher.slicer";

import rootSaga from "./sagas/index";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        common: commonReducer,
        auth: authReducer,
        product: productReducer,
        cart: cartReducer,
        voucher: voucherReducer,
    },
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware({
            thunk: false,
            serializableCheck: false,
        }),
        sagaMiddleware,
    ],
});

sagaMiddleware.run(rootSaga);

export default store;
