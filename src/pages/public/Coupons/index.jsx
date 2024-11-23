import React from "react";
import { Button } from "antd";
import moment from "moment";

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
        },
        {
            id: 7,
            shopName: "Shop 7",
            logo: "https://dongphuchaianh.vn/wp-content/uploads/2022/09/quan-ao-phong-cach-Han-Quoc-nu-cong-so.jpeg",
            voucher_category: "Mua 1 tặng 1",
            discount: "Giảm 50%",
            condition: "Áp dụng cho sản phẩm chọn lọc",
            expiry_date: "2024-11-30T22:30:00",
        },
        {
            id: 8,
            shopName: "Shop 8",
            logo: "https://dongphuchaianh.vn/wp-content/uploads/2022/09/quan-ao-phong-cach-Han-Quoc-nu-cong-so.jpeg",
            voucher_category: "Giảm giá cuối tuần",
            discount: "Giảm 30% cho đơn hàng từ 500K",
            condition: "Chỉ áp dụng vào cuối tuần",
            expiry_date: "2024-12-01T22:30:00",
        },
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
        <div
            style={{
                padding: "40px",
                backgroundColor: "#f4f4f9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <div
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "15px",
                    width: "85%",
                    maxWidth: "1200px",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                    padding: "30px",
                }}
            >
                <div
                    style={{
                        backgroundImage:
                            "url('https://img.freepik.com/free-vector/black-friday-super-sale-with-realistic-3d-label_1361-4017.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "200px",
                        borderRadius: "15px",
                        marginBottom: "25px",
                    }}
                ></div>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        gap: "20px",
                    }}
                >
                    {data.map((coupon) => (
                        <div
                            key={coupon.id}
                            style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "12px",
                                padding: "20px",
                                display: "flex",
                                alignItems: "center",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                width: "calc(50% - 10px)",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            }}
                        >
                            <div style={{ flexShrink: 0, marginRight: "15px" }}>
                                <img
                                    src={coupon.logo}
                                    alt="Shop logo"
                                    style={{ borderRadius: "8px", width: "60px", height: "60px" }}
                                />
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <div
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        color: "#007BFF",
                                        marginBottom: "5px",
                                    }}
                                >
                                    {coupon.voucher_category}
                                </div>
                                <div
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                        margin: "5px 0",
                                        color: "#FF5733",
                                    }}
                                >
                                    {coupon.discount}
                                </div>
                                <div style={{ fontSize: "14px", color: "#666" }}>{coupon.condition}</div>
                                <div style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}>
                                    HSD: {moment(coupon.expiry_date).format("DD/MM/YYYY")}
                                </div>
                            </div>
                            <Button
                                style={{
                                    backgroundColor: "#FF5733",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    fontSize: "14px",
                                    padding: "8px 20px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E84320")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FF5733")}
                            >
                                Lưu
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Payday Exclusive Section */}
                <div style={paydayStyle}>
                    <div style={paydayTitleStyle}>PAYDAY ĐỘC QUYỀN</div>
                    <div style={paydaySubtitleStyle}>
                        Chào đón ưu đãi <span style={paydayHighlightStyle}>giảm ít nhất 25%</span> ngay hôm nay!
                    </div>
                    <div style={paydaySubtitleStyle}>
                        Tận hưởng các deal hấp dẫn dưới <span style={paydayHighlightStyle}>199K</span>, chỉ có tại đây.
                    </div>

                    {/* 2 images/icons in a row */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "10px",
                            marginTop: "20px",
                            width: "100%",
                        }}
                    >
                        <img
                            src="https://img.pikbest.com/01/60/85/11npIkbEsTATm.jpg!w700wp"
                            alt="Deal Icon 1"
                            style={{ width: "48%", borderRadius: "8px", height: "400px", objectFit: "cover" }}
                        />
                        <img
                            src="https://img.pikbest.com/01/60/85/11npIkbEsTATm.jpg!w700wp"
                            alt="Deal Icon 2"
                            style={{ width: "48%", borderRadius: "8px", height: "400px", objectFit: "cover" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Coupons;
