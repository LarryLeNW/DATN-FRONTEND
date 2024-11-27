import { notification } from "antd";
import { getOneOrderByCode } from "apis/order.api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "assets/logo.png";
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

    return (
        <div>
            <div className="p-1 bg-green-400 text-center text-lg text-white font-bold italic">
                Uy tín làm nên thương hiệu
            </div>
            <div className="flex justify-center items-center gap-4">
                <div></div>
                <div></div>
            </div>
            <span>SuccessPayment {params?.order_code}</span>
        </div>
    );
}

export default SuccessPayment;
