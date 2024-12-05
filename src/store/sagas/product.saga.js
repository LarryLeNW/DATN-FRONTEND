import { getProducts } from "apis/product.api";
import { put, takeEvery } from "redux-saga/effects";
import {
    getProductListFailure,
    getProductListRequest,
    getProductListSuccess,
} from "store/slicers/product.slicer";

function* getProductListSaga(action) {
    try {
        const { more, sort, ...params } = action.payload;

        const sortData = sort && {
            sortBy: sort.split(".")[0],
            orderBy: sort.split(".")[1],
        };

        const res = yield getProducts({ ...params, ...sortData });

        yield put(
            getProductListSuccess({
                data: res?.result?.content,
                meta: {
                    page: params.page,
                    limit: params.limit,
                    totalProduct: res?.result?.totalElements,
                    totalPage: res?.result?.totalPages,
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
