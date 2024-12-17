import {
    Button,
    DatePicker,
    Input,
    Modal,
    notification,
    Select,
    Tooltip,
} from "antd";
import { deleteCategoryBlog, getCategoryBlog } from "apis/categoryBlog.api";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import Icons from "utils/icons";
import moment from "moment";
import Pagination from "../components/Pagination";
import logo from "assets/images/logo.jpg";
import { deleteUsers, getUsers } from "apis/user.api";
import { faker } from "@faker-js/faker";
import useDebounce from "hooks/useDebounce";
import { getRoles } from "apis/role.api";
import {
    changeRentalRentedStatus,
    changeRentalStatus,
    getRentals,
} from "apis/rental.api";
import { formatMoney } from "utils/helper";
import { convertVI } from "utils/covertDataUI";
import { generatePath, useNavigate } from "react-router-dom";
import paths from "constant/paths";
import { HashLoader } from "react-spinners";

function RentalManager() {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [rentals, setRentals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [isShowModal, setIsShowModal] = useState(false);
    const [keyword, setKeyword] = useState("");
    const searchDebounce = useDebounce(keyword, 600);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const fetchRentals = async () => {
        setIsLoading(true);
        try {
            const params = {
                limit,
                page,
            };
            if (searchDebounce) {
                params.keyword = searchDebounce;
            }
            if (statusFilter) {
                params.status = statusFilter;
            }

            if (startDate)
                params.startDate = moment(new Date(startDate)).format(
                    "YYYY-MM-DD"
                );

            if (endDate)
                params.endDate = moment(new Date(endDate)).format("YYYY-MM-DD");

            const res = await getRentals(params);
            setRentals(res?.result?.content);
            setTotalPages(res?.result?.totalPages);
            setTotalElements(res?.result?.totalElements);
        } catch (error) {
            notification.error({
                message: error?.message || "Something's went wrong...",
                duration: 2,
            });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchRentals();
    }, [page, limit]);

    const handleDelete = async (id) => {
        dispatch(changeLoading());
        try {
            await deleteUsers(id);
            notification.success({
                message: "Delete Successfully",
                duration: 1,
            });
            fetchRentals();
        } catch (error) {
            notification.error({
                message: error?.message,
                duration: 2,
            });
        }
        dispatch(changeLoading());
    };

    useEffect(() => {
        setPage(1);
        fetchRentals();
    }, [searchDebounce, statusFilter, startDate, endDate]);

    const handleConfirmOrder = async (id) => {
        try {
            await changeRentalStatus(id, "SHIPPED");
            fetchRentals();
            notification.success({
                message: "Đã xác nhận đơn hàng",
                duration: 1,
                placement: "top",
            });
        } catch (error) {
            notification.error({
                message: error?.message,
                duration: 2,
                placement: "top",
            });
        }
    };

    const handleConfirmRented = async (id) => {
        setIsLoading(true);
        try {
            await changeRentalRentedStatus(id);
            fetchRentals();
            notification.success({
                message: "Đã xác nhận giao",
                duration: 1,
                placement: "top",
            });
        } catch (error) {
            notification.error({
                message: error?.message,
                duration: 2,
                placement: "top",
            });
        }
        setIsLoading(false);
    };

    const renderStatus = (status, id) => {
        const convertedStatus = convertVI(status, id);

        if (convertedStatus === "Đang xử lí") {
            return (
                <Tooltip title="Xác nhận ngay">
                    <Button
                        className=" text-orange-700 font-bold"
                        onClick={() => handleConfirmOrder(id)}
                    >
                        Đang chờ xác nhận
                    </Button>
                </Tooltip>
            );
        }

        if (convertedStatus === "Đang giao") {
            return (
                <Tooltip title="Xác nhận đã giao">
                    <Button
                        className=" text-green-700 font-bold"
                        onClick={() => handleConfirmRented(id)}
                    >
                        Xác nhận đã giao
                    </Button>
                </Tooltip>
            );
        }
        if (convertedStatus === "Chưa thanh toán")
            return <span className="text-orange-500">{convertedStatus}</span>;

        if (convertedStatus === "Đã hủy")
            return <span className="text-red-500">{convertedStatus}</span>;

        if (convertedStatus === "Hết hạn")
            return <span className="text-gray-500">{convertedStatus}</span>;

        return <span className="text-primary">{convertedStatus}</span>;
    };

    return (
        <div className="w-full p-4 flex flex-col  overflow-auto min-h-full">
            <div className="h-[75px] flex gap-2 items-center justify-between p-2 border-b border-blue-300">
                <div className="text-2xl font-bold flex justify-between items-center w-full ">
                    <img
                        src={logo}
                        alt="logo"
                        className="w-16 object-contain"
                        data-aos="fade"
                    />
                    <div className="items-center" data-aos="fade">
                        Quản lí đơn thuê
                    </div>
                    <Button
                        onClick={() =>
                            navigate(paths.ADMIN.UPDATE_RENTAL_MANAGEMENT)
                        }
                    >
                        <div className="flex gap-2 items-center text-green-500 font-bold text-lg">
                            <span>Tạo</span>
                            <Icons.FaPlus />
                        </div>
                    </Button>
                </div>
            </div>

            {/* filter */}
            <div className="flex gap-4 mb-4 justify-between items-center p-4 bg-white mt-2 rounded">
                <div className="flex gap-2">
                    <div className="flex gap-2 items-center">
                        <p>Trạng thái </p>
                        <Select
                            placeholder="Lọc trạng thái"
                            value={statusFilter}
                            onChange={(value) => setStatusFilter(value)}
                            style={{ width: "200px" }}
                            allowClear
                        >
                            <Select.Option value="PENDING">
                                Đang xử lí
                            </Select.Option>
                            <Select.Option value="RENTED">
                                Đang thuê
                            </Select.Option>
                            <Select.Option value="RENTED">
                                Đang ship
                            </Select.Option>
                            <Select.Option value="RETURNED">
                                Đang trả
                            </Select.Option>
                            <Select.Option value="CANCELLED">
                                Đã hủy
                            </Select.Option>
                            <Select.Option value="UNPAID">
                                Chưa thanh toán
                            </Select.Option>
                        </Select>
                    </div>

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
                <Input
                    placeholder="Tìm kiếm từ khóa (code, user, product)"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    allowClear
                    addonAfter={<Icons.IoIosSearch />}
                    style={{ width: "300px" }}
                />
            </div>

            {isLoading ? (
                <HashLoader
                    size={100}
                    color="#b683df"
                    className="mx-auto mt-20"
                />
            ) : (
                <div className="flex flex-col border justify-between">
                    <table className="table-auto rounded p-2  mb-1 text-left w-full border-separate  transition-all duration-300 ease-in ">
                        <thead className="font-bold  text-white text-[13px]  border border-blue-300">
                            <tr>
                                <th className="px-2 py-2 bg-gradient-to-r from-primary to-secondary">
                                    STT
                                </th>
                                <th className="bg-gradient-to-r from-primary to-secondary px-2 py-2  ">
                                    Mã đơn
                                </th>
                                <th className="bg-gradient-to-r from-primary to-secondary px-2 py-2">
                                    Người dùng
                                </th>
                                <th className="bg-gradient-to-r from-primary to-secondary px-2 py-2">
                                    Tổng tiền
                                </th>
                                <th className="bg-gradient-to-r from-primary to-secondary px-2 py-2">
                                    Phương thức thanh toán
                                </th>
                                <th className="bg-gradient-to-r from-primary to-secondary px-2 py-2">
                                    Số lượng SP
                                </th>
                                <th className="bg-gradient-to-r from-primary to-secondary px-2 py-2">
                                    Ngày tạo
                                </th>
                                <th className="bg-gradient-to-r from-primary to-secondary px-2 py-2">
                                    Trạng thái
                                </th>
                                <th className="bg-gradient-to-r from-primary to-secondary px-2 py-2 text-center">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rentals.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="relative border rounded my-2 bg-white"
                                >
                                    <td className="px-2 py-1  border-slate-500 text-center text-lg font-bold">
                                        {index}
                                    </td>
                                    <td className="px-2 py-1  border-slate-500 text-lg font-bold">
                                        #{item?.rentalCode}
                                    </td>
                                    <td className="px-2 py-1  border-slate-500  ">
                                        <div className="flex flex-col px-2 justify-center gap-2">
                                            <div className="font-bold text-lg flex gap-2 items-center">
                                                <img
                                                    className="w-8 h-8 rounded-full "
                                                    src={
                                                        item?.user?.avatar ||
                                                        faker.image.avatar()
                                                    }
                                                    alt={item?.user?.avatar}
                                                />
                                                {item?.user?.username ||
                                                    item?.user?.email.split(
                                                        "@"
                                                    )[0]}
                                            </div>
                                            <span>{item?.user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-2 py-1  border-slate-500 text-lg font-bold">
                                        {formatMoney(item?.totalAmount)}đ
                                    </td>
                                    <td className="px-2 py-1  border-slate-500 text-lg font-bold">
                                        {item?.payment?.method}
                                    </td>
                                    <td className="px-2 py-1  border-slate-500 text-lg font-bold">
                                        Thuê {item?.rentalDetails.length} sản
                                        phẩm
                                    </td>
                                    <td className="px-2 py-1  border-slate-500 text-lg font-bold">
                                        {moment(item?.startAt).format(
                                            "DD/MM/YYYY hh:mm:ss"
                                        )}
                                    </td>
                                    <td className="px-2 py-1  border-slate-500 text-lg font-bold text-center">
                                        <td className="p-2">
                                            {renderStatus(
                                                item?.status,
                                                item.id
                                            )}
                                        </td>
                                    </td>
                                    <td className="px-1 py-2 h-full flex  gap-4 items-center justify-center ">
                                        <Tooltip title="Chỉnh sửa">
                                            <Button
                                                onClick={() =>
                                                    navigate(
                                                        generatePath(
                                                            paths.ADMIN
                                                                .EDIT_RENTAL_MANAGEMENT,
                                                            {
                                                                id: item.id,
                                                            }
                                                        )
                                                    )
                                                }
                                            >
                                                <Icons.FaEdit color="blue" />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Xem chi tiết">
                                            <Button
                                                onClick={() =>
                                                    navigate(
                                                        generatePath(
                                                            paths.ADMIN
                                                                .RENTAL_DETAIL_MANAGEMENT,
                                                            {
                                                                rentalId:
                                                                    item.id,
                                                            }
                                                        )
                                                    )
                                                }
                                            >
                                                <Icons.FaEye />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Xóa">
                                            <Button
                                                className="text-red-500"
                                                onClick={() =>
                                                    handleDelete(item?.id)
                                                }
                                            >
                                                <Icons.MdDeleteForever />
                                            </Button>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {rentals.length > 1 && (
                        <div class="flex w-full justify-end p-2 ">
                            <Pagination
                                listLimit={[10, 25, 40, 100]}
                                limitCurrent={limit}
                                setLimit={setLimit}
                                totalPages={totalPages}
                                setPage={setPage}
                                pageCurrent={page}
                                totalElements={totalElements}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default RentalManager;
