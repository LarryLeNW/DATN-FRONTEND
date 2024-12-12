import { Button, notification, Skeleton, Tabs } from "antd";
import { getOrders } from "apis/order.api";
import { getRentals } from "apis/rental.api";
import paths from "constant/paths";
import moment from "moment";
import { useEffect, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { convertStatusOrder } from "utils/covertDataUI";
import { formatMoney, trunCateText } from "utils/helper";
import Icons from "utils/icons";

function RentalHistory() {
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState({
        isLoading: false,
        data: [],
    });
    console.log("🚀 ~ RentalHistory ~ orderData:", orderData);

    const [dataRender, setDataRender] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState("");

    const fetchOrders = async () => {
        setOrderData((prev) => ({ ...prev, isLoading: true }));
        try {
            const res = await getRentals();
            setOrderData((prev) => ({ ...prev, data: res?.result?.content }));
            setDataRender(res?.result?.content);
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 2,
            });
        }
        setOrderData((prev) => ({ ...prev, isLoading: false }));
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const onChange = (key) => {
        setSelectedStatus(key);
        setSearchKeyword("");
    };

    const handleFilter = () => {
        let filteredData = orderData.data;

        if (selectedStatus && selectedStatus !== "All") {
            filteredData = filteredData.filter(
                (item) => item.status === selectedStatus
            );
        }

        if (searchKeyword) {
            filteredData = filteredData.filter((item) =>
                item.rentalDetails.some((orderDetail) =>
                    orderDetail.productName
                        .toLowerCase()
                        .includes(searchKeyword.toLowerCase())
                )
            );
        }

        setDataRender(filteredData);
    };

    useEffect(() => {
        handleFilter();
    }, [selectedStatus, searchKeyword]);

    const tabItems = [
        {
            key: "All",
            label: <p className="text-lg text-blue-500">Tất cả đơn</p>,
        },
        {
            key: "UNPAID",
            label: <p className="text-lg text-yellow-500">Chờ thanh toán</p>,
        },
        {
            key: "PENDING",
            label: <p className="text-lg text-orange-500">Đang xử lí</p>,
        },
        {
            key: "SHIPPED",
            label: <p className="text-lg text-purple-500">Đang vận chuyển</p>,
        },
        {
            key: "DELIVERED",
            label: <p className="text-lg text-green-500">Đã giao</p>,
        },
        {
            key: "CANCELLED",
            label: <p className="text-lg text-red-500">Đã hủy</p>,
        },
    ];

    const OrderItemSkeleton = () => (
        <div className="bg-white p-4">
            <div className="border-b p-3">
                <Skeleton.Input active size="small" style={{ width: 200 }} />
            </div>
            <div className="border-b py-3 flex justify-between">
                <div className="flex gap-4">
                    <Skeleton.Image active style={{ width: 96, height: 96 }} />
                    <div className="flex flex-col gap-3">
                        <Skeleton.Input
                            active
                            size="small"
                            style={{ width: 120 }}
                        />
                        <Skeleton.Input
                            active
                            size="small"
                            style={{ width: 80 }}
                        />
                    </div>
                </div>

                <div>
                    <Skeleton.Input
                        active
                        size="small"
                        style={{ width: 100 }}
                    />
                </div>
            </div>
            <div className="flex flex-col items-end gap-3">
                <Skeleton.Input active size="small" style={{ width: 150 }} />
                <div className="flex gap-2">
                    <Skeleton.Button
                        active
                        size="small"
                        style={{ width: 100 }}
                    />
                    <Skeleton.Button
                        active
                        size="small"
                        style={{ width: 100 }}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl mb-4">Lịch sử đơn thuê</h1>
            <div className="rounded">
                <Tabs
                    defaultActiveKey="1"
                    items={tabItems}
                    onChange={onChange}
                    className="w-full bg-white px-2"
                />
            </div>
            <div className="bg-white flex rounded items-center px-2">
                <Icons.IoIosSearch className="font-bold text-lg" />
                <input
                    type="text"
                    placeholder="Tìm kiếm đơn thuê"
                    className="w-full px-4 py-2 outline-none"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <div
                    className="text-nowrap text-blue-500 px-2 border-l border-gray-400 cursor-pointer"
                    onClick={handleFilter}
                >
                    Tìm đơn thuê
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {orderData.isLoading ? (
                    <OrderItemSkeleton />
                ) : (
                    dataRender.map((el) => (
                        <div className="bg-white p-2" key={el.id}>
                            <div
                                className={`border-b p-2 font-bold ${
                                    convertStatusOrder(el.status)?.textColor
                                }`}
                            >
                                <span>
                                    {convertStatusOrder(el.status)?.text}
                                </span>
                            </div>
                            {el.rentalDetails?.map((orderDetail) => (
                                <div
                                    className="border-b py-2 flex justify-between"
                                    key={orderDetail.id}
                                >
                                    <div className="flex gap-2">
                                        <div className=" border  p-2 rounded">
                                            <img
                                                src={
                                                    orderDetail.sku.images.split(
                                                        ","
                                                    )[0]
                                                }
                                                alt=""
                                                className=" w-24 h-24 object-contain"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="font-bold">
                                                {trunCateText(
                                                    orderDetail.productName,
                                                    44
                                                )}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <span className="text-gray-500">
                                                    Số lượng:
                                                </span>
                                                <span className="font-bold">
                                                    {orderDetail.quantity}
                                                </span>
                                            </p>
                                            {!el?.rentalPackage ? (
                                                <div className="flex gap-2 text-green-600">
                                                    <span>Thuê : </span>
                                                    {orderDetail.day > 0 && (
                                                        <span>
                                                            {orderDetail.day}{" "}
                                                            ngày
                                                        </span>
                                                    )}
                                                    {orderDetail.hour > 0 && (
                                                        <span>
                                                            {orderDetail.hour}{" "}
                                                            giờ
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="font-bold text-primary px-2 py-1 rounded border">
                                                    Sử dụng{" "}
                                                    {el?.rentalPackage?.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-gray-700 text-nowrap">
                                        {formatMoney(orderDetail.price)} vnđ
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between mt-2">
                                <div className="text-primary italic">
                                    Bạn đã đặt vào :{" "}
                                    {moment(el?.payment?.createdAt).format(
                                        "DD-MM-YYYY"
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <p>
                                        <span className="text-gray-600">
                                            Tổng tiền:{" "}
                                        </span>
                                        <span className="font-bold">
                                            {formatMoney(el.totalAmount)} đ
                                        </span>
                                    </p>
                                    <p className="flex gap-2">
                                        {(el.status === "CANCELLED" ||
                                            el.status === "DELIVERED") && (
                                            <Button className="text-blue-600 border-blue-600">
                                                Mua lại
                                            </Button>
                                        )}

                                        <Button
                                            className="text-blue-600 border-blue-600"
                                            onClick={() =>
                                                navigate(
                                                    generatePath(
                                                        paths.MEMBER
                                                            .DETAIL_ORDER,
                                                        { id: el.id }
                                                    )
                                                )
                                            }
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default RentalHistory;
