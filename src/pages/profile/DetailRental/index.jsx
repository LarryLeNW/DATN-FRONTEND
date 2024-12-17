import { notification, Table } from "antd";
import { getRentalById } from "apis/rental.api";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { convertStatusOrder } from "utils/covertDataUI";
import { formatMoney } from "utils/helper";
import Icons from "utils/icons";

function DetailRental() {
    const [detailOrder, setDetailOrder] = useState({
        isLoading: false,
        data: null,
    });
    const params = useParams();

    useEffect(() => {
        const fetchDetailOrder = async () => {
            setDetailOrder((prev) => ({ ...prev, isLoading: true }));
            try {
                const res = await getRentalById(params.id);
                setDetailOrder((prev) => ({ ...prev, data: res.result }));
            } catch (error) {
                notification.warning({
                    message: error.message || "Vui lòng thử lại sau...",
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
            dataIndex: "productName",
            key: "productName",
            render: (value, record) => (
                <div className="flex gap-2">
                    <div className=" border relative p-2 rounded">
                        <img
                            src={record.sku.images.split(",")[0]}
                            alt=""
                            className="object-contain w-24 h-24"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="font-bold text-primary">{value}</p>
                        {record?.endAt && (
                            <div>
                                {moment(new Date(record?.endAt)).format(
                                    "HH:MM:SS DD-MM-YYYY"
                                )}
                            </div>
                        )}
                        <div className="flex gap-4">
                            <p>SL : x{record.quantity}</p>
                            {record.sku?.attributes["color"] && (
                                <p>
                                    <span className="text-gray-500">
                                        Màu :{" "}
                                    </span>
                                    <span className="font-bold">
                                        {record.sku?.attributes["color"]}
                                    </span>
                                </p>
                            )}
                            {record.sku?.attributes["size"] && (
                                <p>
                                    <span className="text-gray-500">
                                        Kích thước :{" "}
                                    </span>
                                    <span className="font-bold">
                                        {record.sku?.attributes["size"]}
                                    </span>
                                </p>
                            )}
                            {record.sku?.attributes["material"] && (
                                <p>
                                    <span className="text-gray-500">
                                        Chất liệu :{" "}
                                    </span>
                                    <span className="font-bold">
                                        {record.sku?.attributes["material"]}
                                    </span>
                                </p>
                            )}
                        </div>
                        {detailOrder.data?.rentalPackage && (
                            <div className="px-4 py-1 border rounded border-primary text-primary">
                                {detailOrder.data?.rentalPackage?.name}
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: "Giá thuê",
            dataIndex: "price",
            key: "price",
            render: (value) => <div>{formatMoney(value)}đ</div>,
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            render: (value) => <div>{value}</div>,
        },
        {
            title: "Tạm tính",
            dataIndex: "price",
            key: "price",
            render: (value) => (
                <div className="text-nowrap">{formatMoney(value)}đ</div>
            ),
        },
        {
            title: "Nhận vào lúc",
            dataIndex: "startAt",
            key: "startAt",
            render: (value) => (
                <div className="text-nowrap">
                    {value ? (
                        moment(new Date(value)).format("hh:mm:ss DD/MM/YYYY")
                    ) : (
                        <span>{"Chưa nhận"}</span>
                    )}
                </div>
            ),
        },
        {
            title: "Trả vào",
            dataIndex: "endAt",
            key: "endAt",
            render: (value) => {
                const currentTime = moment();
                const endTime = moment(value);

                const diffHours = endTime.diff(currentTime, "hours");
                const diffMinutes = endTime.diff(currentTime, "minutes");

                let textColor = "text-gray-500";
                let remainingTimeText = "";

                if (diffHours > 2) {
                    textColor = "text-green-500";
                    remainingTimeText = `${Math.abs(diffHours)} giờ nữa`;
                } else if (diffHours < 0) {
                    textColor = "text-red-500";
                    remainingTimeText = "Đã quá giờ";
                } else if (diffHours <= 2) {
                    textColor = "text-yellow-500";
                    if (diffMinutes > 0) {
                        remainingTimeText = `${Math.abs(diffMinutes)} phút nữa`;
                    } else {
                        remainingTimeText = `${Math.abs(diffHours)} giờ nữa`;
                    }
                }

                return (
                    <div className={`text-nowrap ${textColor}`}>
                        {value ? (
                            <>
                                <span>
                                    {moment(new Date(value)).format(
                                        "hh:mm:ss DD/MM/YYYY"
                                    )}
                                </span>
                                <span className="font-bold">
                                    {" "}
                                    - Còn {remainingTimeText}
                                </span>
                            </>
                        ) : (
                            <span>{"Chưa nhận"}</span>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Thời hạn",
            dataIndex: "price",
            key: "price",
            render: (_, record) => (
                <div className="text-nowrap">
                    <div className="flex gap-2 text-green-600">
                        <span>
                            <Icons.MdTimer size={20} />
                        </span>
                        {!detailOrder.data?.rentalPackage ? (
                            <span className="flex gap-2">
                                {record.day > 0 && (
                                    <span>{record.day} ngày</span>
                                )}
                                {record.hour > 0 && (
                                    <span>{record.hour} giờ</span>
                                )}
                            </span>
                        ) : (
                            <span>
                                {detailOrder.data?.rentalPackage?.durationDays}
                                {" ngày"}
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-2 ">
            <div className="text-lg ">
                <span>Chi tiết đơn hàng #{detailOrder.data?.rentalCode} -</span>{" "}
                <span
                    className={`font-bold  ${
                        convertStatusOrder(detailOrder.data?.status)?.textColor
                    }`}
                >
                    {convertStatusOrder(detailOrder.data?.status)?.text}
                </span>
            </div>
            <div className="text-end text-yellow-700">
                Ngày đặt hàng:{" "}
                {moment(new Date(detailOrder.data?.createdAt)).format(
                    "HH:MM:SS DD-MM-YYYY"
                )}
            </div>
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
                    <div className="p-4 bg-white min-h-[150px] font-bold">
                        {detailOrder.data?.payment?.method}
                    </div>
                </div>
            </div>
            <div className="bg-white p-4 rounded">
                <div className="mt-2 flex items-end gap-2 flex-col">
                    <div className="flex gap-4">
                        <p className="text-slate-600">Tạm tính</p>
                        <p>
                            {formatMoney(
                                detailOrder.data?.totalAmount +
                                    detailOrder.data?.discountValue
                            )}{" "}
                            vnđ
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <p className="text-slate-600">Giảm</p>
                        <p className="text-green-500">
                            -{formatMoney(detailOrder.data?.discountValue || 0)}
                            {" vnđ"}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <p className="text-slate-600">Tổng cộng</p>
                        <p className="text-red-500 font-bold">
                            {formatMoney(detailOrder.data?.totalAmount)} vnđ
                        </p>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={detailOrder.data?.rentalDetails}
                />
            </div>
        </div>
    );
}

export default DetailRental;
