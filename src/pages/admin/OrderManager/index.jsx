import { Modal, notification, Pagination, Tooltip } from "antd";
import Button from "components/Button";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import Icons from "utils/icons";
import { getOrders } from "apis/order.api";


function OrderManager() {
    const dispatch = useDispatch();

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState(""); // Trạng thái lọc

    // Hàm lấy danh sách đơn hàng với filterStatus
    const fetchOrders = async () => {
        dispatch(changeLoading());
        try {
            const params = {
                limit,
                page,
                status: filterStatus // Sử dụng filterStatus trong tham số gọi API
            };
            const res = await getOrders(params);
            setOrders(res?.result?.content || []); // Cập nhật orders với dữ liệu mới từ API
            setTotalPages(res?.result?.totalPages || 0);
            setTotalElements(res?.result?.totalElements || 0);
        } catch (error) {
            notification.error({ message: error.message || "Lỗi khi lấy đơn hàng", duration: 2 });
        }
        dispatch(changeLoading());
    };

    // Gọi lại fetchOrders khi page, limit, hoặc filterStatus thay đổi
    useEffect(() => {
        fetchOrders();
    }, [page, limit, filterStatus]);

    // Hàm thay đổi trạng thái lọc khi nhấn vào tab
    const handleStatusFilter = (status) => {
        setFilterStatus(status);
        setPage(1); // Đặt lại trang về 1 khi đổi trạng thái
    };

    return (
        <div className="w-full p-4 flex flex-col overflow-auto min-h-full">
            {/* Tabs trạng thái */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => handleStatusFilter("")}
                    className={`py-2 px-4 ${filterStatus === "" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 border-b-2 border-transparent"} hover:text-blue-600`}
                >
                    Tất cả
                </button>
                <button
                    onClick={() => handleStatusFilter("PENDING")}
                    className={`py-2 px-4 ${filterStatus === "PENDING" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 border-b-2 border-transparent"} hover:text-blue-600`}
                >
                    Chờ xác nhận
                </button>
                <button
                    onClick={() => handleStatusFilter("CONFIRMED")}
                    className={`py-2 px-4 ${filterStatus === "CONFIRMED" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 border-b-2 border-transparent"} hover:text-blue-600`}
                >
                    Đã xác nhận
                </button>
                <button
                    onClick={() => handleStatusFilter("SHIPPING")}
                    className={`py-2 px-4 ${filterStatus === "SHIPPING" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 border-b-2 border-transparent"} hover:text-blue-600`}
                >
                    Đang giao hàng
                </button>
                <button
                    onClick={() => handleStatusFilter("CANCELLED")}
                    className={`py-2 px-4 ${filterStatus === "CANCELLED" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 border-b-2 border-transparent"} hover:text-blue-600`}
                >
                    Hủy đơn hàng
                </button>
                <button
                    onClick={() => handleStatusFilter("COMPLETED")}
                    className={`py-2 px-4 ${filterStatus === "COMPLETED" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 border-b-2 border-transparent"} hover:text-blue-600`}
                >
                    Đơn hàng thành công
                </button>
            </div>

            {/* Bảng hiển thị đơn hàng */}
            <table className="table-auto rounded p-2 bg-slate-50 mb-1 text-left w-full border-separate transition-all duration-300 ease-in">
                <thead className="font-bold bg-light text-white text-[13px] text-center border border-blue-300">
                    <tr>
                        <th className="px-2 py-2">STT</th>
                        <th className="px-2 py-2">Username</th>
                        <th className="px-2 py-2">Address</th>
                        <th className="px-2 py-2">Created At</th>
                        <th className="px-2 py-2">Status</th>
                        <th className="px-2 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((item, index) => (
                        <Tooltip
                            key={item.id}
                            title={
                                item.orderDetails[0]?.sku?.images ? (
                                    <img
                                        src={item.orderDetails[0].sku.images.split(',')[0]}
                                        alt={item.orderDetails[0].productName}
                                        className="w-[240px] h-auto rounded"
                                    />
                                ) : (
                                    <span>No images available</span>
                                )
                            }
                            placement="top"
                        >
                            <tr className="relative">
                                <td className="px-2 py-1 border border-slate-500 text-center text-lg font-bold">{index + 1}</td>
                                <td className="px-2 py-1 border border-slate-500 text-lg font-bold">{item.delivery.username}</td>
                                <td className="px-2 py-1 border border-slate-500 text-lg font-bold">{item.delivery.address}</td>
                                <td className="px-2 py-1 border border-slate-500 text-lg font-bold text-center">
                                    {item.createdAt ? moment(item.createdAt).format("DD/MM/YYYY HH:mm") : "N/A"}
                                </td>
                                <td className="px-2 py-1 border border-slate-500 text-lg font-bold">{item.status}</td>
                                <td className="px-2 py-1 border border-slate-500 text-lg font-bold text-center">
                                    <Button name="Xác nhận đơn" style="border rounded bg-blue-600 cursor-pointer px-4 py-2 text-white text-sm" iconBefore={<Icons.FaEdit />} />
                                    <Button name="Delete" style="border rounded bg-red-600 cursor-pointer px-4 py-2 text-white text-sm" iconBefore={<Icons.MdDeleteForever />} />
                                </td>
                            </tr>
                        </Tooltip>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex w-full justify-end p-2">
                <Pagination
                    listLimit={[10, 25, 40, 100]}
                    limitCurrent={limit}
                    setLimit={setLimit}
                    totalPages={totalPages}
                    setPage={setPage}
                    pageCurrent={page}
                    totalElements={totalElements}
                />
            </div>
        </div>
    );
}

export default OrderManager;
