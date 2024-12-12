import { faker } from "@faker-js/faker";
import { Button, notification, Tooltip } from "antd";
import { getRoles } from "apis/role.api";
import { deleteUsers, getUsers } from "apis/user.api";
import logo from "assets/images/logo.jpg";
import useDebounce from "hooks/useDebounce";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import Icons from "utils/icons";
import Pagination from "../components/Pagination";
import { deleteVoucher, getVouchers } from "apis/voucher.api";
import moment from "moment";
import { formatMoney } from "utils/helper";
import withBaseComponent from "hocs";
import paths from "constant/paths";
import { generatePath } from "react-router-dom";

function VoucherManager({ dispatch, navigate }) {
    const { userInfo } = useSelector((state) => state.auth);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [vouchers, setVouchers] = useState([]);
    console.log("🚀 ~ VoucherManager ~ vouchers:", vouchers);
    const [isShowModal, setIsShowModal] = useState(false);
    const [keyword, setKeyword] = useState("");
    const searchDebounce = useDebounce(keyword, 600);

    const fetchVouchers = async () => {
        dispatch(changeLoading());
        try {
            const params = {
                limit,
                page,
            };
            if (searchDebounce) {
                params.keyword = searchDebounce;
            }

            const res = await getVouchers(params);
            setVouchers(res?.result?.content);
            setTotalPages(res?.result?.totalPages);
            setTotalElements(res?.result?.totalElements);
        } catch (error) {
            notification.error({
                message: error?.message || "Something's went wrong...",
                duration: 2,
            });
        }
        dispatch(changeLoading());
    };

    useEffect(() => {
        fetchVouchers();
    }, [page, limit]);

    const openFormUpdate = (item) => {
        setIsShowModal(true);
    };

    const handleDelete = async (id) => {
        dispatch(changeLoading());
        try {
            await deleteVoucher(id);
            notification.success({
                message: "Delete Successfully",
                duration: 1,
            });
            fetchVouchers();
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
        fetchVouchers();
    }, [searchDebounce]);

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
                        Quản lí khuyến mãi
                    </div>
                    <Button
                        onClick={() => navigate(paths.ADMIN.CREATE_VOUCHER)}
                    >
                        <div className="flex gap-2 items-center text-green-500 font-bold text-lg">
                            <span>Create</span>
                            <Icons.FaPlus />
                        </div>
                    </Button>
                </div>
            </div>

            {/* table */}
            <div className="flex flex-col border justify-between">
                <table className="table-auto rounded p-2  mb-1 text-left w-full border-separate  transition-all duration-300 ease-in ">
                    <thead className="font-bold bg-light text-white text-[13px]  border border-blue-300">
                        <tr>
                            <th className="px-2 py-2">STT</th>
                            <th className="px-2 py-2 text-center">Tên</th>
                            <th className="px-2 py-2">Loại</th>
                            <th className="px-2 py-2">Mã</th>
                            <th className="px-2 py-2">Kiểu giảm</th>
                            <th className="px-2 py-2">Giá trị giảm</th>
                            <th className="px-2 py-2">Giảm tối đa</th>
                            <th className="px-2 py-2">Đơn hàng tối thiểu</th>
                            <th className="px-2 py-2">Ngày hết hạn</th>
                            <th className="px-2 py-2">Giới hạn dùng</th>
                            <th className="px-2 py-2">Đã dùng</th>
                            <th className="px-2 py-2">Trạng thái</th>
                            <th className="px-2 py-2 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vouchers.map((item, index) => {
                            return (
                                <tr
                                    key={item.id}
                                    className="relative border rounded my-2 bg-white"
                                >
                                    <td className="px-2 py-1  border-slate-500 text-center  font-bold">
                                        {index + 1}
                                    </td>
                                    <td className="px-2 py-1  border-slate-500  font-bold">
                                        {item?.name}
                                    </td>
                                    <td className="px-2 py-1  border-slate-500  font-bold">
                                        {item?.voucher_category}
                                    </td>
                                    <td className="px-2 py-1  border-slate-500  ">
                                        {item?.code}
                                    </td>
                                    <td className="px-2 py-1  border-slate-500  ">
                                        {item?.discount_type == "FIXED"
                                            ? "Cố Định"
                                            : "Phần Trăm"}
                                    </td>
                                    <td className="px-2 py-1  border-slate-500  ">
                                        {item?.discount_type == "FIXED"
                                            ? formatMoney(item?.value) + "đ"
                                            : item?.value + "%"}
                                    </td>
                                    <td className="px-2 py-1  border-slate-500  ">
                                        {item?.max_discount}
                                    </td>
                                    <td className="px-2 py-1  border-slate-500  ">
                                        {item?.min_order}
                                    </td>
                                    <td className="px-2 py-1  border-slate-500 text-nowrap  ">
                                        {moment(item?.expiry_date).format(
                                            "DD-MM-YYYY"
                                        )}
                                    </td>
                                    <td className="px-2 py-1  border-slate-500  ">
                                        {item?.usage_limit}
                                    </td>
                                    <td className="px-2 py-1  border-slate-500  ">
                                        {item?.usageCount}
                                    </td>
                                    <td className="px-2 py-1  border-slate-500  ">
                                        {item?.isPublic ? "Bật" : "Tắt"}
                                    </td>
                                    <td className="px-1 py-2 h-full flex  gap-2 items-center justify-center ">
                                        <Tooltip title="Chỉnh sửa">
                                            <Button
                                                onClick={() =>
                                                    navigate(
                                                        generatePath(
                                                            paths.ADMIN
                                                                .UPDATE_VOUCHER,
                                                            {
                                                                id: item?.id,
                                                            }
                                                        )
                                                    )
                                                }
                                                className="text-blue-500 border-none"
                                            >
                                                <Icons.FaEdit />
                                            </Button>
                                        </Tooltip>

                                        <Tooltip title="Xóa">
                                            <Button
                                                className="text-red-500 border-none"
                                                onClick={() =>
                                                    handleDelete(item?.id)
                                                }
                                            >
                                                <Icons.MdDeleteForever />
                                            </Button>
                                        </Tooltip>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
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
            </div>
        </div>
    );
}

export default withBaseComponent(VoucherManager);
