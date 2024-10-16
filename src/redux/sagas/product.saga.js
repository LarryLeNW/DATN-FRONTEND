import { put, takeEvery } from "redux-saga/effects";

import {
    getProductDetailRequest,
    getProductDetailSuccess,
    getProductDetailFailure,
    getProductListRequest,
    getProductListSuccess,
    getProductListFailure,
} from "redux/slicers/product.slicer";
import { getProducts } from "apis/product";

// function* getProductDetailSaga(action) {
//     try {
//         const { id } = action.payload;
//         const result = yield getProduct(id);
//         yield put(getProductDetailSuccess({ data: result.data }));
//     } catch (e) {
//         yield put(getProductDetailFailure("Đã có lỗi xảy ra!"));
//     }
// }

function* getProductListSaga(action) {
    try {
        const { more, ...params } = action.payload;
        const result = yield getProducts(params);
        yield put(
            getProductListSuccess({
                data: result.data,
                meta: {
                    page: params.page,
                    limit: params.limit,
                    totalProduct: result.counts,
                    totalPage: Math.ceil(result.counts / params.limit),
                },
                more: more,
            })
        );
    } catch (e) {
        yield put(getProductListFailure("Đã có lỗi xảy ra!"));
    }
}

export default function* productSaga() {
    yield takeEvery(getProductListRequest.type, getProductListSaga);
    // yield takeEvery(getProductDetailRequest.type, getProductDetailSaga);
}
