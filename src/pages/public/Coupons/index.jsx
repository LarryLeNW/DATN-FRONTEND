import { Button, notification } from "antd";
import { getVouchers } from "apis/voucher.api";
import withBaseComponent from "hocs";
import moment from "moment";
import { useEffect, useState } from "react";
import { saveVoucherRequest } from "store/slicers/voucher.slicer";

function Coupons({ dispatch, checkLoginBeforeAction }) {
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

    const [demoVouchers, setDemoVouchers] = useState([]);

    useEffect(() => {
        const fetchVoucher = async () => {
            const res = await getVouchers();
            setDemoVouchers(res?.result?.content);
        };
        fetchVoucher();
    }, []);

    const handleSaveVoucher = (codeVoucher) => {
        dispatch(
            saveVoucherRequest({
                codeVoucher,
                onSuccess: () => {
                    notification.success({
                        message: "Lưu khuyến mãi thành công.",
                        duration: 2,
                    });
                },
                onError: (message) => {
                    notification.error({
                        message,
                        duration: 2,
                    });
                },
            })
        );
    };

    return (
        <div>
            <h1>
                Trang demo hiển thị danh sách khuyến mãi mọi người làm tiếp nhé
            </h1>
            <div className="flex gap-2 items-center justify-center">
                {demoVouchers.map((v) => (
                    <div key={v.id} className="border p-2 rounded-md">
                        <div>Mã khuyến mãi: {v.code}</div>
                        <div>Tên khuyến mãi: {v.name}</div>
                        <div>Loại khuyến mãi: {v.voucher_category}</div>
                        <div>Giá trị khuyến mãi: {v.value}</div>
                        <div>
                            Ngày kết thúc:{" "}
                            {moment(v.expiry_date).format("DD-MM-YYYY")}
                        </div>
                        <div>
                            Số lần sử dụng: {v.usageCount}/{v.usage_limit}
                        </div>
                        <Button
                            onClick={() =>
                                checkLoginBeforeAction(() =>
                                    handleSaveVoucher(v.code)
                                )
                            }
                        >
                            Save
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default withBaseComponent(Coupons);
