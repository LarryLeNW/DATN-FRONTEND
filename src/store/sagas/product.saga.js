import { put, takeEvery } from "redux-saga/effects";
import {
    getProductListRequest,
    getProductListSuccess,
    getProductListFailure,
} from "redux/slicers/product.slicer";
import { getProducts } from "apis/product.api";
import { changeLoading } from "store/slicers/common.slicer";

function* getProductListSaga(action) {
    try {
        const { more, ...params } = action.payload;
        const result = yield getProducts(params);
        console.log("🚀 ~ function*getProductListSaga ~ result:", result);
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
}
