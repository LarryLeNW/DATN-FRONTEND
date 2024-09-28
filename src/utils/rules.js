// import * as yup from "yup";
// const phoneRegExp =
//     /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

// const authSchema = yup.object({
//     username: yup
//         .string()
//         .required("Vui lòng nhập trường này!")
//         .min(2, "Độ dài tối thiểu 2 kí tự"),
//     email: yup
//         .string()
//         .required("Vui lòng nhập email!")
//         .email("Email này không hợp lệ"),
//     password: yup
//         .string()
//         .required("Vui lòng nhập trường này !")
//         .min(6, "Độ dài tối thiếu 6 kí tự !")
//         .max(162, "Độ dài tối đa 162 kí tự"),
//     confirm_password: yup
//         .string()
//         .required("Vui lòng nhập trường này !")
//         .min(6, "Độ dài tối thiếu 6 kí tự !")
//         .max(162, "Độ dài tối đa 162 kí tự")
//         .oneOf([yup.ref("password")], "Mật khẩu xác nhận không chính xác !"),
// });

// export const registerSchema = authSchema;
// export const loginSchema = authSchema.pick(["email", "password"]);
