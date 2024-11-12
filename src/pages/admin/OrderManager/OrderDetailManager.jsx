

function OrderDetailManager() {

    return (
        <div>
            <div className="p-6 bg-gray-100 min-h-screen">
                <a href="#" className="text-gray-500 mb-4 inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Quay lại
                </a>

                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Đơn hàng #49</h1>
                    <div className="text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">Đã xác nhận</div>
                </div>
                <p className="text-gray-500 mb-6">Thời gian: 12/07/2024 16:01:43</p>

                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <h2 className="font-semibold text-lg mb-4">Sản phẩm</h2>
                    <div className="flex items-center space-x-4">
                        <img src="https://via.placeholder.com/80" alt="Product Image" className="w-20 h-20 rounded-md object-cover" />
                        <div>
                            <p>Khẩu trang 5D xám, Khẩu trang 5D xịn xò, 100 chiếc giá sale, chuyên khẩu...</p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-gray-700">90.000 đ</span>
                                <span className="text-gray-700">x 2</span>
                                <span className="text-red-500 font-semibold">180.000 đ</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <h2 className="font-semibold text-lg mb-4">Đơn hàng</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between text-gray-700">
                            <span>Tổng</span>
                            <span>180.000 đ</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                            <span>Giảm giá</span>
                            <span>0 đ</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                            <span>Vận chuyển</span>
                            <span>25.000 đ</span>
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
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="font-semibold text-lg mb-4">Khách hàng</h2>
                    <div className="flex items-center space-x-3">
                        <img src="https://via.placeholder.com/50" alt="Customer Avatar" className="w-12 h-12 rounded-full" />
                        <div>
                            <p className="text-gray-700 font-medium">Vũ Văn Định</p>
                            <p className="text-gray-500 text-sm">10 Đơn đặt hàng trước đó</p>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2 text-gray-700">
                        <p><strong>Email:</strong> vuvandinh203@gmail.com</p>
                        <p><strong>Phone:</strong> (+84) 333583800</p>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default OrderDetailManager;