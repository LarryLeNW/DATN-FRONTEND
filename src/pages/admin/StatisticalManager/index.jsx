import React, { useState } from "react";
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

// Đăng ký Chart.js
ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function StatisticalManager() {
  // Dữ liệu cho biểu đồ theo tháng
  const allData = {
    labels: [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ],
    datasets: [
      {
        type: "line",
        label: "Doanh thu ($)",
        data: [1200, 1900, 3000, 5000, 2500, 4000, 3500, 2700, 4500, 5200, 6100, 7000],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        yAxisID: "y1", // Trục phụ
      },
      {
        type: "bar",
        label: "Khách hàng",
        data: [50, 70, 100, 150, 200, 250, 300, 280, 320, 400, 450, 500],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        yAxisID: "y", // Trục chính
      },
      {
        type: "bar",
        label: "Số đơn hàng",
        data: [30, 40, 60, 80, 120, 150, 200, 190, 250, 300, 350, 400],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        yAxisID: "y", // Trục chính
      },
    ],
  };

  // State để lưu tháng được chọn
  const [selectedMonth, setSelectedMonth] = useState("Tất cả");

  // Cập nhật biểu đồ khi thay đổi tháng
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Lọc dữ liệu cho tháng được chọn
  const filteredData = selectedMonth === "Tất cả"
    ? allData
    : {
        labels: [selectedMonth],
        datasets: allData.datasets.map(dataset => ({
          ...dataset,
          data: [dataset.data[allData.labels.indexOf(selectedMonth)]],
        })),
      };

  // Cấu hình biểu đồ
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left", // Trục y chính
      },
      y1: {
        type: "linear",
        display: true,
        position: "right", // Trục y phụ
        grid: {
          drawOnChartArea: false, // Không vẽ lưới cho trục này
        },
      },
    },
  };

  return (
    <div>
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Thống Kê</h1>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-gray-700 font-semibold">Doanh thu</h2>
            <p className="text-2xl font-bold text-green-500 mt-2">$12,345</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-gray-700 font-semibold">Khách hàng</h2>
            <p className="text-2xl font-bold text-blue-500 mt-2">1,234</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-gray-700 font-semibold">Đơn hàng</h2>
            <p className="text-2xl font-bold text-purple-500 mt-2">567</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-gray-700 font-semibold">Chi phí</h2>
            <p className="text-2xl font-bold text-red-500 mt-2">$8,123</p>
          </div>
        </div>

        {/* Mục lọc theo tháng */}
        <div className="mb-6">
          <label htmlFor="month" className="text-gray-700 font-semibold">Chọn tháng:</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="ml-2 p-2 border border-gray-300 rounded"
          >
            <option value="Tất cả">Tất cả</option>
            {allData.labels.map((month, index) => (
              <option key={index} value={month}>{month}</option>
            ))}
          </select>
        </div>

        {/* Biểu đồ */}
        <div className="flex justify-center items-center mb-6">
          <div className="bg-white p-10 rounded-lg shadow w-full h-[800px]">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Biểu đồ Thống Kê Tổng Hợp</h2>
              <div className="h-full">
                <Bar data={filteredData} options={options} />
              </div>
          </div>
      </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Danh sách đơn hàng</h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-200 p-2">Mã ĐH</th>
                <th className="border border-gray-200 p-2">Khách hàng</th>
                <th className="border border-gray-200 p-2">Tổng tiền</th>
                <th className="border border-gray-200 p-2">Ngày</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 p-2">#001</td>
                <td className="border border-gray-200 p-2">Nguyễn Văn A</td>
                <td className="border border-gray-200 p-2">$123</td>
                <td className="border border-gray-200 p-2">2024-11-14</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-2">#002</td>
                <td className="border border-gray-200 p-2">Trần Thị B</td>
                <td className="border border-gray-200 p-2">$456</td>
                <td className="border border-gray-200 p-2">2024-11-13</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default StatisticalManager;
