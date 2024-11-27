import React from "react";
import { Button } from "antd";
import moment from "moment";
import img1 from "assets/images/bannerblack1.jpg"
import img2 from "assets/images/bannerblack2.jpg"
function Coupons() {
    const data = [
        {
            id: 1,
            shopName: "Nhà Sách Thanh Xuân",
            logo: "https://blog2024.theciu.vn/wp-content/uploads/2021/01/D981349C-9C90-4A0D-BD54-297D5DD23032.jpeg",
            voucher_category: "KH mới của shop",
            discount: "Giảm 20K",
            condition: "Cho đơn hàng từ 1 triệu",
            expiry_date: "2025-03-29T22:30:00",
        },
        {
            id: 2,
            shopName: "Sống Official",
            logo: "https://dongphuchaianh.vn/wp-content/uploads/2022/09/quan-ao-phong-cach-Han-Quoc-nu-cong-so.jpeg",
            voucher_category: "Voucher giảm giá",
            discount: "Giảm 50K",
            condition: "Cho đơn hàng từ 1.2 triệu",
            expiry_date: "2024-12-31T22:30:00",
        },
        {
            id: 3,
            shopName: "Nhà Sách Lao Động",
            logo: "https://dongphuchaianh.vn/wp-content/uploads/2022/09/quan-ao-phong-cach-Han-Quoc-nu-cong-so.jpeg",
            voucher_category: "Ưu đãi đặc biệt",
            discount: "Giảm 10% tối đa 35K",
            condition: "Số lượng có hạn",
            expiry_date: "2027-09-07T22:30:00",
        },
        {
            id: 4,
            shopName: "Phương Đông Books",
            logo: "https://dongphuchaianh.vn/wp-content/uploads/2022/09/quan-ao-phong-cach-Han-Quoc-nu-cong-so.jpeg",
            voucher_category: "Khuyến mãi hấp dẫn",
            discount: "Giảm 5K",
            condition: "Cho đơn hàng từ 399K",
            expiry_date: "2025-07-31T22:30:00",
        },
        {
            id: 5,
            shopName: "Shop 5",
            logo: "https://dongphuchaianh.vn/wp-content/uploads/2022/09/quan-ao-phong-cach-Han-Quoc-nu-cong-so.jpeg",
            voucher_category: "Voucher mới",
            discount: "Giảm 100K",
            condition: "Cho đơn hàng từ 500K",
            expiry_date: "2025-06-30T22:30:00",
        },
        {
            id: 6,
            shopName: "Shop 6",
            logo: "https://dongphuchaianh.vn/wp-content/uploads/2022/09/quan-ao-phong-cach-Han-Quoc-nu-cong-so.jpeg",
            voucher_category: "Khuyến mãi đặc biệt",
            discount: "Giảm 200K",
            condition: "Cho đơn hàng từ 1 triệu",
            expiry_date: "2024-12-15T22:30:00",
        }
    ];

    const paydayStyle = {
        backgroundColor: "#000000",
        color: "#fff",
        padding: "30px 20px",
        borderRadius: "0",
        textAlign: "center",
        marginTop: "0",
        boxShadow: "none",
        width: "100%",
        position: "relative",
    };

    const paydayTitleStyle = {
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "15px",
        textTransform: "uppercase",
        fontFamily: "'Roboto', sans-serif",
        letterSpacing: "1px",
    };

    const paydaySubtitleStyle = {
        fontSize: "16px",
        lineHeight: "1.4",
        marginBottom: "10px",
        fontFamily: "'Roboto', sans-serif",
    };

    const paydayHighlightStyle = {
        color: "#FFD700",
        fontWeight: "bold",
        fontSize: "16px",
        textDecoration: "underline",
    };

    return (
        <div className="p-10 bg-gray-100 flex flex-col items-center w-full">
            <img
                src={img1}
                alt="Banner"
                height={200}
                className="w-full h-[450px] "
            />
            <div className="bg-white rounded-xl w-11/12 max-w-6xl shadow-xl p-6 mt-5">
                <div className="flex flex-wrap justify-between gap-5">
                    {data.map((coupon) => (
                        <div
                            key={coupon.id}
                            className="bg-white rounded-lg p-5 flex items-center shadow-md w-full md:w-[calc(50%-10px)] transition-transform transform hover:scale-105"
                        >
                            <div className="flex-shrink-0 mr-4">
                                <img
                                    src={coupon.logo}
                                    alt="Shop logo"
                                    className="rounded-lg w-16 h-16"
                                />
                            </div>
                            <div className="flex-grow">
                                <div className="text-blue-600 font-bold text-sm mb-2">
                                    {coupon.voucher_category}
                                </div>
                                <div className="text-orange-500 font-bold text-lg mb-2">
                                    {coupon.discount}
                                </div>
                                <div className="text-gray-600 text-sm">{coupon.condition}</div>
                                <div className="text-gray-400 text-xs mt-2">
                                    HSD: {moment(coupon.expiry_date).format("DD/MM/YYYY")}
                                </div>
                            </div>
                            <Button
                                className="bg-orange-500 text-white rounded-md text-sm px-4 py-2 hover:bg-orange-400 transition-colors"
                            >
                                Lưu
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="bg-black text-white text-center py-8 mt-10">
                    <div className="text-2xl font-bold uppercase mb-4 tracking-wide">
                        PAYDAY ĐỘC QUYỀN
                    </div>
                    <div className="text-lg leading-6 mb-3">
                        Chào đón ưu đãi{" "}
                        <span className="text-yellow-400 font-bold underline">
                            giảm ít nhất 25%
                        </span>{" "}
                        ngay hôm nay!
                    </div>
                    <div className="text-lg leading-6">
                        Tận hưởng các deal hấp dẫn dưới{" "}
                        <span className="text-yellow-400 font-bold underline">199K</span>, chỉ có
                        tại đây.
                    </div>
                    <div className="flex justify-between gap-4 mt-6">
                        <img
                            src="https://img.pikbest.com/01/60/85/11npIkbEsTATm.jpg!w700wp"
                            alt="Deal Icon 1"
                            className="w-1/2 rounded-lg object-cover h-80"
                        />
                        <img
                            src="https://img.pikbest.com/01/60/85/11npIkbEsTATm.jpg!w700wp"
                            alt="Deal Icon 2"
                            className="w-1/2 rounded-lg object-cover h-80"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap justify-between gap-5">
                    {data.map((coupon) => (
                        <div
                            key={coupon.id}
                            className="bg-white rounded-lg p-5 flex items-center shadow-md w-full md:w-[calc(50%-10px)] transition-transform transform hover:scale-105"
                        >
                            <div className="flex-shrink-0 mr-4">
                                <img
                                    src={coupon.logo}
                                    alt="Shop logo"
                                    className="rounded-lg w-16 h-16"
                                />
                            </div>
                            <div className="flex-grow">
                                <div className="text-blue-600 font-bold text-sm mb-2">
                                    {coupon.voucher_category}
                                </div>
                                <div className="text-orange-500 font-bold text-lg mb-2">
                                    {coupon.discount}
                                </div>
                                <div className="text-gray-600 text-sm">{coupon.condition}</div>
                                <div className="text-gray-400 text-xs mt-2">
                                    HSD: {moment(coupon.expiry_date).format("DD/MM/YYYY")}
                                </div>
                            </div>
                            <Button
                                className="bg-orange-500 text-white rounded-md text-sm px-4 py-2 hover:bg-orange-400 transition-colors"
                            >
                                Lưu
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Coupons;