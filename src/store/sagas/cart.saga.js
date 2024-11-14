import { put, takeEvery } from "redux-saga/effects";
import {
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
} from "store/slicers/cart.slicer";
import { createCart, deleteCart, getCarts, updateCart } from "apis/cart.api";

function* getCartListSaga() {
    try {
        const res = yield getCarts();
        console.log("🚀 ~ function*getCartListSaga ~ res:", res);

        yield put(
            getCartListSuccess({
                data: res?.result?.content,
            })
        );
    } catch (e) {
        yield put(getCartListFailure("Đã có lỗi xảy ra!"));
    }
}

function* createCartSaga(action) {
    const { data, onSuccess, onError } = action.payload;
    try {
        const res = yield createCart(data);
        onSuccess();
        yield put(
            createCartSuccess({
                data: res?.result?.content,
            })
        );
    } catch (e) {
        onError(e);
        yield put(createCartFailure("Đã có lỗi xảy ra!"));
    }
}
function* deleteCartSaga(action) {
    const data = action.payload;
    try {
        const res = yield deleteCart(data);
        yield put(
            deleteCartSuccess({
                data: res?.result?.content,
            })
        );
    } catch (e) {
        yield put(deleteCartFailure("Đã có lỗi xảy ra!"));
    }
}

function* updateCartSaga(action) {
    const data = action.payload;
    try {
        const res = yield updateCart(data);
        yield put(
            updateCartSuccess({
                data: res?.result?.content,
            })
        );
    } catch (e) {
        yield put(updateCartFailure("Đã có lỗi xảy ra!"));
    }
}

export default function* cartSaga() {
    yield takeEvery(getCartListRequest.type, getCartListSaga);
    yield takeEvery(createCartRequest.type, createCartSaga);
    yield takeEvery(deleteCartRequest.type, deleteCartSaga);
    yield takeEvery(updateCartRequest.type, updateCartSaga);
}
