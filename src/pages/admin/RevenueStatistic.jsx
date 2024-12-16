import { notification } from "antd";
import {
    getOrderStatisticDaily,
    getOrderStatisticStatus,
    getOrderStatisticTotal,
} from "apis/order.api";
import {
    getPaymentDailyStatistics,
    getPaymentStatistics,
} from "apis/revenue.api";
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
    Rectangle,
} from "recharts";
import { formatMoney } from "utils/helper";

function RevenueStatistic() {
    const [dataGeneral, setDataGeneral] = useState({});
    const [dataChar, setDataChar] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const fetchDaily = async () => {
        try {
            const dataChar = await getPaymentDailyStatistics(
                selectedMonth,
                selectedYear
            );

            const chartData = Object.entries(dataChar || {}).map((value) => ({
                name: `Ngày ${value[0]}`,
                revenue: value[1]?.revenue,
                order: value[1]?.count,
            }));

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
            const dataGeneral = await getPaymentStatistics();
            setDataGeneral(dataGeneral);
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
                Thống kê doanh thu
            </h1>

            <div className="flex justify-around gap-2">
                <div className="border rounded bg-white px-24 py-2 flex flex-col justify-center border-primary items-center">
                    <h1 className="text-primary font-bold">
                        Doanh thu từ trước đến giờ
                    </h1>
                    <p className="font-bold text-1xl mx-auto text-blue-600">
                        {formatMoney(dataGeneral?.allTime?.revenue) || 0} vnđ
                    </p>
                    <p className="font-bold text-1xl mx-auto text-orange-600">
                        {formatMoney(dataGeneral?.allTime?.count) || 0} đơn
                    </p>
                </div>
                <div className="border rounded bg-white px-16 py-2 flex flex-col justify-center border-primary items-center">
                    <h1 className="text-primary font-bold">Hôm nay</h1>
                    <p className="font-bold text-1xl mx-auto text-blue-600">
                        {formatMoney(dataGeneral?.today?.revenue) || 0} vnđ
                    </p>
                    <p className="font-bold text-1xl mx-auto text-orange-600">
                        {formatMoney(dataGeneral?.today?.count) || 0} đơn
                    </p>
                </div>
                <div className="border rounded bg-white px-16 py-2 flex flex-col justify-center border-primary items-center">
                    <h1 className="text-primary font-bold">Hôm qua</h1>
                    <p className="font-bold text-1xl mx-auto text-blue-600">
                        {formatMoney(dataGeneral?.yesterday?.revenue) || 0} vnđ
                    </p>
                    <p className="font-bold text-1xl mx-auto text-orange-600">
                        {formatMoney(dataGeneral?.yesterday?.count) || 0} đơn
                    </p>
                </div>
                <div className="border rounded bg-white px-16 py-2 flex flex-col justify-center border-primary items-center">
                    <h1 className="text-primary font-bold">Tuần này</h1>
                    <p className="font-bold text-1xl mx-auto text-blue-600">
                        {formatMoney(dataGeneral?.thisWeek?.revenue) || 0} vnđ
                    </p>
                    <p className="font-bold text-1xl mx-auto text-orange-600">
                        {formatMoney(dataGeneral?.thisWeek?.count) || 0} đơn
                    </p>
                </div>
                <div className="border rounded bg-white px-16 py-2 flex flex-col justify-center border-primary items-center">
                    <h1 className="text-primary font-bold">Năm này</h1>
                    <p className="font-bold text-1xl mx-auto text-blue-600">
                        {formatMoney(dataGeneral?.thisYear?.revenue) || 0} vnđ
                    </p>
                    <p className="font-bold text-1xl mx-auto text-orange-600">
                        {formatMoney(dataGeneral?.thisYear?.count) || 0} đơn
                    </p>
                </div>
                <div className="border rounded bg-white px-16 py-2 flex flex-col justify-center border-primary items-center">
                    <h1 className="text-primary font-bold">Tháng này</h1>
                    <p className="font-bold text-1xl mx-auto text-blue-600">
                        {formatMoney(dataGeneral?.thisMonth?.revenue) || 0} vnđ
                    </p>
                    <p className="font-bold text-1xl mx-auto text-orange-600">
                        {formatMoney(dataGeneral?.thisMonth?.count) || 0} đơn
                    </p>
                </div>
            </div>

            <div className="h-[60vh] bg-white rounded px-4 py-2 mx-2 mt-auto border border-primary">
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
                            dataKey="revenue"
                            fill="#8884d8"
                            activeBar={<Rectangle fill="pink" stroke="blue" />}
                        />
                        <Bar
                            dataKey="order"
                            fill="#82ca9d"
                            activeBar={
                                <Rectangle fill="gold" stroke="purple" />
                            }
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default RevenueStatistic;
