
import { Select } from "antd";
import { getAllStatusOrder, getOrderById } from "apis/order.api";
import Button from "components/Button";
import paths from "constant/paths";
import moment from "moment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { formatCurrency } from "utils/formatCurrency";
import Icons from "utils/icons";

function OrderDetailManager() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm();
    const [order, setOrder] = useState(null)
    const [statusOrder, setStatusOrder] = useState([])
    const [selectedStatusOrder, setSelectedStatusOrder] = useState(null);

    const fetchOrderDetail = async () => {
        try {
            const res = await getOrderById(orderId);
            console.log(orderId);
            setOrder(res?.result);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết bài viết:", error);
        }
    };

    const getStatusOrder = async () => {
        try {
            const res = await getAllStatusOrder();
            setStatusOrder(res)
            console.log(res);


        } catch (error) {
            console.error("Lỗi khi lấy chi tiết bài viết:", error);
        }
    }


    useEffect(() => {
        fetchOrderDetail();
        getStatusOrder();
        setSelectedStatusOrder(order?.status);
    }, [orderId, order?.status]);


    return (
        <div >
            <div className="grid grid-cols-10">
                <div className="col-span-7">
                    {order && (
                        <div className="p-6 bg-gray-100 min-h-screen">
                            <a href="#" className="text-gray-500 mb-4 inline-flex items-center" onClick={() => navigate(paths.ADMIN.ORDER_MANAGEMENT)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Quay lại
                            </a>
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="text-2xl font-bold">Đơn hàng #{order?.id}</h1>
                            </div>
                            <p className="text-gray-500 mb-6">Thời gian: {order?.createdAt ? moment(order.createdAt).format("DD/MM/YYYY HH:mm") : "N/A"}
                            </p>
                            {order?.orderDetails.map((orderDetails, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-6">
                                    <h2 className="font-semibold text-lg mb-4">Sản phẩm</h2>
                                    <div className="flex items-center space-x-4">
                                        {/* Hiển thị hình ảnh - tách từng URL và hiển thị */}
                                        <div className="flex space-x-2">
                                            {/* {orderDetails?.sku?.images?.split(",").map((image, idx) => (
                                        <img
                                            key={idx}
                                            src={image}
                                            alt={`Product ${orderDetails.productName}`}
                                            className="w-20 h-20 rounded-md object-cover"
                                        />
                                    ))} */}
                                            <img
                                                src={orderDetails?.sku?.images?.split(",")[0]} // Lấy ảnh đầu tiên
                                                alt={`Product ${orderDetails.productName}`}
                                                className="w-20 h-20 rounded-md object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">{orderDetails?.productName}</p>

                                            <p className="text-gray-600">Kích thước: {orderDetails?.sku?.attributes?.size}</p>
                                            <p className="text-gray-600">Màu sắc: {orderDetails?.sku?.attributes?.color}</p>

                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-gray-700">{formatCurrency(orderDetails?.sku?.price)} </span>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            ))}
                            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                                <h2 className="font-semibold text-lg mb-4">Đơn hàng</h2>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Tổng</span>
                                        <span className="text-lg text-red-600">{formatCurrency(order?.total_amount)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Giảm giá</span>
                                        <span>0 đ</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Vận chuyển</span>
                                        <span>25.000 đ</span>
                                    </div>
                                    {/* Phương thức thanh toán */}
                                    <div className="flex justify-between text-gray-700">
                                        <span>Phương thức thanh toán</span>
                                        <span className="font-medium text-blue-600">
                                            {order?.payment?.method === "CreditCard" && "Thanh toán bằng thẻ tín dụng"}
                                            {order?.payment?.method === "PayPal" && "Thanh toán bằng PayPal"}
                                            {order?.payment?.method === "COD" && "Thanh toán bằng tiền mặt"}                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                                <h2 className="font-semibold text-lg mb-4">Vận chuyển</h2>

                                <div className="flex items-center space-x-3">
                                    <div className="text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M4 6h16M5 8h14M3 12h18M5 16h14m-14 4h14" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-700">Giao hàng nhanh</p>
                                        <p className="text-gray-500 text-sm">25.000 đ | 1-2 days</p>
                                    </div>
                                </div>

                                <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Thông tin giao hàng:</h2>
                                    <p>Tên người nhận : {order?.delivery?.username} </p>
                                    <p>Giao hàng đến : {order?.delivery?.address} </p>
                                    <p>SDT : {order?.delivery?.numberPhone} </p>
                                    <p>Ghi Chú : {order?.delivery?.note} </p>
                                </div>

                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <h2 className="font-semibold text-lg mb-4">Khách hàng</h2>
                                <div className="flex items-center space-x-3">
                                    <img src="https://via.placeholder.com/50" alt="Customer Avatar" className="w-12 h-12 rounded-full" />
                                    <div>
                                        <p className="text-gray-700 font-medium">{order?.user?.username}</p>
                                        <p className="text-gray-500 text-sm">10 Đơn đặt hàng trước đó</p>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2 text-gray-700">
                                    <p><strong>Email:</strong> {order?.user?.email}</p>
                                    <p><strong>Phone:</strong> {order?.user?.phone_number}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-span-3">
                    <div>
                        <div className="px-2 py-4 rounded flex flex-col space-y-4">
                            <label
                                htmlFor="category"
                                className="text-lg font-bold text-nowrap text-black"
                            >
                                Trạng thái:
                            </label>
                            <Select
                                id="status"
                                title="status"
                                allowClear
                                className={`w-full text-lg font-bold ${errors["category"]
                                    ? "shadow-md shadow-red-500 rounded-lg text-red-500"
                                    : ""
                                    }`}
                                value={selectedStatusOrder}
                                options={statusOrder?.map((el) => ({
                                    label: el,
                                    value: el,
                                }))}
                                onChange={(value) => setSelectedStatusOrder(value)}
                            />
                            <div className="mt-auto">
                                <Button
                                    name={"Xác nhận"}
                                    style="border rounded bg-blue-600 cursor-pointer px-4 py-2 text-white text-sm"
                                    // handleClick={() =>
                                    //     handleDelete(item?.blogId)
                                    // }
                                    iconBefore={<Icons.GiConfirmed />}
                                />
                            </div>
                        </div>

                    </div>
                    <div class="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg max-w-sm mx-auto">
                        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Trạng thái đơn hàng</h2>
                        <div class="w-full border-l-2 border-indigo-500 relative">
                            <div class="ml-6 mb-6 flex items-center">
                                <div class="w-4 h-4 bg-green-500 rounded-full border-2 border-green-500 -ml-8"></div>
                                <div class="ml-4">
                                    <p class="text-sm text-gray-600">Chờ xác nhận</p>
                                    <p class="text-xs text-gray-500">2024-11-14</p>
                                </div>
                            </div>
                            <div class="ml-6 mb-6 flex items-center">
                                <div class="w-4 h-4 bg-green-500 rounded-full border-2 border-green-500 -ml-8"></div>
                                <div class="ml-4">
                                    <p class="text-sm text-gray-600">Xác nhận</p>
                                    <p class="text-xs text-gray-500">2024-11-15</p>
                                </div>
                            </div>
                            <div class="ml-6 mb-6 flex items-center">
                                <div class="w-4 h-4 bg-green-500 rounded-full border-2 border-green-500 -ml-8"></div>
                                <div class="ml-4">
                                    <p class="text-sm text-gray-600">Giao Hàng</p>
                                    <p class="text-xs text-gray-500">2024-11-16</p>
                                </div>
                            </div>
                            <div class="ml-6 mb-6 flex items-center">
                                <div class="w-4 h-4 bg-gray-300 rounded-full border-2 border-gray-300 -ml-8"></div>
                                <div class="ml-4">
                                    <p class="text-sm text-gray-400">Đơn hàng thành công</p>
                                    <p class="text-xs text-gray-400">Pending</p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>


        </div>
    )
}
export default OrderDetailManager;