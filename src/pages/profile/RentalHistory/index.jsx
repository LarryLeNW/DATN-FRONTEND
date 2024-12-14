import { Button, DatePicker, Modal, notification, Skeleton, Tabs } from "antd";
import { getOrders } from "apis/order.api";
import { changeRentalStatus, changeStatus, getRentals } from "apis/rental.api";
import paths from "constant/paths";
import useDebounce from "hooks/useDebounce";
import Navigation from "layout/admin/Navigation";
import moment from "moment";
import Pagination from "pages/admin/components/Pagination";
import { useEffect, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { convertStatusOrder } from "utils/covertDataUI";
import { formatMoney, trunCateText } from "utils/helper";
import Icons from "utils/icons";
const { confirm } = Modal;

function RentalHistory() {
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState({
        isLoading: false,
        data: [],
    });

    const [selectedStatus, setSelectedStatus] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const keyDebounce = useDebounce(searchKeyword, 400);

    const fetchOrders = async () => {
        setOrderData((prev) => ({ ...prev, isLoading: true }));
        try {
            const params = {
                page,
                limit,
            };

            if (selectedStatus) params.status = selectedStatus;
            if (keyDebounce) params.keyword = keyDebounce;
            else {
                delete params.keyword;
            }
            if (startDate)
                params.startDate = moment(new Date(startDate)).format(
                    "YYYY-MM-DD"
                );

            if (startDate) {
                console.log(
                    "Formatted Start Date:",
                    moment(startDate).format("YYYY-MM-DD")
                );
            }

            if (endDate)
                params.endDate = moment(new Date(endDate)).format("YYYY-MM-DD");

            const res = await getRentals(params);
            setOrderData((prev) => ({ ...prev, data: res?.result }));
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

    useEffect(() => {
        fetchOrders();
    }, [page, limit]);

    useEffect(() => {
        setPage(1);
        fetchOrders();
    }, [keyDebounce, selectedStatus, startDate, endDate]);

    const handleCancelRental = (id) => {
        confirm({
            title: "Bạn có chắc chắn muốn Hủy đơn hàng này chứ ?",
            okText: "Đồng ý",
            cancelText: "Không hủy",
            async onOk() {
                try {
                    await changeRentalStatus(id, "CANCELLED");
                    notification.success({
                        message: "Hủy đơn hàng thành công",
                        duration: 2,
                    });
                    fetchOrders();
                } catch (error) {
                    notification.warning({
                        message: error.message,
                        duration: 2,
                    });
                }
            },
        });
    };

    const handleRentalPayment = (data) => {
        navigate(paths.CHECKOUT.RENTAL_PAYMENT, {
            state: {
                product: {
                    id: data.rentalDetails[0]?.productId,
                    name: data.rentalDetails[0]?.productName,
                },
                selectedPackage: data.rentalPackage,
                rentalProducts: data.rentalDetails.map((el) => ({
                    ...el.sku,
                    quantity: el?.quantity,
                    hour: el?.hour,
                    day: el?.day,
                })),
            },
        });
    };

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
            key: "RENTED",
            label: <p className="text-lg text-green-500">Đang thuê</p>,
        },
        {
            key: "RETURNED",
            label: <p className="text-lg text-green-700">Đã trả</p>,
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
                    onChange={(key) => {
                        if (key === "All") setSelectedStatus(null);
                        else setSelectedStatus(key);
                    }}
                    className="w-full bg-white px-2"
                />
            </div>
            <div className="flex gap-4 ">
                <div className="bg-white flex rounded items-center px-2 flex-1">
                    <Icons.IoIosSearch className="font-bold text-lg" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm đơn thuê theo code & tên sản phẩm..."
                        className="w-full px-4 py-2 outline-none"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <div className="text-nowrap text-blue-500 px-2 border-l border-gray-400 cursor-pointer">
                        Tìm đơn thuê
                    </div>
                </div>
                <div className="bg-white rounded px-2 flex items-center gap-4">
                    <div className="flex gap-2 items-center">
                        <p>Từ </p>
                        <DatePicker
                            value={startDate}
                            placeholder="chọn ngày"
                            onChange={(date) => setStartDate(date)}
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        <p>Đến </p>
                        <DatePicker
                            placeholder="chọn ngày"
                            value={endDate}
                            onChange={(date) => setEndDate(date)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {orderData.isLoading ? (
                    <>
                        <OrderItemSkeleton />
                        <OrderItemSkeleton />
                        <OrderItemSkeleton />
                    </>
                ) : (
                    orderData.data?.content?.map((el) => (
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
                                    <div className="flex flex-col ">
                                        <div className="text-gray-700 text-nowrap">
                                            {formatMoney(orderDetail.price)} vnđ
                                        </div>
                                        {!orderDetail.isReview &&
                                            el.status == "RETURNED" && (
                                                <Button className="mt-auto bg-primary text-white">
                                                    Đánh giá
                                                </Button>
                                            )}
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between mt-2">
                                <div className="text-primary italic">
                                    Bạn đã đặt vào :{" "}
                                    {moment(new Date(el?.createdAt)).format(
                                        "HH:MM:SS DD-MM-YYYY"
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <p>
                                        <span className="text-gray-600">
                                            Đã giảm từ voucher :{" "}
                                        </span>
                                        <span className="text-yellow-700">
                                            {formatMoney(el.discountValue)} đ
                                        </span>
                                    </p>
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
                                            <Button
                                                className="text-blue-600 border-blue-600"
                                                onClick={() =>
                                                    handleRentalPayment(el)
                                                }
                                            >
                                                Thuê lại
                                            </Button>
                                        )}

                                        {(el.status === "UNPAID" ||
                                            (el.status === "PENDING" &&
                                                el?.payment?.method ===
                                                    "COD")) && (
                                            <Button
                                                className="text-white bg-red-500"
                                                onClick={() =>
                                                    handleCancelRental(el.id)
                                                }
                                            >
                                                Hủy
                                            </Button>
                                        )}

                                        <Button
                                            className="text-blue-600 border-blue-600"
                                            onClick={() =>
                                                navigate(
                                                    generatePath(
                                                        paths.MEMBER
                                                            .DETAIL_RENTAL,
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
            {orderData.data?.content && (
                <div class="flex w-full justify-end p-2 ">
                    <Pagination
                        listLimit={[10, 25, 40, 100]}
                        limitCurrent={limit}
                        setLimit={setLimit}
                        totalPages={orderData.data.totalPages}
                        setPage={setPage}
                        pageCurrent={page}
                        totalElements={orderData.data.totalElements}
                    />
                </div>
            )}
        </div>
    );
}

export default RentalHistory;
