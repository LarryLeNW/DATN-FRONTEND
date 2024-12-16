import { notification } from "antd";
import {
    getRentalStatisticDaily,
    getRentalStatisticStatus,
    getRentalStatisticTotal,
} from "apis/rental.api";
import { useEffect, useState } from "react";
import React, { PureComponent } from "react";
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

function RentalStatistic() {
    const [dataGeneral, setDataGeneral] = useState({});
    const [totalData, setTotalData] = useState({});
    const [dataChar, setDataChar] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const fetchDaily = async () => {
        try {
            const dataChar = await getRentalStatisticDaily({
                month: selectedMonth,
                year: selectedYear,
            });

            const chartData = Object.entries(dataChar || {}).map(
                ([key, value]) => ({
                    name: `Ngày ${key}`,
                    order: value,
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

    useEffect(() => {
        fetchDaily();
    }, [selectedMonth, selectedYear]);

    const handleFetchGeneral = async () => {
        try {
            const [statusData, totalData, dataChar] = await Promise.all([
                getRentalStatisticStatus(),
                getRentalStatisticTotal(),
                getRentalStatisticDaily({
                    month: selectedMonth,
                    year: selectedYear,
                }),
            ]);
            setDataGeneral(statusData);
            setTotalData(totalData);

            const chartData = Object.entries(dataChar || {}).map(
                ([key, value]) => ({
                    name: `Ngày ${key}`,
                    order: value,
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

    useEffect(() => {
        handleFetchGeneral();
    }, []);

    return (
        <div className="flex justify-center flex-col gap-4">
            <h1 className="mx-auto text-primary my-4 flex text-3xl font-bold">
                Thống kê đơn thuê
            </h1>

            <div className="flex justify-around">
                <div className="border rounded bg-white px-36 py-2 flex flex-col justify-center border-primary">
                    <h1 className="text-primary font-bold">
                        Tất cả đơn đến giờ
                    </h1>
                    <p className="font-bold text-3xl mx-auto">
                        {totalData?.allTime || 0}
                    </p>
                </div>
                <div className="border rounded bg-white px-1 py-2 flex flex-col justify-center">
                    <h1 className="text-orange-500 font-bold">
                        Đơn chưa thanh toán
                    </h1>
                    <p className="font-bold text-3xl mx-auto text-orange-500">
                        {dataGeneral?.UNPAID || 0}
                    </p>
                </div>
                <div className="border rounded bg-white px-1 flex flex-col justify-center py-2">
                    <h1 className="text-yellow-500 font-bold">
                        Đơn đang chờ xử lí
                    </h1>
                    <p className="font-bold text-3xl mx-auto text-yellow-500">
                        {dataGeneral?.PENDING || 0}
                    </p>
                </div>
                <div className="border rounded bg-white px-1 flex flex-col justify-center py-2">
                    <h1 className="text-purple-600 font-bold">Đơn đang ship</h1>
                    <p className="font-bold text-3xl mx-auto text-purple-600">
                        {dataGeneral?.SHIPPED || 0}
                    </p>
                </div>
                <div className="border rounded bg-white px-1 flex flex-col justify-center py-2">
                    <h1 className="text-green-600 font-bold">Đơn Đã giao</h1>
                    <p className="font-bold text-3xl mx-auto text-green-600">
                        {dataGeneral?.DELIVERED || 0}
                    </p>
                </div>
                <div className="border rounded bg-white px-1 flex flex-col justify-center py-2">
                    <h1 className="text-red-600 font-bold">Đơn Đã Hủy</h1>
                    <p className="font-bold text-3xl mx-auto text-red-600">
                        {dataGeneral?.CANCELLED || 0}
                    </p>
                </div>
            </div>

            <div className="flex justify-around">
                <div className="border rounded bg-white px-24 flex flex-col justify-center py-2">
                    <h1 className=" font-bold">Hôm nay</h1>
                    <p className="font-bold text-3xl mx-auto text-primary">
                        {totalData?.today || 0}
                    </p>
                </div>
                <div className="border rounded bg-white px-24 flex flex-col justify-center py-2">
                    <h1 className=" font-bold">Hôm qua</h1>
                    <p className="font-bold text-3xl mx-auto text-primary">
                        {totalData?.yesterday || 0}
                    </p>
                </div>
                <div className="border rounded bg-white px-24 flex flex-col justify-center py-2">
                    <h1 className=" font-bold">Trong tuần này</h1>
                    <p className="font-bold text-3xl mx-auto text-primary">
                        {totalData?.thisWeek || 0}
                    </p>
                </div>
                <div className="border rounded bg-white px-24 flex flex-col justify-center py-2">
                    <h1 className=" font-bold">Trong năm này</h1>
                    <p className="font-bold text-3xl mx-auto text-primary">
                        {totalData?.thisYear || 0}
                    </p>
                </div>
            </div>
            <div className="h-[60vh] bg-white rounded px-4 py-2 mx-2 mt-auto border border-primary">
                {/* <div className="flex justify-end my-4">Lọc theo ngày :</div> */}
                <div>
                    {dataChar && (
                        <div className="text-primary font-bold">
                            Tổng đơn tháng {selectedMonth} năm {selectedYear} là
                            :{" "}
                            {dataChar?.reduce(
                                (sum, prev) => (sum += prev.order),
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
                        <button
                            className="bg-blue-500 text-white px-4 py-1 rounded"
                            onClick={handleFetchGeneral}
                        >
                            Lọc
                        </button>
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
                            dataKey="order"
                            fill="blue"
                            background={{ fill: "#eee" }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default RentalStatistic;
