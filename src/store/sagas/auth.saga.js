import { put, takeEvery } from "redux-saga/effects";
import {
    loginRequest,
    loginSuccess,
    loginFailure,
    getUserInfoRequest,
    getUserInfoSuccess,
    getUserInfoFailure,
    changeAvatarRequest,
    changeAvatarSuccess,
    changeAvatarFailure,
    changeInfoRequest,
    changeInfoSuccess,
    changeInfoFailure,
    updateCartRequest,
    updateCartSuccess,
    updateCartFailure,
    removeCartRequest,
    removeCartSuccess,
    removeCartFailure,
} from "../slicers/auth.slicer";
import { getUserInfo, login } from "apis/auth.api";
import Cookies from "js-cookie";
// import { removeCart, updateCart } from "apis/cart";

function* loginSaga(action) {
    const { dataLogin, onSuccess, onError } = action.payload;
    try {
        let response = yield login(dataLogin);
        yield put(loginSuccess({ user: response?.result?.user }));
        yield onSuccess();
    } catch (error) {
        onError();
        yield put(loginFailure({ error }));
    }
}

function* getUserInfoSaga() {
    try {
        let response = yield getUserInfo();
        console.log("🚀 ~ function*getUserInfoSaga ~ response:", response);
        yield put(getUserInfoSuccess({ user: response?.result }));
    } catch (error) {
        Cookies.remove("accessToken"); // mai xóa logic này
        console.log("🚀 ~ function*getUserInfoSaga ~ error:", error);
        yield put(getUserInfoFailure({ error }));
    }
}

// function* changeAvatarSaga(action) {
//     try {
//         const data = action.payload;
//         let response = yield changeAvatar(data);
//         yield put(changeAvatarSuccess(response));
//     } catch (error) {
//         yield put(changeAvatarFailure({ error }));
//     }
// }

// function* changeInfoSaga(action) {
//     try {
//         const data = action.payload;
//         let response = yield updateInfoUserCurrent(data);
//         yield put(changeInfoSuccess(response));
//         Swal.fire(
//             "Action Change Your Info",
//             "Cập nhật thông tin thành công",
//             "success"
//         );
//     } catch (error) {
//         yield put(changeInfoFailure({ error: error?.response?.data?.message }));
//         Swal.fire(
//             "Action Change Your Info",
//             error?.response?.data?.message,
//             "error"
//         );
//     }
// }

// function* updateCartSaga(action) {
//     try {
//         const { data, callback } = action.payload;
//         let response = yield updateCart(data);
//         yield put(updateCartSuccess(response));
//         yield callback();
//     } catch (error) {
//         yield put(updateCartFailure({ error }));
//         Swal.fire("Techshop", "Vui lòng thử lại sau...", "warning");
//     }
// }

// function* removeCartSaga(action) {
//     try {
//         const { pid } = action.payload;
//         let response = yield removeCart(pid);
//         yield put(removeCartSuccess(response));
//     } catch (error) {
//         yield put(removeCartFailure({ error }));
//         Swal.fire("Techshop", error?.response?.data?.message, "warning");
//     }
// }

export default function* authSaga() {
    yield takeEvery(loginRequest.type, loginSaga);
    yield takeEvery(getUserInfoRequest.type, getUserInfoSaga);
    // yield takeEvery(changeAvatarRequest.type, changeAvatarSaga);
    // yield takeEvery(changeInfoRequest.type, changeInfoSaga);
    // yield takeEvery(updateCartRequest.type, updateCartSaga);
    // yield takeEvery(removeCartRequest.type, removeCartSaga);
}
