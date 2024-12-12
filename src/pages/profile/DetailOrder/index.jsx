import { notification, Table } from "antd";
import { getOrderById } from "apis/order.api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { convertStatusOrder } from "utils/covertDataUI";
import { formatMoney } from "utils/helper";

function DetailOrder() {
    const [detailOrder, setDetailOrder] = useState({
        isLoading: false,
        data: null,
    });
    const params = useParams();

    useEffect(() => {
        const fetchDetailOrder = async () => {
            setDetailOrder((prev) => ({ ...prev, isLoading: true }));
            try {
                const res = await getOrderById(params.id);
                setDetailOrder((prev) => ({ ...prev, data: res.result }));
            } catch (error) {
                notification.warning({
                    message: error.message,
                    duration: 1,
                    placement: "top",
                });
            }
            setDetailOrder((prev) => ({ ...prev, isLoading: false }));
        };
        if (params.id) fetchDetailOrder();
    }, []);

    const columns = [
        {
            title: "Sản phẩm",
            dataIndex: "product",
            key: "product",
            render: (text, record) => (
                <div className="flex gap-2">
                    <div className=" border relative p-2 rounded">
                        <img
                            src={record.sku.images.split(",")[0]}
                            alt=""
                            className="object-contain w-24 h-24"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="font-bold">{record.productName}</p>
                        <img
                            src={
                                "https://salt.tikicdn.com/ts/ta/b1/3f/4e/cc3d0a2dd751a7b06dd97d868d6afa56.png"
                            }
                            className="w-40 h-6 object-cover"
                            alt="img refund"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (text, record) => (
                <div>{formatMoney(record.sku.price)}đ</div>
            ),
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            render: (text, record) => <div>{record.quantity}</div>,
        },
        {
            title: "Tạm tính",
            dataIndex: "price-quantity",
            key: "price-quantity",
            render: (text, record) => (
                <div className="text-nowrap">
                    {formatMoney(record.price * record.quantity)}đ
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-2 ">
            <div className="text-lg ">
                <span>Chi tiết đơn hàng #{detailOrder.data?.orderCode} -</span>{" "}
                <span
                    className={`font-bold  ${
                        convertStatusOrder(detailOrder.data?.status)?.textColor
                    }`}
                >
                    {convertStatusOrder(detailOrder.data?.status)?.text}
                </span>
            </div>
            <div className="text-end">Ngày đặt hàng: 09:55 27/11/2024</div>
            <div className="flex gap-4 mt-2">
                <div className="flex flex-col gap-2 flex-1">
                    <p className="font-bold">ĐỊA CHỈ NGƯỜI NHẬN</p>
                    <div className="p-4 bg-white min-h-[150px]">
                        <p className="font-bold">
                            {detailOrder.data?.delivery?.username}
                        </p>
                        <p>
                            <span>Địa chỉ: </span>
                            <span>
                                {detailOrder.data?.delivery?.street}
                                {detailOrder.data?.delivery?.ward && (
                                    <span>
                                        , {detailOrder.data?.delivery?.ward}
                                    </span>
                                )}
                                {detailOrder.data?.delivery?.district && (
                                    <span>
                                        , {detailOrder.data?.delivery?.district}
                                    </span>
                                )}
                                {detailOrder.data?.delivery?.city && (
                                    <span>
                                        , {detailOrder.data?.delivery?.city}
                                    </span>
                                )}
                            </span>
                        </p>
                        <p>
                            Điện thoại:{" "}
                            {detailOrder.data?.delivery?.numberPhone}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <p className="font-bold">HÌNH THỨC GIAO HÀNG</p>
                    <div className="p-4 bg-white min-h-[150px]">
                        <p className="font-bold">Giao hàng tiết kiệm</p>
                        <p>Giao thứ 6, trước 19h, 29/11</p>
                        <p>Được giao bởi Fashion Shop</p>
                        <p>Phí vận chuyển: 17.700đ</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <p className="font-bold">HÌNH THỨC THANH TOÁN</p>
                    <div className="p-4 bg-white min-h-[150px]">
                        {detailOrder.data?.payment?.method == "COD"
                            ? "Thanh toán bằng tiền mặt"
                            : "Thanh toán bằng Zalo Pay"}
                    </div>
                </div>
            </div>
            <div className="bg-white p-4 rounded">
                <Table
                    columns={columns}
                    dataSource={detailOrder.data?.orderDetails}
                />
                <div className="mt-2 flex items-end gap-2 flex-col">
                    <div className="flex gap-4">
                        <p className="text-slate-600">Tạm tính</p>
                        <p>
                            {formatMoney(
                                detailOrder.data?.total_amount +
                                    detailOrder.data?.discountValue
                            )}
                            đ
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <p className="text-slate-600">Giảm</p>
                        <p className="text-green-500">
                            -{formatMoney(detailOrder.data?.discountValue || 0)}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <p className="text-slate-600">Tổng cộng</p>
                        <p className="text-red-500 font-bold">
                            {formatMoney(detailOrder.data?.total_amount)}đ
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailOrder;
