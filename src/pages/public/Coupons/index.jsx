import { Button } from "antd";
import moment from "moment";

function Coupons() {
    let data = [
        {
            id: 1,
            voucher_category: "SHIPPING",
            code: "Voucher_202445",
            discount_type: "FIXED",
            value: 30000.0,
            name: "NHẪN SALE HOT 2025",
            max_discount: null,
            min_order: null,
            expiry_date: "2024-11-20T22:30:00",
            start_date: "2024-11-20T15:30:00",
            usage_limit: 5,
            usageCount: 0,
            isPublic: true,
            isDestroy: false,
            applyAll: true,
        },
        {
            id: 2,
            voucher_category: "SHIPPING",
            code: "Voucher_202445",
            discount_type: "FIXED",
            value: 30000.0,
            name: "NHẪN SALE HOT 2025",
            max_discount: null,
            min_order: null,
            expiry_date: "2024-11-20T22:30:00",
            start_date: "2024-11-20T15:30:00",
            usage_limit: 5,
            usageCount: 0,
            isPublic: true,
            isDestroy: false,
            applyAll: true,
        },
        {
            id: 3,
            voucher_category: "SHIPPING",
            code: "Voucher_202445",
            discount_type: "FIXED",
            value: 30000.0,
            name: "NHẪN SALE HOT 2025",
            max_discount: null,
            min_order: null,
            expiry_date: "2024-11-20T22:30:00",
            start_date: "2024-11-20T15:30:00",
            usage_limit: 5,
            usageCount: 0,
            isPublic: true,
            isDestroy: false,
            applyAll: true,
        },
        {
            id: 4,
            voucher_category: "SHIPPING",
            code: "Voucher_202445",
            discount_type: "FIXED",
            value: 30000.0,
            name: "NHẪN SALE HOT 2025",
            max_discount: null,
            min_order: null,
            expiry_date: "2024-11-20T22:30:00",
            start_date: "2024-11-20T15:30:00",
            usage_limit: 5,
            usageCount: 0,
            isPublic: true,
            isDestroy: false,
            applyAll: true,
        },
    ];

    return (
        <div>
            <h1>
                Trang demo hiển thị danh sách khuyến mãi mọi người làm tiếp nhé
            </h1>
            <div className="flex gap-2">
                {data.map((coupon) => (
                    <div key={coupon.id} className="border p-2 rounded-md">
                        <div>Mã khuyến mãi: {coupon.code}</div>
                        <div>Tên khuyến mãi: {coupon.name}</div>
                        <div>Loại khuyến mãi: {coupon.voucher_category}</div>
                        <div>Giá trị khuyến mãi: {coupon.value}</div>
                        <div>
                            Ngày kết thúc:{" "}
                            {moment(coupon.expiry_date).format("DD-MM-YYYY")}
                        </div>
                        <div>
                            Số lần sử dụng: {coupon.usageCount}/
                            {coupon.usage_limit}
                        </div>
                        <Button>Save</Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Coupons;
