import React, { useState, useEffect } from "react";
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from 'axios';

// Đăng ký Chart.js
ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function StatisticalManager() {
  const [allData, setAllData] = useState(null); // Dữ liệu từ API
  const [selectedMonth, setSelectedMonth] = useState("Tất cả");
  const [loading, setLoading] = useState(true); // Trạng thái đang tải
  const [error, setError] = useState(null); // Xử lý lỗi

  // Lấy dữ liệu từ API Spring Boot
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/statistics');
        console.log(response.data); // Kiểm tra dữ liệu trả về
        setAllData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error); // Log lỗi
        setError("Lỗi khi tải dữ liệu");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cập nhật giá trị tháng khi chọn
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Lọc dữ liệu theo tháng
  const filteredData = allData && allData.labels && allData.datasets ? 
  (selectedMonth === "Tất cả"
    ? {
        labels: allData.labels,
        datasets: allData.datasets,
      }
    : {
        labels: [selectedMonth],
        datasets: allData.datasets.map(dataset => ({
          ...dataset,
          data: [dataset.data[allData.labels.indexOf(selectedMonth)] || 0],
        })),
      }) : null;

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Cấu hình cho biểu đồ
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
        {/* Các phần thống kê */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-gray-700 font-semibold">Doanh thu</h2>
            <p className="text-2xl font-bold text-green-500 mt-2">{allData ? `$${allData.revenue}` : '$0'}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-gray-700 font-semibold">Khách hàng</h2>
            <p className="text-2xl font-bold text-blue-500 mt-2">{allData ? allData.customers : '0'}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-gray-700 font-semibold">Đơn hàng</h2>
            <p className="text-2xl font-bold text-purple-500 mt-2">{allData ? allData.orders : '0'}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-gray-700 font-semibold">Chi phí</h2>
            <p className="text-2xl font-bold text-red-500 mt-2">{allData ? `$${allData.expenses}` : '$0'}</p>
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
            {allData ? allData.labels.map((month, index) => (
              <option key={index} value={month}>{month}</option>
            )) : null}
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

        {/* Danh sách đơn hàng */}
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
              {allData && allData.ordersData ? allData.ordersData.map((order, index) => (
                <tr key={index}>
                  <td className="border border-gray-200 p-2">{order.orderId}</td>
                  <td className="border border-gray-200 p-2">{order.customer}</td>
                  <td className="border border-gray-200 p-2">{`$${order.totalAmount}`}</td>
                  <td className="border border-gray-200 p-2">{order.date}</td>
                </tr>
              )) : null}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default StatisticalManager;