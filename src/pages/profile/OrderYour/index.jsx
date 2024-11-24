import React from 'react';

const TabButton = ({ text, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`py-2 px-4 border-none rounded text-base cursor-pointer transition-all duration-300 ease-in-out ${
                active ? 'text-blue-500' : 'text-gray-800 hover:text-blue-500'
            }`}
        >
            {text}
        </button>
    );
};

const ProductItem = ({ image, title, quantity, price }) => {
    return (
        <div className="flex gap-4 items-center w-full border-b border-gray-200 py-4">
            <img
                src={image}
                alt="Product"
                className="w-[10vw] max-w-[80px] h-auto rounded-lg object-cover border border-gray-100"
            />
            <div className="flex-1 min-w-[200px]">
                <p className="text-sm font-bold text-gray-800 mb-1 leading-tight">{title}</p>
                <p className="text-xs text-gray-600">Số lượng: {quantity}</p>
            </div>
            <p className="text-lg font-bold text-red-500">{price}</p>
        </div>
    );
};

const OrderYour = () => {
    return (
        <div className="max-w-[90%] mx-auto bg-white shadow-lg overflow-hidden my-5">
            <div className="flex flex-wrap justify-start bg-gray-100 py-2 px-4 gap-2 border-b border-gray-200">
                {['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Đang giao hàng', 'Hủy đơn hàng', 'Đơn hàng thành công'].map(
                    (tab, index) => (
                        <TabButton key={index} text={tab} active={index === 3} />
                    )
                )}
            </div>

            <div className="flex flex-wrap gap-4 p-4">
                <div className="w-full bg-gray-50 p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-lg text-gray-800">HongThom</span>
                        <div className="flex gap-2">
                            <button className="py-2 px-4 border border-gray-300 rounded text-sm bg-white text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition duration-300 ease-in-out">
                                Nhắn tin
                            </button>
                            <button className="py-2 px-4 border border-gray-300 rounded text-sm bg-white text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition duration-300 ease-in-out">
                                Xem Shop
                            </button>
                        </div>
                    </div>
                    <div className="py-2 text-sm font-semibold text-gray-700 bg-gray-50">
                        Trạng thái: <span className="text-orange-600 font-bold">Đang giao hàng</span>
                    </div>
                </div>

                <ProductItem
                    image="https://via.placeholder.com/80"
                    title="Khẩu trang 5d xám, Khẩu trang 5d xịn xò, 100 chiếc giá sale, chuyên khẩu trang 5d"
                    quantity={2}
                    price="90.000 đ"
                />

                <div className="flex justify-between items-center bg-gray-100 py-4 px-4 border-t border-gray-200">
                    <p className="text-xl font-bold text-gray-800">
                        Thành tiền: <span className="text-red-500">205.000 đ</span>
                    </p>
                    <div className="flex gap-4">
                        <button className="py-2 px-6 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200 ease-in-out transform hover:scale-105">
                            Mua lại
                        </button>
                        <button className="py-2 px-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 ease-in-out transform hover:scale-105">
                            Liên hệ người bán
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderYour;
