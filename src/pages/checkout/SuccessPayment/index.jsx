import { notification } from "antd";
import { getOneOrderByCode } from "apis/order.api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "assets/logo.png";
import logo1 from "assets/images/logo.jpg";
import paths from "constant/paths";

function SuccessPayment() {
    const params = useParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState({
        isLoading: false,
        data: null,
    });

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await getOneOrderByCode(params?.order_code);
                console.log("🚀 ~ fetchOrder ~ res:", res);
            } catch (error) {
                notification.warning({
                    message: "Không tìm thấy thông tin đơn hàng...",
                    duration: 1,
                    placement: "top",
                });
                navigate(paths.HOME);
            }
        };

        if (params?.order_code) fetchOrder();
    }, []);
    const products = [
        { id: 1, name: "Áo Thun", price: 200000, image: "https://via.placeholder.com/150" },
        { id: 2, name: "Quần Jean", price: 400000, image: "https://via.placeholder.com/150" },
        { id: 3, name: "Giày Sneaker", price: 800000, image: "https://via.placeholder.com/150" },
        { id: 4, name: "Mũ Lưỡi Trai", price: 150000, image: "https://via.placeholder.com/150" },
        { id: 4, name: "Mũ Lưỡi Trai", price: 150000, image: "https://via.placeholder.com/150" },
        { id: 4, name: "Mũ Lưỡi Trai", price: 150000, image: "https://via.placeholder.com/150" },
        { id: 4, name: "Mũ Lưỡi Trai", price: 150000, image: "https://via.placeholder.com/150" },
    ];
    return (
        <div>
            <div className="p-1 bg-green-400 text-center text-lg text-white font-bold italic">
                Uy tín làm nên thương hiệu
            </div>
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="grid grid-cols-10 gap-4 max-w-6xl w-full">
                    <div className="col-span-7 p-10 rounded-lg shadow-md ">
                        <div className="text-center mb-6">
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
                            <h2 className="text-2xl font-semibold text-green-500">Đặt Hàng Thành Công</h2>
                            <p className="text-sm text-gray-500 mt-2">Cảm ơn bạn đã đặt hàng. FashionShop chân thành cảm ơn!</p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm font-medium text-gray-600">Mã đơn hàng</p>
                            <p className="text-lg font-semibold text-gray-800">{params?.order_code}</p>
                            <p className="text-sm font-medium text-gray-600">Thời gian vận chuyển</p>
                            <p className="text-lg font-semibold text-gray-800">3-5 ngày</p>
                            <p className="text-sm font-medium text-gray-600">Shipping Address</p>
                            <p className="text-lg font-semibold text-gray-800">123 Main Street, City, State, Zip</p>
                            <p className="text-sm font-medium text-gray-600">Phương thức thanh toán</p>
                            <p className="text-lg font-semibold text-gray-800">Thanh toán bằng tiền mặt</p>
                            <p className="text-sm font-medium text-gray-600">Tổng tiền</p>
                            <p className="text-lg font-semibold text-gray-800">450.000 VND</p>
                        </div>
                        <div className="mt-8 text-center">
                            <button type="button" class="text-gray-900 bg-blue-300 border border-gray-300 focus:outline-none 
                            hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 
                           ">Quay về trang chủ </button>

                        </div>
                    </div>
                    <div className="col-span-3 bg-gradient-to-r sm:h-screen sm:sticky sm:top-0 lg:min-w-[270px] sm:min-w-[180px]">
                        <span className="text-center">Sản phẩm của bạn</span>
                        <div className="px-4 py-10 bg-gray-100 sm:h-[calc(100vh-80px)] sm:overflow-y-auto">
                            {products.map(({ id, name, price, image }) => (
                                <div key={id} className="flex items-start gap-4 mb-4">
                                    <div className="w-32 h-28 flex p-3 shrink-0 bg-gray-300 rounded-md">
                                        <img src={image} className="w-full object-contain" />
                                    </div>
                                    <div>
                                        <h3 className="text-base text-black">{name}</h3>
                                        <ul className="text-xs text-black space-y-2 mt-2">
                                            <li>Size <span className="float-right">37</span></li>
                                            <li>Quantity <span className="float-right">2</span></li>
                                            <li>Total Price <span className="float-right">{price} VND</span></li>
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-2">
                            <h4 className=" text-black">Total : <span className="ml-auto">450.000 VND</span></h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SuccessPayment;
