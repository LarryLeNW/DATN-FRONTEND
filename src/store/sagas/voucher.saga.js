import { getCustomerVouchers, saveVoucherByCustomer } from "apis/voucher.api";
import { put, takeEvery } from "redux-saga/effects";

import {
    saveVoucherFailure,
    saveVoucherRequest,
    saveVoucherSuccess,
    getCustomerVouchersRequest,
    getCustomerVouchersSuccess,
    getCustomerVouchersFailure,
} from "store/slicers/voucher.slicer";

function* saveVoucherByCustomerSaga(action) {
    const { codeVoucher, onSuccess, onError } = action.payload;
    try {
        const res = yield saveVoucherByCustomer(codeVoucher);
        onSuccess();
        yield put(
            saveVoucherSuccess({
                data: res?.result?.content,
            })
        );
    } catch (e) {
        onError("Không tìm thấy voucher code " + codeVoucher);
        yield put(saveVoucherFailure("Đã có lỗi xảy ra!"));
    }
}
function* getCustomerVouchersSaga(action) {
    try {
        const res = yield getCustomerVouchers();
        yield put(
            getCustomerVouchersSuccess({
                data: res?.result?.content,
            })
        );
    } catch (e) {
        yield put(getCustomerVouchersFailure("Đã có lỗi xảy ra!"));
    }
}

export default function* voucherSaga() {
    yield takeEvery(saveVoucherRequest.type, saveVoucherByCustomerSaga);
    yield takeEvery(getCustomerVouchersRequest.type, getCustomerVouchersSaga);
}
