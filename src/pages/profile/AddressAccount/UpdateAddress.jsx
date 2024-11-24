import { Button, Checkbox, Input, notification, Select } from "antd";
import { getDistricts, getProvinces, getWards } from "apis/address.api";
import { createDelivery, getDelivery, updateDelivery } from "apis/delivery.api";
import paths from "constant/paths";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

function UpdateAddress() {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [isDefault, setIsDefault] = useState(false);
    const navigate = useNavigate();
    const params = useParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
        setValue,
    } = useForm({
        values: {
            typeAddress: "HOME",
            street: "",
        },
    });

    const fetchDeliveryToForm = async () => {
        try {
            // Fetch thông tin Delivery từ API
            const res = await getDelivery(params?.id);

            if (res?.result) {
                // Điền các giá trị cơ bản vào form
                setValue("username", res.result.username);
                setValue("company_name", res.result.company_name);
                setValue("numberPhone", res.result.numberPhone);
                setValue("street", res.result.street);
                setValue("typeAddress", res.result.typeAddress);
                setIsDefault(res.result.isDefault);

                // Fetch danh sách provinces
                const responseProvince = await getProvinces();
                const provincesData = responseProvince.data.data.data;
                setProvinces(provincesData);

                // Tìm province hiện tại
                const provinceMatch = provincesData.find(
                    (p) => p.code === res.result.city_id
                );
                if (provinceMatch) {
                    setSelectedProvince({
                        index: provincesData.indexOf(provinceMatch),
                        data: provinceMatch,
                    });

                    // Fetch danh sách districts dựa trên province hiện tại
                    const responseDistrict = await getDistricts(
                        provinceMatch.code
                    );
                    const districtsData = responseDistrict.data.data.data;
                    setDistricts(districtsData);

                    // Tìm district hiện tại
                    const districtMatch = districtsData.find(
                        (d) => d.code === res.result.district_id
                    );
                    if (districtMatch) {
                        setSelectedDistrict({
                            index: districtsData.indexOf(districtMatch),
                            data: districtMatch,
                        });

                        // Fetch danh sách wards dựa trên district hiện tại
                        const responseWard = await getWards(districtMatch.code);
                        const wardsData = responseWard.data.data.data;
                        setWards(wardsData);

                        // Tìm ward hiện tại
                        const wardMatch = wardsData.find(
                            (w) => w.code === res.result.ward_id
                        );
                        if (wardMatch) {
                            setSelectedWard({
                                index: wardsData.indexOf(wardMatch),
                                data: wardMatch,
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error("🚀 ~ fetchDeliveryToForm ~ error:", error);
            notification.warning({
                message: "Không thể tải dữ liệu. Vui lòng thử lại.",
                duration: 1,
                placement: "top",
            });
        }
    };

    useEffect(() => {
        fetchDeliveryToForm();
    }, []);

    const fetchDistricts = async () => {
        if (!selectedProvince) return;
        setSelectedDistrict(null);
        setSelectedWard(null);
        try {
            const res = await getDistricts(selectedProvince?.data?.code);
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
            const res = await getWards(selectedDistrict?.data?.code);
            setWards(res.data.data.data);
            setSelectedWard(null);
        } catch (error) {
            notification.warning({
                message:
                    "Api get địa chỉ đã giới hạn. Xin lỗi vì bất tiện này vui lòng thử lại sau 20s",
                duration: 5,
                placement: "top",
            });
        }
    };

    useEffect(() => {
        fetchDistricts();
    }, [selectedProvince]);

    useEffect(() => {
        fetchWards();
    }, [selectedDistrict]);

    const handleCreateDelivery = async (data) => {
        const payload = { ...data, isDefault };

        if (selectedProvince) {
            payload.city_id = selectedProvince?.data?.code;
            payload.city = selectedProvince?.data?.name;
        }

        if (selectedDistrict) {
            payload.district_id = selectedDistrict?.data?.code;
            payload.district = selectedDistrict?.data?.name;
        }

        if (selectedWard) {
            payload.ward_id = selectedWard?.data?.code;
            payload.ward = selectedWard?.data?.name;
        }

        try {
            await updateDelivery(params?.id, payload);
            notification.success({
                message: "Tạo thành công",
                placement: "top",
                duration: 1,
            });
            navigate(paths.MEMBER.ADDRESS_ACCOUNT);
        } catch (error) {
            notification.error({
                message: error?.message,
                placement: "top",
                duration: 2,
            });
        }
    };

    return (
        <div className="flex flex-col ">
            <h1 className="text-lg mb-4 font-bold">Chỉnh sửa địa chỉ</h1>
            <div className="bg-white p-4 rounded">
                <form
                    onSubmit={handleSubmit(handleCreateDelivery)}
                    className="flex flex-col gap-4"
                >
                    <div className="flex gap-4 items-center w-full">
                        <p className="w-32 text-nowrap">Họ và tên:</p>
                        <input
                            type="text"
                            placeholder="Nhập tên"
                            {...register("username", {
                                required: "Yêu cầu nhập tên người dùng",
                            })}
                            className={`w-full py-2 px-2 border rounded-lg focus:outline-none ${
                                errors.username
                                    ? "border-red-500"
                                    : "focus:border-indigo-500"
                            }`}
                        />
                    </div>
                    {errors["username"] && (
                        <p className="text-red-500 text-sm">
                            {errors?.username?.message}
                        </p>
                    )}
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
                            className={`w-full py-2 px-2 border rounded-lg focus:outline-none ${
                                errors?.numberPhone
                                    ? "border-red-500"
                                    : "focus:border-indigo-500"
                            }`}
                        />
                    </div>
                    {errors["numberPhone"] && (
                        <p className="text-red-500 text-sm">
                            {errors?.numberPhone?.message}
                        </p>
                    )}
                    <div className="flex gap-2">
                        <div className="flex gap-4 items-center w-full">
                            <p className="w-32 text-nowrap">Tỉnh/Thành phố:</p>
                            <Select
                                showSearch
                                id="city"
                                allowClear
                                placeholder={"Chọn thành phố"}
                                className={`w-full text-lg font-bold `}
                                value={selectedProvince?.index}
                                optionFilterProp="label"
                                options={provinces?.map((el, index) => ({
                                    label: el?.name,
                                    value: index,
                                }))}
                                onChange={(index) => {
                                    setSelectedProvince({
                                        index,
                                        data: provinces[index],
                                    });
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
                                className={`w-full text-lg font-bold `}
                                value={selectedDistrict?.index}
                                optionFilterProp="label"
                                options={districts?.map((el, index) => ({
                                    label: el?.name,
                                    value: index,
                                }))}
                                onChange={(index) => {
                                    setSelectedDistrict({
                                        index,
                                        data: districts[index],
                                    });
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
                                className={`w-full text-lg font-bold `}
                                value={selectedWard?.index}
                                optionFilterProp="label"
                                options={wards?.map((el, index) => ({
                                    label: el?.name,
                                    value: index,
                                }))}
                                onChange={(index) => {
                                    setSelectedWard({
                                        index,
                                        data: wards[index],
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 items-center w-full">
                        <p className="w-32 text-nowrap">Địa chỉ:</p>
                        <textarea
                            type="text"
                            placeholder="Nhập địa chỉ "
                            {...register("street", {
                                required: "Yêu cầu nhập địa chỉ",
                            })}
                            className={`w-full py-2 px-2 border rounded-lg focus:outline-none ${
                                errors?.street
                                    ? "border-red-500"
                                    : "focus:border-indigo-500"
                            }`}
                        />
                    </div>
                    {errors["street"] && (
                        <p className="text-red-500 text-sm">
                            {errors?.street?.message}
                        </p>
                    )}
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
                    <Checkbox
                        checked={isDefault}
                        onChange={() => setIsDefault(!isDefault)}
                    >
                        Đặt địa chỉ làm mặt định
                    </Checkbox>
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

export default UpdateAddress;
