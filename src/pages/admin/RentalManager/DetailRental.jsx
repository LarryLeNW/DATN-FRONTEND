import { faker } from "@faker-js/faker";
import { Button, notification, Table } from "antd";
import { getRentalById } from "apis/rental.api";
import logo from "assets/images/logo.jpg";
import paths from "constant/paths";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { convertVI } from "utils/covertDataUI";
import { formatMoney } from "utils/helper";
import Icons from "utils/icons";

function DetailRental() {
    const params = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchDetailRental = async () => {
            if (!params.rentalId) navigate(paths.ADMIN.RENTAL_MANAGEMENT);

            setIsLoading(true);
            try {
                const res = await getRentalById(params.rentalId);
                setData(res.result);
            } catch (error) {
                notification.warning({
                    message: error.message,
                    duration: 2,
                    placement: "top",
                });
                navigate(paths.ADMIN.RENTAL_MANAGEMENT);
            }

            setIsLoading(false);
        };

        fetchDetailRental();
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
                        {data?.rentalPackage && (
                            <div className="px-4 py-1 border rounded border-primary text-primary">
                                {data?.rentalPackage?.name}
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
            title: "Tạm tính",
            dataIndex: "price",
            key: "price",
            render: (value) => (
                <div className="text-nowrap">{formatMoney(value)}đ</div>
            ),
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
                        {!data?.rentalPackage ? (
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
                                {data?.rentalPackage?.durationDays}
                                {" ngày"}
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full p-4 flex flex-col  overflow-auto min-h-full">
            <div className="h-[75px] flex gap-2 items-center justify-between p-2 border-b border-blue-300">
                <div className="text-2xl font-bold flex justify-between items-center w-full ">
                    <div className="flex items-center gap-2">
                        <img
                            src={logo}
                            alt="logo"
                            className="w-16 object-contain"
                            data-aos="fade"
                        />
                        <div className="items-center" data-aos="fade">
                            Đơn thuê #{data?.rentalCode}
                        </div>
                    </div>
                    <Button
                        onClick={() => navigate(paths.ADMIN.RENTAL_MANAGEMENT)}
                    >
                        <div className="flex gap-2 items-center text-green-500 font-bold text-lg">
                            <span>Danh sách</span>
                        </div>
                    </Button>
                </div>
            </div>

            {data && (
                <div className="mt-6">
                    <div className=" text-xl flex gap-2 items-center">
                        <span className="text-slate-500">Tạo ngày :</span>
                        <span className="text-yellow-700">
                            {moment(new Date(data.createdAt)).format(
                                "hh:mm:ss DD:MM:YYYY"
                            )}
                        </span>
                    </div>
                    <div className="flex gap-2 mt-4 justify-around">
                        <div className="flex flex-col gap-2 py-4 px-12 rounded border bg-white">
                            <div className="font-bold text-lg border-b text-center">
                                Khách hàng
                            </div>
                            <div className="flex flex-col px-2 justify-center gap-2">
                                <div className="font-bold text-lg flex gap-2 items-center">
                                    <img
                                        className="w-8 h-8 rounded-full "
                                        src={
                                            data?.user?.avatar ||
                                            faker.image.avatar()
                                        }
                                        alt={data?.user?.avatar}
                                    />
                                    {data?.user?.username ||
                                        data?.user?.email.split("@")[0]}
                                </div>
                                <span>{data?.user?.email}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 py-4 px-8 rounded border bg-white">
                            <div className="font-bold text-lg border-b text-center">
                                Thông tin giao
                            </div>
                            <div className="flex flex-col px-2 justify-center gap-2">
                                <div className="flex gap-2">
                                    <p className="text-gray-500">
                                        Người nhận :
                                    </p>
                                    <p className="font-bold">
                                        {data.delivery.username}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <p className="text-gray-500">
                                        Số điện thoại :
                                    </p>
                                    <p className="font-bold">
                                        {data.delivery.numberPhone}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <p className="text-gray-500">Địa chỉ :</p>
                                    <span className="text-wrap">
                                        {data?.delivery?.street}
                                        {data?.delivery?.ward && (
                                            <span>
                                                , {data?.delivery?.ward}
                                            </span>
                                        )}
                                        {data?.delivery?.district && (
                                            <span>
                                                , {data?.delivery?.district}
                                            </span>
                                        )}
                                        {data?.delivery?.city && (
                                            <span>
                                                , {data?.delivery?.city}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <p className="text-gray-500">
                                        Loại địa chỉ :
                                    </p>
                                    <p className="font-bold text-green-600">
                                        {data.delivery.typeAddress}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 py-4 px-12 rounded border bg-white justify-between">
                            <div className="font-bold text-lg border-b">
                                Trạng thái đơn
                            </div>
                            <div className="text-lg font-bold text-primary">
                                {convertVI(data.status)}
                            </div>

                            <div className="font-bold text-lg border-b">
                                Phương thức thanh toán
                            </div>
                            <div className="text-lg font-bold text-primary">
                                {data?.payment?.method}
                            </div>
                        </div>
                    </div>
                    <div className="my-4 text-primary text-2xl italic">
                        Danh sách hàng đã thuê
                    </div>
                    <Table columns={columns} dataSource={data?.rentalDetails} />
                </div>
            )}

            {isLoading && (
                <HashLoader
                    size={100}
                    color="#b683df"
                    className="mx-auto mt-20"
                />
            )}
        </div>
    );
}

export default DetailRental;
