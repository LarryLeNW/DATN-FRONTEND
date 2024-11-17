import { faker } from "@faker-js/faker";
import { Modal, notification, Tooltip } from "antd";
import { getRoles } from "apis/role.api";
import { deleteUsers } from "apis/user.api";
import logo from "assets/images/logo.jpg";
import Button from "components/Button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import Icons from "utils/icons";

function RoleManager() {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [roles, setRoles] = useState([]);
    console.log("🚀 ~ RoleManager ~ roles:", roles);
    const [editUser, setEditUser] = useState(null);
    const [isShowModal, setIsShowModal] = useState(false);

    const fetchRoles = async () => {
        dispatch(changeLoading());
        try {
            const params = {
                limit,
                page,
            };
            const res = await getRoles(params);
            setRoles(res?.result?.content);
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
        fetchRoles();
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
            fetchRoles();
        } catch (error) {
            notification.error({
                message: error,
                duration: 2,
            });
        }
        dispatch(changeLoading());
    };

    return (
        <div className="w-full p-4 flex flex-col  overflow-auto min-h-full">
            <Modal
                width={800}
                open={isShowModal}
                onCancel={() => setIsShowModal(false)}
                footer={false}
            ></Modal>
            <div className="h-[75px] flex gap-2 items-center justify-between p-2 border-b border-blue-300">
                <div className="text-2xl font-bold flex justify-between items-center w-full ">
                    <img
                        src={logo}
                        alt="logo"
                        className="w-16 object-contain"
                        data-aos="fade"
                    />
                    <div className="items-center" data-aos="fade"></div>
                    <Button
                        iconBefore={<Icons.FaPlus />}
                        name="Create"
                        handleClick={() => openFormUpdate()}
                        style={
                            "border rounded bg-green-600 cursor-pointer px-4 py-2 text-white text-sm"
                        }
                    />
                </div>
            </div>
            <div className="flex gap-4 mt-2 flex-wrap justify-around">
                {roles?.map((role) => (
                    <div className="w-1/4 py-4 px-2 bg-white border rounded flex flex-col gap-4">
                        <p className="px-2">
                            <span className="font-bold text-primary">
                                Vai Trò :{" "}
                            </span>
                            <span>{role.name}</span>
                        </p>
                        {!!role.modules.length && (
                            <div>
                                <div>
                                    {role.modules.map((module) => (
                                        <div className="flex gap-2 mt-2 p-2 border ">
                                            <Tooltip
                                                title={
                                                    <div className="flex flex-wrap gap-2 ">
                                                        {module.permissions.map(
                                                            (permission) => (
                                                                <span className="text-blue-400 font-bold">
                                                                    {
                                                                        permission.name
                                                                    }
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                }
                                            >
                                                <p className="text-slate-600 text-sm text-nowrap font-bold flex gap-2 items-center">
                                                    <span>
                                                        MODULE {module.name}
                                                    </span>
                                                    <span className="rounded-full flex items-center justify-center bg-primary text-white border text-sm h-8 w-8">
                                                        {
                                                            module.permissions
                                                                .length
                                                        }
                                                    </span>
                                                </p>
                                            </Tooltip>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <p className="border rounded flex flex-1 px-2 gap-2">
                            <span className="font-bold">Mô tả : </span>
                            <span>{role.description}</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RoleManager;
