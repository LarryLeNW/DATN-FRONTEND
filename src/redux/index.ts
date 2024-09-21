import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import rootSaga from "./sagas/index";
import commonReducer from "./slicers/common.slicer";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        common: commonReducer,
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
