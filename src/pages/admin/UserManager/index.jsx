import { Button, Input, Modal, notification, Select, Tooltip } from "antd";
import { deleteCategoryBlog, getCategoryBlog } from "apis/categoryBlog.api";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import Icons from "utils/icons";
import moment from "moment";
import Pagination from "../components/Pagination";
import logo from "assets/images/logo.jpg";
import { deleteUsers, getUsers } from "apis/user.api";
import { faker } from "@faker-js/faker";
import UserForm from "./UserForm";
import useDebounce from "hooks/useDebounce";
import { getRoles } from "apis/role.api";

function UserManager() {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [isShowModal, setIsShowModal] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState(null);
    const [roleOptions, setRoleOptions] = useState([]);
    const [roleFilter, setRoleFilter] = useState(null);
    const searchDebounce = useDebounce(keyword, 600);

    const fetchUsers = async () => {
        dispatch(changeLoading());
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
            if (roleFilter) {
                params.role = roleFilter;
            }

            const res = await getUsers(params);
            setUsers(res?.result?.content);
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
        const fetchRoles = async () => {
            const res = await getRoles({ excludeFields: "users,modules" });
            setRoleOptions(res?.result?.content);
        };
        fetchRoles();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [page, limit]);

    const openFormUpdate = (item) => {
        setEditUser(item);
        setIsShowModal(true);
    };

    const handleDelete = async (id) => {
        dispatch(changeLoading());
        try {
            await deleteUsers(id);
            notification.success({
                message: "Delete Successfully",
                duration: 1,
            });
            fetchUsers();
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
        fetchUsers();
    }, [searchDebounce, statusFilter, roleFilter]);

    return (
        <div className="w-full p-4 flex flex-col  overflow-auto min-h-full">
            <Modal
                width={800}
                open={isShowModal}
                onCancel={() => setIsShowModal(false)}
                footer={false}
                destroyOnClose
            >
                <UserForm
                    closeModal={() => {
                        setIsShowModal(false);
                        setEditUser(null);
                    }}
                    fetchData={() => fetchUsers()}
                    userCurrent={editUser}
                />
            </Modal>
            <div className="h-[75px] flex gap-2 items-center justify-between p-2 border-b border-blue-300">
                <div className="text-2xl font-bold flex justify-between items-center w-full ">
                    <img
                        src={logo}
                        alt="logo"
                        className="w-16 object-contain"
                        data-aos="fade"
                    />
                    <div className="items-center" data-aos="fade">
                        Quản lí người dùng
                    </div>
                    <Button onClick={() => openFormUpdate()}>
                        <div className="flex gap-2 items-center text-green-500 font-bold text-lg">
                            <span>Create</span>
                            <Icons.FaPlus />
                        </div>
                    </Button>
                </div>
            </div>

            {/* filter */}
            <div className="flex gap-4 mb-4 justify-between items-center p-4 bg-white mt-2 rounded">
                <div className="flex gap-2">
                    <Select
                        placeholder="Lọc qua vai trò"
                        value={roleFilter}
                        onChange={(value) => setRoleFilter(value)}
                        style={{ width: "200px" }}
                        allowClear
                    >
                        {roleOptions.map((el) => (
                            <Select.Option value={el?.id}>
                                {el.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="Lọc qua trạng thái"
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value)}
                        style={{ width: "200px" }}
                        allowClear
                    >
                        <Select.Option value="ACTIVED">
                            Đã xác thực
                        </Select.Option>
                        <Select.Option value="INACTIVE">
                            Chưa xác thực
                        </Select.Option>
                        <Select.Option value="BLOCKED">Đã Khóa</Select.Option>
                    </Select>
                </div>
                <Input
                    placeholder="Search by keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    allowClear
                    addonAfter={<Icons.IoIosSearch />}
                    style={{ width: "300px" }}
                />
            </div>

            {/* table */}
            <div className="flex flex-col border justify-between">
                <table className="table-auto rounded p-2  mb-1 text-left w-full border-separate  transition-all duration-300 ease-in ">
                    <thead className="font-bold  text-white text-[13px]  border border-blue-300">
                        <tr>
                            <th className="px-2 py-2 bg-gradient-to-r from-primary to-secondary">
                                STT
                            </th>
                            <th className="bg-gradient-to-r from-primary to-secondary px-2 py-2 text-center ">
                                Người dùng
                            </th>
                            <th className="bg-gradient-to-r from-primary to-secondary px-2 py-2">
                                Điểm
                            </th>
                            <th className="bg-gradient-to-r from-primary to-secondary px-2 py-2">
                                Vai Trò
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
                        {users &&
                            users.map((item, index) => {
                                if (item.id != userInfo.data?.id)
                                    return (
                                        <tr
                                            key={item.id}
                                            className="relative border rounded my-2 bg-white"
                                        >
                                            <td className="px-2 py-1  border-slate-500 text-center text-lg font-bold">
                                                {index}
                                            </td>
                                            <td className="px-2 py-1  border-slate-500  ">
                                                <div className="flex flex-col px-2 justify-center gap-2">
                                                    <div className="font-bold text-lg flex gap-2 items-center">
                                                        <img
                                                            className="w-8 h-8 rounded-full "
                                                            src={
                                                                item?.avatar ||
                                                                faker.image.avatar()
                                                            }
                                                            alt="item?.username"
                                                        />
                                                        {item?.username ||
                                                            item?.email.split(
                                                                "@"
                                                            )[0]}
                                                    </div>
                                                    <span>{item?.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-1  border-slate-500 text-lg font-bold">
                                                {item?.points}
                                            </td>
                                            <td className="px-2 py-1  border-slate-500 text-lg font-bold">
                                                {item?.role
                                                    .split(" ")[0]
                                                    .slice(5)}
                                            </td>
                                            <td className="px-2 py-1  border-slate-500 text-lg font-bold">
                                                {item?.status}
                                            </td>
                                            <td className="px-1 py-2 h-full flex  gap-4 items-center justify-center ">
                                                <Tooltip title="Chỉnh sửa">
                                                    <Button
                                                        onClick={() =>
                                                            openFormUpdate(item)
                                                        }
                                                        className="text-blue-500"
                                                    >
                                                        <Icons.FaEdit />
                                                    </Button>
                                                </Tooltip>

                                                <Tooltip title="Xóa">
                                                    <Button
                                                        className="text-red-500"
                                                        onClick={() =>
                                                            handleDelete(
                                                                item?.id
                                                            )
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

export default UserManager;
