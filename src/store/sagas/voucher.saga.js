import { saveVoucherByCustomer } from "apis/voucher.api";
import { put, takeEvery } from "redux-saga/effects";

import {
    saveVoucherFailure,
    saveVoucherRequest,
    saveVoucherSuccess,
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
        onError(e?.message);
        yield put(saveVoucherFailure("Đã có lỗi xảy ra!"));
    }
}

export default function* voucherSaga() {
    yield takeEvery(saveVoucherRequest.type, saveVoucherByCustomerSaga);
}
