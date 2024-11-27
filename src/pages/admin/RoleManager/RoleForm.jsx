import { Checkbox, Input, notification } from "antd";
import {
    createRole,
    getModules,
    getPermissions,
    updateRole,
} from "apis/role.api";
import logo from "assets/images/logo.jpg";
import InputForm from "components/InputForm";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const CheckboxGroup = Checkbox.Group;

function RoleForm({ closeModal, fetchData, roleCurrent }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const [modules, setModules] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [checkedList, setCheckedList] = useState({});
    const [indeterminate, setIndeterminate] = useState({});
    const [checkAll, setCheckAll] = useState({});
    const [globalCheckAll, setGlobalCheckAll] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const [modulesRes, permissionsRes] = await Promise.all([
                getModules(),
                getPermissions(),
            ]);
            if (modulesRes?.result) setModules(modulesRes.result);
            if (permissionsRes?.result) setPermissions(permissionsRes.result);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (roleCurrent) {
            if (permissions.length > 0) {
                const initCheckedList = {};
                const initIndeterminate = {};
                const initCheckAll = {};

                roleCurrent.modules.forEach((module) => {
                    const selectedPermissions = module.permissions.map(
                        (perm) => perm.id
                    );
                    initCheckedList[module.id] = selectedPermissions;
                    initIndeterminate[module.id] =
                        selectedPermissions.length > 0 &&
                        selectedPermissions.length < permissions.length;
                    initCheckAll[module.id] =
                        selectedPermissions.length === permissions.length;
                });
                setCheckedList(initCheckedList);
                setIndeterminate(initIndeterminate);
                setCheckAll(initCheckAll);
            }
            setValue("name", roleCurrent.name);
            setValue("description", roleCurrent.description);
        } else {
            setCheckedList({});
            setIndeterminate({});
            setCheckAll({});
            setValue("name", "");
            setValue("description", "");
        }
    }, [roleCurrent, permissions, setValue]);

    const handlePermissionChange = (moduleId, list) => {
        const allPermissions = permissions.map((perm) => perm.id);
        const isAllSelected = list.length === allPermissions.length;

        setCheckedList((prev) => ({ ...prev, [moduleId]: list }));
        setIndeterminate((prev) => ({
            ...prev,
            [moduleId]: list.length > 0 && !isAllSelected,
        }));
        setCheckAll((prev) => ({ ...prev, [moduleId]: isAllSelected }));
    };

    const handleCheckAllChange = (moduleId, checked) => {
        const allPermissions = permissions.map((perm) => perm.id);

        setCheckedList((prev) => ({
            ...prev,
            [moduleId]: checked ? allPermissions : [],
        }));
        setIndeterminate((prev) => ({ ...prev, [moduleId]: false }));
        setCheckAll((prev) => ({ ...prev, [moduleId]: checked }));
    };

    const handleGlobalCheckBoxChange = () => {
        const allPermissions = permissions.map((perm) => perm.id);
        const newCheckedList = {};
        const newCheckAll = {};
        const newIndeterminate = {};

        modules.forEach((module) => {
            newCheckedList[module.id] = globalCheckAll ? [] : allPermissions;
            newCheckAll[module.id] = !globalCheckAll;
            newIndeterminate[module.id] = false;
        });

        setCheckedList(newCheckedList);
        setCheckAll(newCheckAll);
        setIndeterminate(newIndeterminate);
        setGlobalCheckAll(!globalCheckAll);
    };

    const handleSubmitForm = async (data) => {
        const payload = {
            ...data,
            modules: modules.map((module) => ({
                id: module.id,
                permissions: checkedList[module.id] || [],
            })),
        };

        try {
            if (roleCurrent) await updateRole(roleCurrent?.id, payload);
            else await createRole(payload);
        } catch (error) {
            notification.error({ message: error.message, duration: 1 });
        }

        closeModal();
        fetchData();
    };

    return (
        <div className="flex flex-col items-center select-none">
            <div className="flex items-center justify-center w-full bg-light p-2">
                <img src={logo} alt="logo" className="w-16 object-contain" />
                <h2 className="text-lg font-bold text-center text-white w-full">
                    {roleCurrent ? "Chỉnh sửa vai trò" : "Tạo vai trò"}
                </h2>
            </div>

            <form
                onSubmit={handleSubmit(handleSubmitForm)}
                className="flex flex-col gap-4 mt-4 w-full"
            >
                <InputForm
                    id="name"
                    register={register}
                    errors={errors}
                    fullWidth
                    validate={{ required: "Require this field" }}
                />

                <div className="ml-auto">
                    <button
                        type="button"
                        className={`${
                            globalCheckAll ? "bg-red-500" : "bg-green-500"
                        } text-white px-4 py-2 rounded`}
                        onClick={handleGlobalCheckBoxChange}
                    >
                        {globalCheckAll ? "Clear tất cả" : "Tất cả Module"}
                    </button>
                </div>
                {modules.map((module) => (
                    <div key={module.id} className="flex items-center my-2">
                        <div className="font-bold text-primary">
                            {module.name}
                        </div>
                        <div className="flex gap-2 ml-auto">
                            <CheckboxGroup
                                options={permissions.map((perm) => ({
                                    label: perm.name,
                                    value: perm.id,
                                }))}
                                value={checkedList[module.id] || []}
                                onChange={(list) =>
                                    handlePermissionChange(module.id, list)
                                }
                            />
                            <Checkbox
                                indeterminate={
                                    indeterminate[module.id] || false
                                }
                                checked={checkAll[module.id] || false}
                                onChange={(e) =>
                                    handleCheckAllChange(
                                        module.id,
                                        e.target.checked
                                    )
                                }
                                className={`${
                                    checkAll[module.id]
                                        ? "text-red-600"
                                        : "text-green-600"
                                }`}
                            >
                                {checkAll[module.id]
                                    ? "Xóa tất cả"
                                    : "Chọn tất cả"}
                            </Checkbox>
                        </div>
                    </div>
                ))}

                <textarea
                    rows={4}
                    placeholder="Mô tả..."
                    {...register("description")}
                    className="border rounded p-2"
                />
                <button
                    type="submit"
                    className="w-full p-2 text-lg text-white bg-light"
                >
                    {roleCurrent ? "Update" : "Create"}
                </button>
            </form>
        </div>
    );
}

export default RoleForm;
