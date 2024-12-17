import { faker } from "@faker-js/faker";
import { notification } from "antd";
import { getRoles } from "apis/role.api";
import {
    getStatisticUserByRole,
    getStatisticUserByStatus,
    getStatisticUserTopPayment,
    getTopReactUsers,
    getUserStatisticDaily,
} from "apis/user.api";
import { useEffect, useState } from "react";
import { formatMoney } from "utils/helper";
import Icons from "utils/icons";
import {
    BarChart,
    Bar,
    ResponsiveContainer,
    YAxis,
    XAxis,
    Legend,
    CartesianGrid,
    Tooltip,
} from "recharts";

function UserStatistic() {
    const [userRoles, setUserRoles] = useState([]);
    const [userStatus, setUserStatus] = useState([]);
    const [userTopReaction, setUserTopReaction] = useState([]);
    const [userTopPayment, setUserTopPayment] = useState([]);
    const [dataChar, setDataChar] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

    const fetchUserStatisticDaily = async () => {
        try {
            const dataChar = await getUserStatisticDaily({
                month: selectedMonth,
                year: selectedYear,
            });

            const chartData = Object.entries(dataChar || {}).map(
                ([key, value]) => ({
                    name: `Ngày ${key}`,
                    users: value,
                })
            );

            setDataChar(chartData);
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 2,
                placement: "top",
            });
        }
    };

    const fetchUserPaymentStatistic = async () => {
        try {
            const res = await getStatisticUserTopPayment();
            setUserTopPayment(res);
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
        fetchUserPaymentStatistic();
        fetchUserStatisticDaily();
    }, []);

    useEffect(() => {
        fetchUserStatisticDaily();
    }, [selectedMonth, selectedYear]);

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
                <div className="border rounded bg-white  flex flex-col  py-2 px-4">
                    <h1 className=" font-bold border-b border-primary py-2 text-primary px-12 text-center">
                        Top khách hàng tiềm năng
                    </h1>
                    <div className="flex flex-col gap-2 px-2 mt-2 max-h-[20vh] overflow-y-auto">
                        {userTopPayment.map((user, index) => (
                            <div className="flex gap-4 items-center">
                                <div className="px-4 py-1 bg-blue-600 text-white text-sm rounded font-semibold italic">
                                    Top {index + 1}
                                </div>
                                <div className="flex items-center gap-2 ">
                                    <div className="flex items-center">
                                        <img
                                            src={
                                                user.avatar ||
                                                faker.image.avatar()
                                            }
                                            alt=""
                                            className="w-8 h-8 object-cover rounded-full"
                                        />
                                        <div className="text-lg">
                                            {user.username ||
                                                user.email.split("@")[0]}
                                        </div>
                                    </div>
                                    <div className="pl-2 border-l flex gap-2 items-center">
                                        <div>
                                            {formatMoney(
                                                user?.totalPaymentAmount
                                            )}
                                            đ
                                        </div>
                                        <div className="pl-2 border-l">
                                            {user?.totalOrder} đơn
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-[60vh] bg-white rounded px-4 py-2 mx-2 mt-auto border border-primary">
                <div>
                    {dataChar && (
                        <div className="text-primary font-bold">
                            Tổng người dùng đăng kí tháng {selectedMonth} năm{" "}
                            {selectedYear} là :{" "}
                            {dataChar?.reduce(
                                (sum, prev) => (sum += prev.users),
                                0
                            )}{" "}
                        </div>
                    )}

                    <div className="flex justify-end my-4 gap-4">
                        <select
                            className="border rounded px-2 py-1"
                            value={selectedMonth}
                            onChange={(e) =>
                                setSelectedMonth(parseInt(e.target.value))
                            }
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    Tháng {i + 1}
                                </option>
                            ))}
                        </select>

                        <select
                            className="border rounded px-2 py-1"
                            value={selectedYear}
                            onChange={(e) =>
                                setSelectedYear(parseInt(e.target.value))
                            }
                        >
                            {Array.from({ length: 5 }, (_, i) => (
                                <option
                                    key={i}
                                    value={new Date().getFullYear() - i}
                                >
                                    {new Date().getFullYear() - i}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height="70%">
                    <BarChart
                        width={500}
                        height={300}
                        data={dataChar}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        barSize={20}
                    >
                        <XAxis
                            dataKey="name"
                            scale="point"
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Bar
                            dataKey="users"
                            fill="blue"
                            background={{ fill: "#eee" }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default UserStatistic;
