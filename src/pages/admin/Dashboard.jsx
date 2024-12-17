import { notification } from "antd";
import {
    getPaymentDailyStatistics,
    getPaymentStatistics,
} from "apis/revenue.api";
import React, { useEffect, useState } from "react";
import { formatCurrency, formatMoney } from "utils/helper";
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
    Rectangle,
} from "recharts";
import {
    getStatisticUserByStatus,
    getStatisticUserTopPayment,
} from "apis/user.api";
import { getOrderStatisticStatus } from "apis/order.api";
import { convertVI } from "utils/covertDataUI";
import { getRentalStatisticStatus } from "apis/rental.api";
import { faker } from "@faker-js/faker";

function Dashboard() {
    const [revenueGeneralData, setRevenueGeneralData] = useState([]);
    const [dataCharRevenue, setDataCharRevenue] = useState([]);
    const [userStatus, setUserStatus] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);
    const [rentalStatus, setRentalStatus] = useState([]);
    const [userTopPayment, setUserTopPayment] = useState([]);

    const [selectedMonthRevenue, setSelectedMonthRevenue] = useState(
        new Date().getMonth() + 1
    );
    const [selectedYearRevenue, setSelectedYearRevenue] = useState(
        new Date().getFullYear()
    );

    const fetchRevenueGeneralData = async () => {
        try {
            const dataGeneral = await getPaymentStatistics();
            setRevenueGeneralData(dataGeneral);
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 2,
                placement: "top",
            });
        }
    };

    const fetchDataCharRevenue = async () => {
        try {
            const dataChar = await getPaymentDailyStatistics(
                selectedMonthRevenue,
                selectedYearRevenue
            );

            if (dataChar) {
                const chartData = Object.entries(dataChar || {}).map(
                    (value) => ({
                        name: `${value[0]}`,
                        revenue: value[1]?.revenue,
                        order: value[1]?.count,
                    })
                );

                setDataCharRevenue(chartData);
            }
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

    const handleFetchOrderStatus = async () => {
        try {
            const orderStatusData = await getOrderStatisticStatus();
            setOrderStatus(orderStatusData);
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 2,
                placement: "top",
            });
        }
    };

    const handleFetchRentalStatus = async () => {
        try {
            const rentalStatusData = await getRentalStatisticStatus();
            setRentalStatus(rentalStatusData);
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
        fetchDataCharRevenue();
    }, [selectedMonthRevenue, selectedYearRevenue]);

    useEffect(() => {
        fetchRevenueGeneralData();
        fetchDataCharRevenue();
        fetchUserStatusStatistic();
        handleFetchOrderStatus();
        handleFetchRentalStatus();
        fetchUserPaymentStatistic();
    }, []);

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

    const convertTextColor = (text) => {
        if (text === "Đã giao") return "text-green-600";
        if (text === "Đã hủy") return "text-red-600";
        if (text === "Đang xử lí") return "text-yellow-500";
        if (text === "Chưa thanh toán") return "text-orange-500";
        if (text === "Đang giao") return "text-purple-600";
        return "text-blue-600";
    };

    return (
        <div className="flex flex-col gap-4 mt-8 px-4">
            <div className="flex justify-around">
                <div className="border rounded bg-white  flex flex-col  py-2 px-4 border-primary">
                    <h1 className=" font-bold border-b border-primary py-2 text-primary px-12">
                        Tổng số người dùng
                    </h1>
                    <div className="flex flex-col gap-2 px-2">
                        <div className="flex gap-4 justify-between text-lg">
                            <div className="flex gap-2 items-center text-blue-600">
                                <p>{<Icons.MdOutlineClearAll />}</p>
                                <p>Tổng số</p>
                            </div>
                            <p>
                                {Object.values(userStatus).reduce(
                                    (sum, curr) => (sum += curr),
                                    0
                                )}{" "}
                                người
                            </p>
                        </div>
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
                <div className="border rounded bg-white  flex flex-col  py-2 px-4 border-primary">
                    <h1 className=" font-bold border-b border-primary py-2 text-primary px-12">
                        Tổng số đơn mua
                    </h1>
                    <div className="flex flex-col gap-2 px-2">
                        <div className="flex gap-4 justify-between text-lg">
                            <div className="flex gap-2 items-center text-blue-600">
                                <p>{<Icons.MdOutlineClearAll />}</p>
                                <p>Tổng số</p>
                            </div>
                            <p>
                                {Object.values(orderStatus).reduce(
                                    (sum, curr) => (sum += curr),
                                    0
                                )}{" "}
                                đơn
                            </p>
                        </div>
                        {Object.entries(orderStatus)?.map(
                            ([status, number]) => (
                                <div className="flex gap-4 justify-between text-lg">
                                    <p
                                        className={convertTextColor(
                                            convertVI(status)
                                        )}
                                    >
                                        {convertVI(status)}
                                    </p>
                                    <p>{number}</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div className="border rounded bg-white  flex flex-col  py-2 px-4 border-primary">
                    <h1 className=" font-bold border-b border-primary py-2 text-primary px-12">
                        Tổng số đơn thuê
                    </h1>
                    <div className="flex flex-col gap-2 px-2">
                        <div className="flex gap-4 justify-between text-lg">
                            <div className="flex gap-2 items-center text-blue-600">
                                <p>{<Icons.MdOutlineClearAll />}</p>
                                <p>Tổng số</p>
                            </div>
                            <p>
                                {Object.values(rentalStatus).reduce(
                                    (sum, curr) => (sum += curr),
                                    0
                                )}{" "}
                                đơn
                            </p>
                        </div>
                        {Object.entries(rentalStatus)?.map(
                            ([status, number]) => (
                                <div className="flex gap-4 justify-between text-lg">
                                    <p
                                        className={convertTextColor(
                                            convertVI(status)
                                        )}
                                    >
                                        {convertVI(status)}
                                    </p>
                                    <p>{number}</p>
                                </div>
                            )
                        )}
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
            <div className="flex gap-2 bg-white px-4 py-2 rounded w-full">
                <div className="flex flex-col gap-2 border w-4/5">
                    <div className="flex justify-between">
                        <h1 className="text-3xl text-primary font-bold px-2">
                            Doanh thu
                        </h1>
                        <div className="flex justify-end my-4 gap-4">
                            <select
                                className="border rounded px-2 py-1"
                                value={selectedMonthRevenue}
                                onChange={(e) =>
                                    setSelectedMonthRevenue(
                                        parseInt(e.target.value)
                                    )
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
                                value={selectedYearRevenue}
                                onChange={(e) =>
                                    setSelectedYearRevenue(
                                        parseInt(e.target.value)
                                    )
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

                    <div className="w-full h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                width={500}
                                height={300}
                                data={dataCharRevenue}
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
                                    dataKey="revenue"
                                    fill="#8884d8"
                                    activeBar={
                                        <Rectangle fill="pink" stroke="blue" />
                                    }
                                />
                                <Bar
                                    dataKey="order"
                                    fill="#82ca9d"
                                    activeBar={
                                        <Rectangle
                                            fill="gold"
                                            stroke="purple"
                                        />
                                    }
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="px-2 border-l w-1/5">
                    <div className="flex flex-col gap-2">
                        <p className="font-bold text-primary flex gap-2 items-center">
                            <span>Tất cả</span>
                            <span className=" text-blue-600">
                                {formatMoney(
                                    Object.values(revenueGeneralData)?.reduce(
                                        (sum, value) => (sum += value?.revenue),
                                        0
                                    )
                                )}
                                {" vnđ"}
                            </span>
                        </p>
                        <p className="flex gap-1 items-center text-blue-600 justify-end font-bold">
                            <span>
                                {Object.values(revenueGeneralData)?.reduce(
                                    (sum, value) => (sum += value?.count),
                                    0
                                )}
                            </span>
                            <span>đơn</span>
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex gap-2 items-center">
                            <Icons.LiaCalendarDaySolid
                                size={30}
                                color="green"
                            />
                            <div>
                                <div className="text-gray-500">Hôm nay</div>
                                <div>
                                    {revenueGeneralData?.today?.count} đơn
                                </div>
                                <div>
                                    {formatMoney(
                                        revenueGeneralData?.today?.revenue
                                    )}{" "}
                                    vnđ
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Icons.LiaCalendarDaySolid
                                size={30}
                                color="orange"
                            />
                            <div>
                                <div className="text-gray-500">Hôm qua</div>
                                <div>
                                    {revenueGeneralData?.yesterday?.count} đơn
                                </div>
                                <div>
                                    {formatMoney(
                                        revenueGeneralData?.yesterday?.revenue
                                    )}{" "}
                                    vnđ
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Icons.FaCalendarWeek size={30} color="blue" />
                            <div>
                                <div className="text-gray-500">Tuần này</div>
                                <div>
                                    {revenueGeneralData?.thisWeek?.count} đơn
                                </div>
                                <div>
                                    {formatMoney(
                                        revenueGeneralData?.thisWeek?.revenue
                                    )}{" "}
                                    vnđ
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Icons.MdCalendarMonth
                                size={30}
                                className="text-primary"
                            />
                            <div>
                                <div className="text-gray-500">Tháng này</div>
                                <div>
                                    {revenueGeneralData?.thisMonth?.count} đơn
                                </div>
                                <div>
                                    {formatMoney(
                                        revenueGeneralData?.thisMonth?.revenue
                                    )}{" "}
                                    vnđ
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Icons.MdSelectAll size={30} color="green" />
                            <div>
                                <div className="text-gray-500">Năm này</div>
                                <div>
                                    {revenueGeneralData?.thisYear?.count} đơn
                                </div>
                                <div>
                                    {formatMoney(
                                        revenueGeneralData?.thisYear?.revenue
                                    )}{" "}
                                    vnđ
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
