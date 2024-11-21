import logo from "assets/images/logo.jpg";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, notification } from "antd";
import { getRoles } from "apis/role.api";
import { createUser, updateUser } from "apis/user.api";
import { cleanEmptyDataObject } from "utils/helper";

function UserForm({ closeModal, fetchData, userCurrent }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        defaultValues: {
            email: userCurrent?.email || "",
            password: "123456",
            role: userCurrent?.role?.id || "1",
            phone_number: userCurrent?.phone_number || "",
            username: userCurrent?.username || "",
            avatar: userCurrent?.avatar || "",
        },
    });

    const [userRoles, setUserRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await getRoles();
                if (res?.result?.content) {
                    setUserRoles(res.result.content);
                } else {
                    setUserRoles([]);
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
                notification.error({
                    message: "Failed to fetch roles",
                    duration: 2,
                });
            }
        };

        fetchRoles();
    }, []);

    const handleSubmitForm = async (data) => {
        try {
            const payloadFormat = cleanEmptyDataObject({
                ...data,
                role: { id: +data.role },
            });

            if (userCurrent) await updateUser(userCurrent.id, payloadFormat);
            else await createUser(payloadFormat);
            notification.success({
                message: userCurrent
                    ? "Cập nhật thành công."
                    : "Tạo thành công.",
                duration: 1,
            });
            closeModal();
            fetchData();
        } catch (error) {
            notification.error({ message: error.message, duration: 1 });
        }
    };

    return (
        <div className="flex flex-col items-center select-none">
            {/* Header */}
            <div className="flex items-center justify-center w-full bg-light p-2">
                <img src={logo} alt="logo" className="w-16 object-contain" />
                <h2 className="text-lg font-bold text-center text-white w-full">
                    {userCurrent ? "Chỉnh sửa người dùng" : "Tạo người dùng"}
                </h2>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit(handleSubmitForm)}
                className="flex flex-col gap-4 mt-4 w-full"
            >
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            {...register("username", {
                                minLength: {
                                    value: 6,
                                    message:
                                        "Username must be at least 6 characters",
                                },
                                maxLength: {
                                    value: 20,
                                    message:
                                        "Username cannot exceed 20 characters",
                                },
                            })}
                            placeholder="Enter username"
                            className="w-full py-2 px-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                        {errors.username && (
                            <p className="text-red-500">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    <div className="flex-1">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                pattern: {
                                    value: /^[A-Za-z0-9]{6,20}$/,
                                    message:
                                        "Password must be between 6 and 20 characters",
                                },
                            })}
                            placeholder="Enter password"
                            className="w-full py-2 px-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                        {errors.password && (
                            <p className="text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="flex-1">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            {...register("role", {
                                required: "Role is required",
                            })}
                            className="w-full outline-primary border border-primary rounded"
                        >
                            {userRoles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role && (
                            <p className="text-red-500">
                                {errors.role.message}
                            </p>
                        )}
                    </div>

                    <div className="flex-1">
                        <label htmlFor="phone_number">Phone Number</label>
                        <input
                            id="phone_number"
                            {...register("phone_number", {
                                pattern: {
                                    value: /^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d\s.-]{7,15}$/,
                                    message:
                                        "Please enter a valid phone number",
                                },
                            })}
                            placeholder="Nhập số điện thoại"
                            className="w-full py-2 px-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                        {errors.phone_number && (
                            <p className="text-red-500">
                                {errors.phone_number.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex-1">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Invalid email format",
                            },
                        })}
                        placeholder="Enter email"
                        className="w-full py-2 px-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                    {errors.email && (
                        <p className="text-red-500">{errors.email.message}</p>
                    )}
                </div>

                <Button type="primary" htmlType="submit" className="w-full">
                    {userCurrent ? "Update" : "Create"}
                </Button>
            </form>
        </div>
    );
}
export default UserForm;
