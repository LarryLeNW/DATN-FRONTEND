import { put, takeEvery } from "redux-saga/effects";
import {
    getProductListRequest,
    getProductListSuccess,
    getProductListFailure,
} from "store/slicers/product.slicer";
import { getProducts } from "apis/product.api";
import { changeLoading } from "store/slicers/common.slicer";

function* getProductListSaga(action) {
    try {
        const { more, ...params } = action.payload;
        const res = yield getProducts(params);

        console.log("result : " , res)

        yield put(
            getProductListSuccess({
                data: res?.result?.content,
                meta: {
                    page: params.page,
                    limit: params.limit,
                    totalProduct: res?.result?.page?.totalElements,
                    totalPage: res?.result?.page?.totalPages,
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
