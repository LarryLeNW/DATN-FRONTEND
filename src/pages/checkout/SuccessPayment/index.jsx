import { notification, Skeleton } from "antd";
import { getOneOrderByCode } from "apis/order.api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "assets/logo.png";
import logo1 from "assets/images/logo.jpg";
import paths from "constant/paths";
import { formatMoney, trunCateText } from "utils/helper";

function SuccessPayment() {
    const params = useParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState({
        isLoading: false,
        data: null,
    });

    useEffect(() => {
        const fetchOrder = async () => {
            setOrderData((prev) => ({ ...prev, isLoading: true }));
            try {
                const res = await getOneOrderByCode(params?.order_code);
                setOrderData((prev) => ({ ...prev, data: res.result }));
            } catch (error) {
                notification.warning({
                    message: "Không tìm thấy thông tin đơn hàng...",
                    duration: 1,
                    placement: "top",
                });
                navigate(paths.HOME);
            }
            setOrderData((prev) => ({ ...prev, isLoading: false }));
        };

        if (params?.order_code) fetchOrder();
    }, []);
    const products = [
        {
            id: 1,
            name: "Áo Thun",
            price: 200000,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 2,
            name: "Quần Jean",
            price: 400000,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 3,
            name: "Giày Sneaker",
            price: 800000,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 4,
            name: "Mũ Lưỡi Trai",
            price: 150000,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 4,
            name: "Mũ Lưỡi Trai",
            price: 150000,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 4,
            name: "Mũ Lưỡi Trai",
            price: 150000,
            image: "https://via.placeholder.com/150",
        },
        {
            id: 4,
            name: "Mũ Lưỡi Trai",
            price: 150000,
            image: "https://via.placeholder.com/150",
        },
    ];
    return (
        <div className="bg-gray-100 ">
            <div className="p-1 bg-green-400 text-center text-lg text-white font-bold italic">
                Uy tín làm nên thương hiệu
            </div>
            <div className="flex justify-center items-center  bg-white mt-2">
                <div className="grid grid-cols-10 gap-4 max-w-6xl w-full">
                    <div className="col-span-7 px-4 rounded-lg shadow-md ">
                        <div className="text-center mb-2">
                            <div>
                                <img src={logo1} width={90} alt="" />
                            </div>
                            <div>
                                <svg
                                    className="w-12 h-12 mx-auto text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-green-500">
                                Đặt Hàng Thành Công
                            </h2>
                            <p className="text-sm text-gray-500 mt-2">
                                Cảm ơn bạn đã đặt hàng. FashionShop chân thành
                                cảm ơn!
                            </p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm font-medium text-gray-600">
                                Thời gian vận chuyển
                            </p>
                            <p className="text-lg font-semibold text-gray-800">
                                3-5 ngày
                            </p>
                            <p className="text-sm font-medium text-gray-600">
                                Shipping Address
                            </p>
                            <p className="text-lg font-semibold text-gray-800">
                                {orderData.data?.delivery?.street}
                            </p>
                            <p className="text-sm font-medium text-gray-600">
                                Phương thức thanh toán
                            </p>
                            {orderData.isLoading ? (
                                <Skeleton.Input />
                            ) : (
                                <p className="text-lg font-semibold text-gray-800">
                                    {orderData.data?.payment?.method == "COD"
                                        ? "Thanh toán bằng tiền mặt."
                                        : "Thanh toán online"}
                                </p>
                            )}
                            <p className="text-sm font-medium text-gray-600">
                                Tổng tiền
                            </p>
                            {orderData.isLoading ? (
                                <Skeleton.Input />
                            ) : (
                                <p className="text-lg font-semibold text-gray-800">
                                    {formatMoney(orderData.data?.total_amount)}
                                </p>
                            )}
                        </div>
                        <div className="mt-8 text-center">
                            <button
                                type="button"
                                class="text-white bg-blue-300 border border-gray-300 focus:outline-none 
                            hover:bg-blue-700 focus:ring-4 focus:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 
                           "
                                onClick={() => navigate(paths.HOME)}
                            >
                                Quay về trang chủ{" "}
                            </button>
                        </div>
                    </div>
                    <div className="col-span-3 bg-gradient-to-r sm:h-screen sm:sticky sm:top-0 lg:min-w-[370px] sm:min-w-[180px]">
                        <div className="px-4 py-2 bg-gray-100 sm:h-[calc(100vh-80px)] sm:overflow-y-auto">
                            <div className="flex justify-between">
                                <div className="flex gap-2 items-center">
                                    <p className="text-sm font-medium text-gray-600">
                                        Mã đơn hàng
                                    </p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {params?.order_code}
                                    </p>
                                </div>
                                <p className="text-blue-500 font-bold">
                                    Xem đơn hàng
                                </p>
                            </div>
                            {orderData.data?.orderDetails.map((el) => (
                                <div
                                    key={el.id}
                                    className="flex items-start gap-4 mb-4 bg-white p-4"
                                >
                                    <div className="w-28 h-20 flex p-3 shrink-0 bg-gray-300 rounded-md ">
                                        <img
                                            src={el.sku.images.split(",")[0]}
                                            className="w-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-base text-black">
                                            {trunCateText(el.productName, 42)}
                                        </h3>
                                        <ul className=" text-black space-y-2 mt-2">
                                            <li>
                                                Quantity{" "}
                                                <span className="float-right font-bold text-orange-400">
                                                    x{el.quantity}
                                                </span>
                                            </li>
                                            <li>
                                                Total Price{" "}
                                                <span className="float-right font-bold text-blue-500">
                                                    {el.sku.price * el.quantity}{" "}
                                                    VND
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SuccessPayment;
