
const OrderSuccess = () => {

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md text-center ">
            <div className="text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2l4 -4m0 -6a9 9 0 11-6.627 15.91A9 9 0 0112 3z" />
                </svg>
            </div>
            <h1 className="text-2xl font-semibold mt-4 text-gray-800">Thanh toán thành công!</h1>
            <p className="text-gray-600 mt-2">Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.</p>
            <div className="bg-gray-50 p-4 mt-4 rounded-lg text-left">
                <h2 className="text-gray-800 font-medium">Thông tin đơn hàng</h2>
                <p className="text-gray-600 mt-2"><span className="font-semibold">Mã đơn hàng:</span> #123456</p>
                <p className="text-gray-600 mt-2"><span className="font-semibold">Ngày:</span> 12/12/2024</p>
                <p className="text-gray-600 mt-2"><span className="font-semibold">Tổng cộng:</span> 1.500.000 VND</p>
                <p className="text-gray-600 mt-2"><span className="font-semibold">Giao hàng đến:</span> 123 Đường ABC, Quận XYZ, Thành phố Hồ Chí Minh</p>
            </div>
            <button className="bg-blue-500 text-white px-6 py-2 mt-6 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300 focus:outline-none">
                Xem đơn hàng
            </button>
            <button className="bg-gray-300 mr-5 text-gray-700 px-6 py-2 mt-3 rounded-lg hover:bg-gray-400 focus:ring focus:ring-gray-200 focus:outline-none">
                Tiếp tục mua sắm
            </button>
        </div>
    )

}
export default OrderSuccess;