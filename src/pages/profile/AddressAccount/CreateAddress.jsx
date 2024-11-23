import { Button, Input, notification, Select } from "antd";
import { getDistricts, getProvinces, getWards } from "apis/address.api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function CreateAddress() {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    const fetchProvinces = async () => {
        try {
            const res = await getProvinces();
            setProvinces(res.data.data.data);
        } catch (error) {
            console.log("🚀 ~ fetchProvinces ~ error:", error);
        }
    };

    const fetchDistricts = async () => {
        if (!selectedProvince) return;
        setSelectedDistrict(null);
        setSelectedWard(null);
        try {
            const res = await getDistricts(selectedProvince);
            setDistricts(res.data.data.data);
        } catch (error) {
            notification.warning({
                message:
                    "Api get địa chỉ đã giới hạn. Xin lỗi vì bất tiện này vui lòng thử lại sau 20s",
                duration: 1,
                placement: "top",
            });
        }
    };

    const fetchWards = async () => {
        if (!selectedDistrict) return;
        try {
            const res = await getWards(selectedDistrict);
            setWards(res.data.data.data);
        } catch (error) {
            notification.warning({
                message:
                    "Api get địa chỉ đã giới hạn. Xin lỗi vì bất tiện này vui lòng thử lại sau 20s",
                duration: 1,
                placement: "top",
            });
        }
    };

    useEffect(() => {
        fetchProvinces();
    }, []);

    useEffect(() => {
        fetchDistricts();
    }, [selectedProvince]);

    useEffect(() => {
        fetchWards();
    }, [selectedDistrict]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        values: {
            typeAddress: "HOME",
        },
    });

    return (
        <div className="flex flex-col ">
            <h1 className="text-2xl mb-4">Tạo sổ địa chỉ</h1>
            <div className="bg-white p-4 rounded">
                <form action="" className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center w-full">
                        <p className="w-32 text-nowrap">Họ và tên:</p>
                        <input
                            type="text"
                            placeholder="Nhập tên"
                            {...register("username", {
                                required: "Yêu cầu nhập tên người dùng",
                            })}
                            className="w-full py-2 px-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex gap-4 items-center w-full">
                        <p className="w-32 text-nowrap">Công ty:</p>
                        <input
                            type="text"
                            placeholder="Nhập công ty"
                            {...register("company_name")}
                            className="w-full py-2 px-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex gap-4 items-center w-full">
                        <p className="w-32 text-nowrap">Số điện thoại:</p>
                        <input
                            type="text"
                            placeholder="Nhập số điện thoại"
                            {...register("numberPhone", {
                                required: "Yêu cầu nhập số điện thoại",
                            })}
                            className="w-full py-2 px-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex gap-4 items-center w-full">
                            <p className="w-32 text-nowrap">Tỉnh/Thành phố:</p>
                            <Select
                                showSearch
                                id="city"
                                allowClear
                                placeholder={"Chọn thành phố"}
                                className={`w-full text-lg font-bold ${
                                    errors["city"]
                                        ? "shadow-md shadow-red-500 rounded-lg text-red-500"
                                        : ""
                                }`}
                                value={selectedProvince}
                                optionFilterProp="label"
                                options={provinces?.map((el) => ({
                                    label: el?.name,
                                    value: el?.code,
                                }))}
                                onChange={(value) => {
                                    setSelectedProvince(value);
                                }}
                            />
                        </div>
                        <div className="flex gap-4 items-center w-full">
                            <p className="w-32 text-nowrap">Quận huyện:</p>
                            <Select
                                showSearch
                                id="district"
                                allowClear
                                placeholder={"Chọn quận huyện"}
                                className={`w-full text-lg font-bold ${
                                    errors["district"]
                                        ? "shadow-md shadow-red-500 rounded-lg text-red-500"
                                        : ""
                                }`}
                                value={selectedDistrict}
                                optionFilterProp="label"
                                options={districts?.map((el) => ({
                                    label: el?.name,
                                    value: el?.code,
                                }))}
                                onChange={(value) => {
                                    setSelectedDistrict(value);
                                }}
                            />
                        </div>
                        <div className="flex gap-4 items-center w-full">
                            <p className="w-32 text-nowrap">Phường xã:</p>
                            <Select
                                showSearch
                                id="ward"
                                allowClear
                                placeholder={"Nhập phường"}
                                className={`w-full text-lg font-bold ${
                                    errors["ward"]
                                        ? "shadow-md shadow-red-500 rounded-lg text-red-500"
                                        : ""
                                }`}
                                value={selectedWard}
                                optionFilterProp="label"
                                options={wards?.map((el) => ({
                                    label: el?.name,
                                    value: el?.code,
                                }))}
                                onChange={(value) => {
                                    setSelectedWard(value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 items-center w-full">
                        <p className="w-32 text-nowrap">Địa chỉ:</p>
                        <textarea
                            type="text"
                            placeholder="Nhập địa chỉ "
                            {...register("street")}
                            className="w-full py-2 px-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex gap-4 items-center w-full">
                        <p className="w-32 text-nowrap">Loại Địa chỉ:</p>
                        <div className="flex gap-8">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="HOME"
                                    {...register("typeAddress", {
                                        required: "Chọn loại địa chỉ",
                                    })}
                                    className="hidden peer"
                                />
                                <span className="w-5 h-5 rounded-full border-2 border-gray-500 peer-checked:border-indigo-500 peer-checked:bg-indigo-500"></span>
                                Nhà riêng / Chung cư
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="COMPANY"
                                    {...register("typeAddress", {
                                        required: "Chọn loại địa chỉ",
                                    })}
                                    className="hidden peer"
                                />
                                <span className="w-5 h-5 rounded-full border-2 border-gray-500 peer-checked:border-indigo-500 peer-checked:bg-indigo-500"></span>
                                Cơ quan / Công ty
                            </label>
                        </div>
                    </div>
                    <Button
                        htmlType="submit"
                        className="bg-light text-lg font-bold text-white "
                    >
                        Cập nhật
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default CreateAddress;
