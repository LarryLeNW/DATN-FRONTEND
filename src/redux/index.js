import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import commonReducer from "./slicers/common.slicer";
import rootSaga from "./sagas/index";

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
