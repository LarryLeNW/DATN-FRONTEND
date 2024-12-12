
import {
    Modal,
    notification, Select
} from "antd";
import { Option } from "antd/es/mentions";
import { deleteOrderDetail, getAllStatusOrder, getOrderById, updateOrder } from "apis/order.api";
import Button from "components/Button";
import paths from "constant/paths";
import useDebounce from "hooks/useDebounce";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { changeLoading } from "store/slicers/common.slicer";
import { formatCurrency } from "utils/formatCurrency";
import { fillUniqueATTSkus } from "utils/helper";
import Icons from "utils/icons";
import ShowProductInOrder from "./ShowProductInOrder";

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
    const dispatch = useDispatch();
    const [order, setOrder] = useState(null);
    const [quantity, setQuantity] = useState([]);
    const quantityDebounce = useDebounce(quantity, 600);
    const [statusOrder, setStatusOrder] = useState([]);
    const [selectedStatusOrder, setSelectedStatusOrder] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { productList } = useSelector((state) => state.product);
    const statusColors = {
        "UNPAID": "bg-red-300",
        "PENDING": "bg-indigo-500",
        "CONFIRMED": "bg-blue-500",
        "SHIPPED": "bg-yellow-500",
        "CANCELLED": "bg-red-500",
        "DELIVERED": "bg-green-500"
    };

    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        console.log('Clicked OK');
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        console.log('Clicked Cancel');
        setIsModalVisible(false);
    };

    const handleDelete = async (id) => {
        dispatch(changeLoading());
        try {
            await deleteOrderDetail(id)
            notification.success({ message: "Xóa thành công Sản phẩm!" });
            fetchOrderDetail();
        } catch (error) {
            console.log(error);
        }
        dispatch(changeLoading());
    }
    const fetchOrderDetail = async () => {
        try {
            const res = await getOrderById(orderId);
            const quantities = res?.result?.orderDetails.map((item) => item.quantity);
            setQuantity(quantities);
            setOrder(res?.result);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        }
    };
    const getStatusOrder = async () => {
        try {
            const res = await getAllStatusOrder();
            setStatusOrder(res);
        } catch (error) {
            console.error("Lỗi khi lấy trạng thái đơn hàng:", error);
        }
    };

    const handleUpdateStatus = useCallback(async () => {
        dispatch(changeLoading());
        try {
            if (orderId && selectedStatusOrder) {
                const requestData = { status: selectedStatusOrder };
                await updateOrder(orderId, requestData);
                notification.success({ message: "Cập nhật trạng thái thành công!" });
                setOrder((prevOrder) => ({ ...prevOrder, status: selectedStatusOrder }));
            }
        } catch (error) {
            notification.error({ message: "Cập nhật trạng thái thất bại!" });
        }
        dispatch(changeLoading());
    }, [orderId, selectedStatusOrder]);

    const updateQuantity = (index, newQuantity) => {
        dispatch(changeLoading());
        if (newQuantity < 1) {
            notification.error({ message: "Số lượng phải lớn hơn 0" });
            return;
        }
        setOrder((prevOrder) => {
            const updatedOrderDetails = [...prevOrder.orderDetails];
            updatedOrderDetails[index].quantity = newQuantity;

            return {
                ...prevOrder,
                orderDetails: updatedOrderDetails,
            };
        });
        handleUpdateOrderDetails(index, newQuantity);
        dispatch(changeLoading());

    };

    const handleUpdateOrderDetails = async (index, newQuantity) => {
        dispatch(changeLoading());

        try {
            const updatedOrderDetails = order.orderDetails.map((detail, idx) => {
                if (!detail.id || !detail.product?.id || !detail.sku?.id) {
                    notification.error({ message: "Không tìm thấy orderdetail" });
                }
                return {
                    id: detail?.id,
                    productId: detail?.product?.id,
                    skuid: detail?.sku?.id,
                    quantity: idx === index ? newQuantity : detail?.quantity,
                };
            });
            console.log(updatedOrderDetails);

            const payload = {
                totalAmount: order?.total_amount,
                status: order?.status,
                deliveryId: order?.delivery?.id,
                orderDetails: updatedOrderDetails,
            };

            await updateOrder(orderId, payload);
            notification.success({ message: "Cập nhật đơn hàng thành công!" });
            fetchOrderDetail();
        } catch (error) {
            console.error("Lỗi cập nhật đơn hàng:", error.message);
            notification.error({ message: error.message || "Cập nhật đơn hàng thất bại!" });
        }
        dispatch(changeLoading());

    };
    const handleChangeAtt = (key, value, index) => {
        dispatch(changeLoading());

        const updatedOrderDetails = [...order.orderDetails];
        const matchingSku = updatedOrderDetails[index]?.product?.skus.find((sku) =>
            Object.entries({ ...updatedOrderDetails[index]?.sku?.attributes, [key]: value }).every(
                ([attrKey, attrValue]) => sku.attributes[attrKey] === attrValue
            )
        );
        if (matchingSku) {
            updatedOrderDetails[index].sku = matchingSku;
            setOrder((prevOrder) => ({
                ...prevOrder,
                orderDetails: updatedOrderDetails,
            }));
            handleUpdateOrderDetails(index);
        } else {
            notification.error({ message: "Không tìm thấy SKU phù hợp" });
        }
        dispatch(changeLoading());

    };
    useEffect(() => {
        fetchOrderDetail();
        getStatusOrder();
    }, [orderId]);

    useEffect(() => {
        if (order) {
            setSelectedStatusOrder(order.status);
        }
    }, [order]);

    return (
        <div >
            <div className="grid grid-cols-10">

                <div className="col-span-7">
                    {order && (
                        <div className="p-6 min-h-screen">
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
                            <div className="flex items-end">
                                {order?.status === "PENDING" && (
                                    <button
                                        type="bu=tton"
                                        className="ml-auto text-white bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                        onClick={showModal}
                                    >
                                        Thêm sản phẩm
                                    </button>
                                )}
                                <Modal
                                    title="Basic Modal"
                                    visible={isModalVisible}
                                    onOk={handleOk}
                                    onCancel={handleCancel}
                                    width="70%"
                                >
                                    <ShowProductInOrder />

                                </Modal>
                            </div>
                            {order?.orderDetails.map((orderDetails, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-6">
                                    <h2 className="font-semibold text-lg mb-4">Sản phẩm</h2>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex space-x-2">

                                            <img
                                                src={orderDetails?.sku?.images?.split(",")[0]}
                                                alt={`Product ${orderDetails.productName}`}
                                                className="w-20 h-20 rounded-md object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">{orderDetails?.productName}</p>
                                            <div>
                                                <div className="flex gap-4 mt-4">
                                                    {fillUniqueATTSkus(orderDetails?.product?.skus, "color").length > 1 && (
                                                        <div className="flex gap-2">
                                                            <span className="font-bold text-lg text-nowrap">Color :</span>
                                                            <Select
                                                                className="min-w-20"
                                                                defaultValue={orderDetails?.sku?.attributes["color"]}
                                                                onChange={(value) => handleChangeAtt("color", value, index)}
                                                                disabled={order?.status !== "PENDING"}

                                                            >
                                                                {fillUniqueATTSkus(orderDetails?.product.skus, "color").map((el, idx) => (
                                                                    <Option key={idx} value={el.attributes.color}>
                                                                        {el.attributes.color}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </div>
                                                    )}
                                                    {fillUniqueATTSkus(orderDetails?.product?.skus, "size").length > 1 && (
                                                        <div className="flex gap-2">
                                                            <span className="font-bold text-lg text-nowrap">Size :</span>
                                                            <Select
                                                                className="min-w-20"
                                                                defaultValue={orderDetails?.sku?.attributes["size"]}
                                                                disabled={order?.status !== "PENDING"}
                                                                onChange={(value) => handleChangeAtt("size", value, index)}
                                                            >
                                                                {fillUniqueATTSkus(orderDetails?.product.skus, "size").map((el, idx) => (
                                                                    <Option key={idx} value={el.attributes.size}>
                                                                        {el.attributes.size}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col gap-4 items-end justify-end">
                                                        <div className="flex items-center border border-gray-300 rounded-md">
                                                            <button
                                                                className="px-2"
                                                                disabled={order?.status !== "PENDING"}
                                                                onClick={() => updateQuantity(index, quantity[index] - 1)}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="w-2.5 fill-current"
                                                                    viewBox="0 0 124 124"
                                                                >
                                                                    <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z" />
                                                                </svg>
                                                            </button>
                                                            <input
                                                                className="p-2 text-gray-800 text-xs outline-none bg-transparent w-14"
                                                                type="number"
                                                                value={quantity[index]}
                                                                onChange={(e) => {
                                                                    updateQuantity(index, Number(e.target.value))
                                                                }
                                                                }
                                                                disabled={order?.status !== "PENDING"}
                                                            />
                                                            <button
                                                                className="px-2"
                                                                disabled={order?.status !== "PENDING"}
                                                                onClick={() => updateQuantity(index, quantity[index] + 1)}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="w-2.5 fill-current"
                                                                    viewBox="0 0 42 42"
                                                                >
                                                                    <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <h4 className="text-base font-bold text-gray-600">
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                {formatCurrency(orderDetails?.sku?.price * quantity[index])}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end ">
                                        <div className="mt-auto">
                                            <div className="mt-auto">
                                                <Button
                                                    name={""}
                                                    style={`border rounded-full bg-red-600 px-4 py-2 text-white text-xl ${order?.status !== "PENDING" ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                                    disabled={order?.status !== "PENDING"}
                                                    handleClick={() => handleDelete(orderDetails?.id)}
                                                    iconBefore={<Icons.MdDeleteForever />}
                                                />
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
                                    handleClick={handleUpdateStatus}
                                    iconBefore={<Icons.GiConfirmed />}
                                />
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg max-w-sm mx-auto">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Trạng thái đơn hàng</h2>
                        <div className="w-full border-l-2 border-indigo-500 relative">
                            {statusOrder.map((statusItem, idx) => {
                                const isActive = order?.status === statusItem;

                                return (
                                    <div key={statusItem} className="ml-6 mb-6 flex items-center">
                                        <div
                                            className={`w-4 h-4 rounded-full border-2 -ml-8 ${isActive ? statusColors[statusItem] : 'bg-gray-200'}`}
                                        ></div>
                                        <div className="ml-4">
                                            <p className={`text-sm ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>{statusItem}</p>
                                            <p className={`text-xs ${isActive ? 'text-gray-500' : 'text-gray-400'}`}>{isActive ? 'Đang xử lý' : 'Chưa xử lý'}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}
export default OrderDetailManager;