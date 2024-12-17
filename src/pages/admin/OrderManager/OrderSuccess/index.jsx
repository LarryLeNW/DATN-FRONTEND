import { notification, Skeleton } from "antd";
import { useEffect, useState } from "react";
import paths from "constant/paths";
import { getPaymentByTransId } from "apis/payment";
import moment from "moment";
import { Link } from "react-router-dom";

const OrderSuccess = ({ data, closeModal }) => {

    const [paymentData, setPaymentData] = useState(null); // Sử dụng null thay vì chuỗi rỗng
    const [loading, setLoading] = useState(true); // Thêm state loading

    console.log(paymentData);


    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await getPaymentByTransId(data?.result);
                console.log(res?.result);
                setPaymentData(res?.result);
            } catch (error) {
                notification.warning({
                    message: "Không tìm thấy thông tin đơn hàng...",
                    duration: 1,
                    placement: "top",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [data?.result]);

    if (loading) {
        return (
            <Skeleton active />
        );
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
            <div className="text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4 -4m0 -6a9 9 0 11-6.627 15.91A9 9 0 0112 3z" />
                </svg>
            </div>
            <h1 className="text-2xl font-semibold mt-4 text-gray-800">Thanh toán thành công!</h1>
            <p className="text-gray-600 mt-2">Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.</p>

            <div className="bg-gray-50 p-4 mt-4 rounded-lg text-left space-y-2">
                <h2 className="text-gray-800 font-medium">Thông tin đơn hàng</h2>
                <div className="flex justify-between">
                    <span className="font-semibold">Mã đơn hàng:</span>
                    <span>{paymentData?.order?.orderCode}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Ngày:</span>
                    <span>
                        {paymentData?.createdAt
                            ? moment(paymentData?.createdAt).format("DD/MM/YYYY")
                            : "N/A"}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Giao hàng đến:</span>
                    <span>{`${paymentData?.order.delivery?.street}, ${paymentData?.order.delivery?.ward}, ${paymentData?.order.delivery?.city}`}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Họ và tên:</span>
                    <span>{paymentData?.order.delivery?.username}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">SDT:</span>
                    <span>{paymentData?.order.delivery?.numberPhone}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Tổng cộng:</span>
                    <span>{paymentData?.order?.total_amount}</span>
                </div>
            </div>

            <div className="flex justify-center mt-6 space-x-4">
                <Link
                    to={`/admin/order-management/${paymentData?.order?.id}`}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300 focus:outline-none"                >
                    Xem đơn hàng
                </Link>

                <button onClick={closeModal} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 focus:ring focus:ring-gray-200 focus:outline-none">
                    Tiếp tục mua sắm
                </button>
            </div>
        </div>
    );

}
export default OrderSuccess;
