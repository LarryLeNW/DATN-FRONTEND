import { Modal, notification, Pagination, Tooltip } from "antd";
import Button from "components/Button";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import Icons from "utils/icons";
import { getOrders } from "apis/order.api";
import { Link } from "react-router-dom";

function OrderManager() {
    const dispatch = useDispatch();

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState("");


    const fetchOrders = async () => {
        dispatch(changeLoading());
        try {
            const params = {
                limit,
                page,
                ...(status ? { status } : {})
            };
            const res = await getOrders(params);
            setOrders(res?.result?.content || []);
            setTotalPages(res?.result?.totalPages || 0);
            setTotalElements(res?.result?.totalElements || 0);
        } catch (error) {
            notification.error({ message: error.message || "Lỗi khi lấy đơn hàng", duration: 2 });
        }
        dispatch(changeLoading());
    };

    useEffect(() => {
        fetchOrders();
    }, [limit, page, status]);

    const onTabClick = (newStatus) => {
        setStatus(newStatus);
        setPage(1);
    };

    return (
        <div className="w-full p-4 flex flex-col overflow-auto min-h-full">
            {/* Tabs trạng thái */}
            <div className="flex border-b border-gray-200">
                <button
                    className={`py-2 px-4 ${status === "" ? " border-blue-600 border-b-2 text-gray-600" : "text-gray-600 border-b-2 border-transparent"}`}
                    onClick={() => onTabClick()}
                >
                    All
                </button>
                <button
                    className={`py-2 px-4 ${status === "UNPAID" ? " border-blue-600 border-b-2 text-red-700" : "text-blue-600 border-b-2 border-transparent"}`}
                    onClick={() => onTabClick("UNPAID")}
                >
                    UNPAID
                </button>
                <button
                    className={`py-2 px-4 ${status === "PENDING" ? " border-blue-600 border-b-2 text-yellow-600" : "text-yellow-600 border-b-2 border-transparent"}`}
                    onClick={() => onTabClick("PENDING")}
                >
                    PENDING
                </button>
                <button
                    className={`py-2 px-4 ${status === "CONFIRMED" ? "text-blue-600 border-b-2 border-blue-600" : "text-blue-600 border-b-2 border-transparent"}`}
                    onClick={() => onTabClick("CONFIRMED")}
                >
                    CONFIRMED
                </button>
                <button
                    className={`py-2 px-4 ${status === "SHIPPED" ? "text-green-600 border-b-2 border-blue-600" : "text-green-600 border-b-2 border-transparent"}`}
                    onClick={() => onTabClick("SHIPPED")}
                >
                    SHIPPED
                </button>
                <button
                    className={`py-2 px-4 ${status === "CANCELLED" ? "text-red-500 border-b-2 border-blue-600" : "text-red-500 border-b-2 border-transparent"}`}
                    onClick={() => onTabClick("CANCELLED")}
                >
                    CANCELLED
                </button>
                <button
                    className={`py-2 px-4 ${status === "DELIVERED" ? "text-green-300 border-b-2 border-blue-600" : " text-green-300 border-b-2 border-transparent"}`}
                    onClick={() => onTabClick("DELIVERED")}
                >
                    DELIVERED
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
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="mt-10 text-center py-4 text-gray-500 font-semibold">
                                Không có đơn hàng nào
                            </td>

                        </tr>
                    ) : (
                        orders.map((item, index) => (
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
                                    <td className="px-2 py-1 border border-slate-500 text-lg font-bold">{item?.delivery?.username}</td>
                                    <td className="px-2 py-1 border border-slate-500 text-lg font-bold">{item?.delivery?.address}</td>
                                    <td className="px-2 py-1 border border-slate-500 text-lg font-bold text-center">
                                        {item.createdAt ? moment(item.createdAt).format("DD/MM/YYYY HH:mm") : "N/A"}
                                    </td>
                                    <td
                                        className={`px-2 py-1 border border-slate-500 text-lg font-bold 
                                ${item.status === 'UNPAID' ? 'bg-red-700' : ''}
                                ${item.status === 'PENDING' ? 'bg-yellow-400' : ''}
                                ${item.status === 'CONFIRMED' ? 'bg-blue-500 text-white' : ''}
                                ${item.status === 'SHIPPED' ? 'bg-green-500 text-white' : ''}
                                ${item.status === 'CANCELLED' ? 'bg-red-400 text-white' : ''}
                                ${item.status === 'DELIVERED' ? 'bg-green-300' : ''}`}
                                    >
                                        {item.status}
                                    </td>
                                    <td className="px-2 py-1 border border-slate-500 text-lg font-bold text-center">
                                        <Link
                                            iconBefore={<Icons.FaEdit />}
                                            to={`/admin/order-management/${item.id}`}
                                            className="border rounded bg-blue-400 cursor-pointer px-4 py-2 text-white text-sm"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </td>
                                </tr>
                            </Tooltip>
                        ))
                    )}
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
