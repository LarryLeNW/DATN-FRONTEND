import React from 'react';
import './Orders.css';

const OrderSummary = () => {
    return (
        <div className="order-summary">
            <div className="tabs">
                <button className="tab active">Tất cả</button>
                <button className="tab">Chờ xác nhận</button>
                <button className="tab">Đã xác nhận</button>
                <button className="tab">Đang giao hàng</button>
                <button className="tab">Hủy đơn hàng</button>
                <button className="tab">Đơn hàng thành công</button>
                <button className="tab">Đơn hàng thất bại</button>
                <button className="tab">Trả hàng</button>
            </div>

            <div className="order-detail">
                <div className="shop-info">
                    <span className="shop-name">HongThom</span>
                    <div className="action-buttons">
                        <button className="message-btn">Nhắn tin</button>
                        <button className="view-shop-btn">Xem Shop</button>
                    </div>

                    <div className="order-status">
                        <p>Trạng thái: <span className="status-label">Đang giao hàng</span></p>
                    </div>
                </div>

                <div className="order-item">
                    <img
                        src="https://via.placeholder.com/80"
                        alt="Product"
                        className="product-image"
                    />
                    <div className="product-info">
                        <p className="product-name">
                            Khẩu trang 5d xám, Khẩu trang 5d xịn xò, 100 chiếc giá sale, chuyên
                            khẩu trang 5d
                        </p>
                        <p className="product-quantity">Số lượng: 2</p>
                    </div>
                    <p className="product-price">90.000 đ</p>
                </div>
                <div className="order-summary-footer">
                    <p className="total-amount">
                        Thành tiền: <span>205.000 đ</span>
                    </p>
                    <div className="footer-buttons">
                        <button className="buy-again-btn">Mua lại</button>
                        <button className="contact-seller-btn">Liên hệ người bán</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
