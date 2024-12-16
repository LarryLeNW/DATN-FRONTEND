import { faker } from "@faker-js/faker";
import { notification } from "antd";
import { getRoles } from "apis/role.api";
import {
    getStatisticUserByRole,
    getStatisticUserByStatus,
    getTopReactUsers,
} from "apis/user.api";
import { useEffect, useState } from "react";
import Icons from "utils/icons";

function UserStatistic() {
    const [userRoles, setUserRoles] = useState([]);
    const [userStatus, setUserStatus] = useState([]);
    const [userTopReaction, setUserTopReaction] = useState([]);
    console.log("🚀 ~ UserStatistic ~ userTopReaction:", userTopReaction);

    const fetchUserRoleStatistic = async () => {
        try {
            const res = await getStatisticUserByRole();
            setUserRoles(res);
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 2,
                placement: "top",
            });
        }
    };

    const fetchUserStatusStatistic = async () => {
        try {
            const res = await getStatisticUserByStatus();
            setUserStatus(res);
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 2,
                placement: "top",
            });
        }
    };

    const fetchUserReactionStatistic = async () => {
        try {
            const res = await getTopReactUsers();
            setUserTopReaction(res);
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 2,
                placement: "top",
            });
        }
    };

    useEffect(() => {
        fetchUserStatusStatistic();
        fetchUserRoleStatistic();
        fetchUserReactionStatistic();
    }, []);

    const convertRoleUserUI = (role) => {
        if (!role) return {};

        if (role == "USER")
            return {
                text: "Khách hàng",
                icon: <Icons.FaUserTag />,
            };
        if (role == "SUPERADMIN")
            return {
                text: "Super admin",
                icon: <Icons.FaUserShield />,
            };

        if (role.toUpperCase().includes("STAFF"))
            return {
                text: "Nhân viên",
                icon: <Icons.FaUserTie />,
            };

        return {
            text: "Nhân viên",
            icon: <Icons.FaUserCog />,
        };
    };

    const convertStatusUserUI = (status) => {
        if (!status) return {};

        if (status == "INACTIVE")
            return {
                text: "Chưa kích hoạt",
                icon: <Icons.TbLockOff color="gray" />,
                textColor: "text-gray-400",
            };

        if (status == "BLOCKED")
            return {
                text: "Đã bị khóa",
                icon: <Icons.TbLockOpenOff color="red" />,
                textColor: "text-red-500",
            };

        return {
            text: "Kích hoạt",
            icon: <Icons.FaCheck color="green" />,
            textColor: "text-green-600",
        };
    };

    return (
        <div className="flex justify-center flex-col gap-4">
            <h1 className="mx-auto text-primary my-4 flex text-3xl font-bold">
                Thống kê người dùng
            </h1>
            <div className="flex justify-around">
                <div className="border rounded bg-white  flex flex-col justify-center py-2 px-4">
                    <h1 className=" font-bold border-b border-primary py-2 text-primary px-12">
                        Người dùng hiện tại
                    </h1>
                    <div className="flex flex-col gap-2 px-2">
                        {Object.entries(userRoles)?.map(
                            ([role, userNumber]) => (
                                <div className="flex gap-4 justify-between text-lg">
                                    <div className="flex gap-2 items-center text-blue-600">
                                        <p>{convertRoleUserUI(role)?.icon}</p>
                                        <p>{convertRoleUserUI(role)?.text}</p>
                                    </div>
                                    <p>{userNumber} tài khoản</p>
                                </div>
                            )
                        )}
                        <div className="flex gap-4 justify-between text-lg">
                            <div className="flex gap-2 items-center text-blue-600">
                                <p>{<Icons.MdOutlineClearAll />}</p>
                                <p>Tổng số</p>
                            </div>
                            <p>
                                {Object.values(userRoles).reduce(
                                    (sum, curr) => (sum += curr),
                                    0
                                )}{" "}
                                người
                            </p>
                        </div>
                    </div>
                </div>
                <div className="border rounded bg-white  flex flex-col  py-2 px-4">
                    <h1 className=" font-bold border-b border-primary py-2 text-primary px-12">
                        Trạng thái người dùng
                    </h1>
                    <div className="flex flex-col gap-2 px-2">
                        {Object.entries(userStatus)?.map(
                            ([status, userNumber]) => (
                                <div className="flex gap-4 justify-between text-lg">
                                    <div className="flex gap-2 items-center text-primary">
                                        <p>
                                            {convertStatusUserUI(status)?.icon}
                                        </p>
                                        <p
                                            className={
                                                convertStatusUserUI(status)
                                                    ?.textColor
                                            }
                                        >
                                            {convertStatusUserUI(status)?.text}
                                        </p>
                                    </div>
                                    <p>{userNumber} tài khoản</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div className="border rounded bg-white  flex flex-col  py-2 px-4">
                    <h1 className=" font-bold border-b border-primary py-2 text-primary px-12 text-center">
                        Top tương tác
                    </h1>
                    <div className="flex flex-col gap-2 px-2 mt-2 max-h-[20vh] overflow-y-auto">
                        {userTopReaction.map((user, index) => (
                            <div className="flex gap-4 items-center">
                                <div className="px-4 py-1 bg-blue-600 text-white text-sm rounded font-semibold italic">
                                    Top {index + 1}
                                </div>
                                <div className="flex items-center gap-2">
                                    <img
                                        src={
                                            user.avatar || faker.image.avatar()
                                        }
                                        alt=""
                                        className="w-8 h-8 object-cover rounded-full"
                                    />
                                    <div className="text-lg">
                                        {user.username ||
                                            user.email.split("@")[0]}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserStatistic;
