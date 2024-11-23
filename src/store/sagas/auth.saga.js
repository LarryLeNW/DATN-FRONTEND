import { put, takeEvery } from "redux-saga/effects";
import {
    loginRequest,
    loginSuccess,
    loginFailure,
    registerRequest,
    registerSuccess,
    registerFailure,
    confirmRegisterRequest,
    confirmRegisterSuccess,
    confirmRegisterFailure,
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
import { confirmRegister, getUserInfo, login, register } from "apis/auth.api";
import Cookies from "js-cookie";

function* loginSaga(action) {
    const { dataLogin, onSuccess, onError } = action.payload;
    try {
        let response = yield login(dataLogin);
        yield put(loginSuccess({ user: response?.result?.user }));
        yield onSuccess();
    } catch (error) {
        onError();
        yield put(loginFailure({ error: error.message }));
    }
}

function* registerSaga(action) {
    const { data, onSuccess, onError } = action.payload;
    try {
        let response = yield register(data);
        yield put(registerSuccess(response?.result));
        onSuccess(response?.result);
    } catch (error) {
        onError(error?.message);
        yield put(registerFailure({ error: error.message }));
    }
}

function* confirmRegisterSaga(action) {
    const { token, onError, onSuccess } = action.payload;
    try {
        let response = yield confirmRegister(token);
        yield put(confirmRegisterSuccess(response?.result));
        onSuccess(response?.result);
    } catch (error) {
        onError();
        yield put(confirmRegisterFailure({ error: error.message }));
    }
}

function* getUserInfoSaga() {
    try {
        let response = yield getUserInfo();
        yield put(getUserInfoSuccess({ user: response?.result }));
    } catch (error) {
        yield put(getUserInfoFailure({ error: error.message }));
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
    yield takeEvery(registerRequest.type, registerSaga);
    yield takeEvery(getUserInfoRequest.type, getUserInfoSaga);
    yield takeEvery(confirmRegisterRequest.type, confirmRegisterSaga);
    // yield takeEvery(changeAvatarRequest.type, changeAvatarSaga);
    // yield takeEvery(changeInfoRequest.type, changeInfoSaga);
    // yield takeEvery(updateCartRequest.type, updateCartSaga);
    // yield takeEvery(removeCartRequest.type, removeCartSaga);
}
