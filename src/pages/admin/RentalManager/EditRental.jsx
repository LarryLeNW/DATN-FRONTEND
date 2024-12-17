import { Button, Checkbox, Input, notification, Select } from "antd";
import { getProducts } from "apis/product.api";
import logo from "assets/images/logo.jpg";
import paths from "constant/paths";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HashLoader } from "react-spinners";
import {
    fillUniqueATTSkus,
    findSkuByMultipleAttributes,
    formatMoney,
} from "utils/helper";
import Pagination from "../components/Pagination";
import { getProductCate } from "apis/productCate.api";
import { getVouchers } from "apis/voucher.api";
import CouponCard from "pages/checkout/VoucherForm/Coupon";
import { useSelector } from "react-redux";
import { createRental, getRentalById, updateRental } from "apis/rental.api";
import { getDistricts, getProvinces, getWards } from "apis/address.api";
import { useForm } from "react-hook-form";
import useDebounce from "hooks/useDebounce";

function EditRental() {
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdateDelivery, setIsUpdateDelivery] = useState(false);
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        isLoading: false,
        data: [],
    });
    const { selectedVouchers } = useSelector((state) => state.voucher);
    const [limit, setLimit] = useState(8);
    const [page, setPage] = useState(1);
    const [detailRentals, setDetailRentals] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [totalDiscountVoucher, setTotalDiscountVoucher] = useState(0);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [keyword, setKeyword] = useState("");
    let keywordDebounce = useDebounce(keyword, 400);
    const params = useParams();
    const [rentalCurrent, setRentalCurrent] = useState({});

    useEffect(() => {
        const fetchInfoRentalUpdate = async () => {
            if (!params.id) throw new Error("not found data ");
            try {
                const res = await getRentalById(params.id);
                setRentalCurrent(res.result);
            } catch (error) {
                notification.warning({
                    message: "Không thể tải dữ liệu. Vui lòng thử lại.",
                    duration: 1,
                    placement: "top",
                });
                navigate(paths.ADMIN.RENTAL_MANAGEMENT);
            }
        };
        fetchInfoRentalUpdate();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm({
        values: {
            typeAddress: "HOME",
            street: "",
        },
    });

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
        fetchProvinces();
    }, []);

    useEffect(() => {
        fetchDistricts();
    }, [selectedProvince]);

    useEffect(() => {
        fetchWards();
    }, [selectedDistrict]);

    const calTotalRental = (sku) => {
        let total = 0;

        if (sku.hour) total += sku.hourlyRentPrice * sku.hour;

        if (sku.day) {
            total += sku.dailyRentPrice * sku.day;
        }

        return total * sku.quantity;
    };

    const selectedItems =
        detailRentals.flatMap((rental) =>
            rental.skus.filter((sku) => sku.isChoose)
        ) || [];

    const totalOrder = selectedItems.reduce(
        (sum, el) => (sum += calTotalRental(el)),
        0
    );

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const params = { limit: 30 };
            const res = await getProductCate(params);
            setCategories(res?.result?.content);
        };
        const fetchVouchers = async () => {
            const params = { limit: 30 };
            const res = await getVouchers(params);
            setVouchers(res?.result?.content);
        };
        fetchCategories();
        fetchVouchers();
    }, []);

    useEffect(() => {
        console.log(
            "🚀 ~ calculateDiscount ~ selectedVouchers.length:",
            selectedVouchers.length
        );
        const calculateDiscount = () => {
            if (selectedVouchers.data.length >= 1)
                setTotalDiscountVoucher(
                    selectedVouchers.data?.reduce((sum, prev) => {
                        if (prev.discount_type === "PERCENT") {
                            let value = sum + (prev.value / 100) * totalOrder;
                            return (
                                sum +
                                (value < prev.max_discount
                                    ? value
                                    : prev.max_discount)
                            );
                        } else return sum + prev.value;
                    }, 0)
                );
        };

        calculateDiscount();
    }, [selectedVouchers, totalOrder]);

    const fetchProducts = async () => {
        setProductData((prev) => ({ ...prev, isLoading: true }));
        try {
            const params = {
                limit,
                page,
                canBeRented: true,
            };

            if (selectedCategory) {
                params.category = selectedCategory;
            }

            if (keywordDebounce) {
                params.keyword = keywordDebounce;
            }

            const res = await getProducts(params);
            setProductData((prev) => ({ ...prev, ...res?.result }));
        } catch (error) {
            notification.error({
                message: error.message,
                duration: 2,
                placement: "top",
            });
        }
        setProductData((prev) => ({ ...prev, isLoading: false }));
    };

    useEffect(() => {
        if (Array.isArray(productData?.content)) {
            setDetailRentals(
                productData?.content?.reduce((acc, p, index) => {
                    const converted = convertRentalSku(p, index);
                    return acc.concat(converted);
                }, [])
            );
        } else {
            console.error(
                "productData.content is not an array:",
                productData?.content
            );
        }
    }, [productData?.content, rentalCurrent?.rentalDetails]);

    const convertRentalSku = (data, indexProduct) => {
        const convertRentalSkus = data?.skus?.reduce(
            (acc, current) => {
                if (
                    !acc.seen.has(current?.attributes["color"]) &&
                    !!current.attributes["color"] &&
                    current.canBeRented
                ) {
                    acc.seen.add(current?.attributes["color"]);
                    acc.result.push({
                        ...current,
                        quantity: 1,
                        hour: 1,
                        day: 0,
                        isChoose: false,
                        productId: data.id,
                        productName: data.name,
                    });
                }
                return acc;
            },
            { seen: new Set(), result: [] }
        ).result;

        if (convertRentalSkus.length > 1) {
            return { indexProduct, skus: convertRentalSkus };
        }

        return {
            indexProduct,
            skus: [
                {
                    ...data.skus[0],
                    quantity: 1,
                    hour: 1,
                    day: 0,
                    isChoose: false,
                    productId: data.id,
                    productName: data.name,
                },
            ],
        };
    };

    useEffect(() => {
        fetchProducts();
    }, [page, limit, selectedCategory, keywordDebounce]);

    const handleChangeConvertedSkus = (
        keyAtt,
        valueAtt,
        indexProduct,
        indexCV,
        indexSKU
    ) => {
        setDetailRentals((prev) => {
            const updatedRentals = [...prev];

            const currentRental = updatedRentals[indexCV];

            const updatedAttributes = {
                ...detailRentals[indexCV].skus[indexSKU].attributes,
                [keyAtt]: valueAtt,
            };

            const updatedSku = findSkuByMultipleAttributes(
                productData.content[indexProduct]?.skus || [],
                Object.entries(updatedAttributes)?.map(([key, value]) => ({
                    key,
                    value,
                }))
            );

            if (updatedSku) {
                updatedRentals[indexCV].skus[indexSKU] = {
                    ...currentRental.skus[indexSKU],
                    ...updatedSku,
                };
            }

            return updatedRentals;
        });
    };

    const handleCheckboxChange = (checked, indexCV, indexSKU) => {
        setDetailRentals((prev) => {
            const updatedRentals = [...prev];
            updatedRentals[indexCV].skus[indexSKU].isChoose = checked;
            return updatedRentals;
        });
    };

    const handleIncreaseQuantity = (indexCV, indexSKU) => {
        setDetailRentals((prev) => {
            const updatedRentals = [...prev];
            const sku = updatedRentals[indexCV].skus[indexSKU];
            sku.quantity += 1;
            return updatedRentals;
        });
    };

    const handleDecreaseQuantity = (indexCV, indexSKU) => {
        setDetailRentals((prev) => {
            const updatedRentals = [...prev];
            const sku = updatedRentals[indexCV].skus[indexSKU];
            if (sku.quantity > 1) sku.quantity -= 1;
            return updatedRentals;
        });
    };

    const handleQuantityChange = (value, indexCV, indexSKU) => {
        const parsedValue = Math.max(1, parseInt(value) || 1);
        setDetailRentals((prev) => {
            const updatedRentals = [...prev];
            updatedRentals[indexCV].skus[indexSKU].quantity = parsedValue;
            return updatedRentals;
        });
    };

    const handleHourChange = (value, indexCV, indexSKU) => {
        setDetailRentals((prev) => {
            const updatedRentals = [...prev];
            updatedRentals[indexCV].skus[indexSKU].hour = value;
            return updatedRentals;
        });
    };

    const handleDayChange = (value, indexCV, indexSKU) => {
        const parsedValue = Math.max(0, parseInt(value) || 0);
        setDetailRentals((prev) => {
            const updatedRentals = [...prev];
            updatedRentals[indexCV].skus[indexSKU].day = parsedValue;
            return updatedRentals;
        });
    };

    const handleRental = async (delivery) => {
        if (!totalOrder) {
            notification.warning({
                message: "Chưa chọn sản phẩm để đặt đơn thuê!",
                duration: 2,
                placement: "top",
            });
            return;
        }

        try {
            const dataPayload = {
                id: rentalCurrent.id,
                detailRentals: selectedItems.map((el) => ({
                    quantity: el.quantity,
                    productId: el.productId,
                    price: calTotalRental(el),
                    hour: el.hour,
                    day: el.day,
                    skuId: el.id,
                })),
                discountValue: totalDiscountVoucher,
                totalAmount: totalOrder - totalDiscountVoucher,
            };

            if (isUpdateDelivery) {
                dataPayload.delivery = { ...delivery, isDefault: false };
            }

            await updateRental(dataPayload);
            notification.success({
                message: "Sửa đơn thuê thành công!",
                duration: 2,
                placement: "top",
            });
            navigate(paths.ADMIN.RENTAL_MANAGEMENT);
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 2,
                placement: "top",
            });
        }
    };

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
                            Cập nhật Đơn thuê #{rentalCurrent.rentalCode}
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
            <div className="flex mt-2 gap-4">
                <div className="w-2/3 border rounded bg-white px-4 py-2">
                    <div className="flex items-center justify-between">
                        <div className="font-bold text-blue-600 p-2 border-b border-blue-600">
                            Chọn danh sách sản phẩm
                        </div>
                        <div className="flex gap-2 items-center">
                            <Select
                                defaultValue="Lọc theo loại"
                                style={{ width: 150 }}
                                onChange={(value) => setSelectedCategory(value)}
                                allowClear
                            >
                                {categories.map((el) => (
                                    <Select.Option value={el.slug}>
                                        {el.name}
                                    </Select.Option>
                                ))}
                            </Select>

                            <Input
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Tìm kiếm bằng từ khóa"
                            ></Input>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-2 max-h-[80vh] overflow-y-auto">
                        <div className="flex flex-col gap-2">
                            {detailRentals &&
                                detailRentals?.map((cvData, indexCV) => {
                                    {
                                        return cvData.skus.map(
                                            (sku, indexSKU) => (
                                                <div className="flex items-center gap-2 border p-4 ">
                                                    <Checkbox
                                                        checked={sku.isChoose}
                                                        onChange={(e) =>
                                                            handleCheckboxChange(
                                                                e.target
                                                                    .checked,
                                                                indexCV,
                                                                indexSKU
                                                            )
                                                        }
                                                    />
                                                    <div className=" flex  gap-2  ">
                                                        <img
                                                            src={
                                                                sku?.images?.split(
                                                                    ","
                                                                )[0]
                                                            }
                                                            alt=""
                                                            className="w-28 h-32 rounded border object-cover"
                                                        />
                                                        <div className="flex items-baseline justify-center gap-6 ">
                                                            <div>
                                                                <div className="font-bold text-primary">
                                                                    {
                                                                        sku?.productName
                                                                    }
                                                                </div>
                                                                {sku?.attributes
                                                                    ?.color && (
                                                                    <div className="flex gap-2 font-bold">
                                                                        <p>
                                                                            Màu
                                                                            :
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                sku
                                                                                    .attributes
                                                                                    ?.color
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                {sku.attributes
                                                                    ?.size &&
                                                                    productData?.content && (
                                                                        <div className="flex gap-2 flex-wrap items-center">
                                                                            <h1 className="text-blue-600 ">
                                                                                Kính
                                                                                thước
                                                                                :{" "}
                                                                            </h1>

                                                                            <div className="flex gap-2">
                                                                                {fillUniqueATTSkus(
                                                                                    productData
                                                                                        ?.content[
                                                                                        cvData
                                                                                            ?.indexProduct
                                                                                    ]
                                                                                        ?.skus,
                                                                                    "size"
                                                                                ).map(
                                                                                    (
                                                                                        el
                                                                                    ) => (
                                                                                        <div
                                                                                            onClick={() =>
                                                                                                handleChangeConvertedSkus(
                                                                                                    "size",
                                                                                                    el
                                                                                                        .attributes
                                                                                                        .size,
                                                                                                    cvData?.indexProduct,
                                                                                                    indexCV,
                                                                                                    indexSKU
                                                                                                )
                                                                                            }
                                                                                            className={`py-1 border rounded px-2 
                                                                            ${
                                                                                sku
                                                                                    .attributes
                                                                                    .size ===
                                                                                    el
                                                                                        .attributes
                                                                                        .size &&
                                                                                "shadow-md shadow-blue-600 "
                                                                            }
                                                                            `}
                                                                                        >
                                                                                            {
                                                                                                el
                                                                                                    .attributes
                                                                                                    .size
                                                                                            }
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                {sku.attributes
                                                                    ?.material &&
                                                                    productData?.content && (
                                                                        <div className="flex gap-2 flex-wrap items-center mt-2">
                                                                            <h1 className="text-blue-600 ">
                                                                                Chất
                                                                                liệu
                                                                                :{" "}
                                                                            </h1>

                                                                            <div className="flex gap-2">
                                                                                {fillUniqueATTSkus(
                                                                                    productData
                                                                                        ?.content[
                                                                                        cvData
                                                                                            ?.indexProduct
                                                                                    ]
                                                                                        ?.skus,
                                                                                    "material"
                                                                                ).map(
                                                                                    (
                                                                                        el
                                                                                    ) => (
                                                                                        <div
                                                                                            onClick={() =>
                                                                                                handleChangeConvertedSkus(
                                                                                                    "material",
                                                                                                    el
                                                                                                        .attributes
                                                                                                        .material,
                                                                                                    cvData?.indexProduct,
                                                                                                    indexCV,
                                                                                                    indexSKU
                                                                                                )
                                                                                            }
                                                                                            className={`py-1 border rounded px-2 
                                                                            ${
                                                                                sku
                                                                                    .attributes
                                                                                    .material ===
                                                                                    el
                                                                                        .attributes
                                                                                        .material &&
                                                                                "shadow-md shadow-blue-600 "
                                                                            }
                                                                            `}
                                                                                        >
                                                                                            {
                                                                                                el
                                                                                                    .attributes
                                                                                                    .material
                                                                                            }
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                <div className="flex gap-2 justify-between items-center mt-2">
                                                                    <div className="flex gap-2 bg-white px-2 py-1 flex-1 ">
                                                                        <span
                                                                            className="px-2 border border-blue-600 rounded-full text-lg cursor-pointer select-none"
                                                                            onClick={() =>
                                                                                handleDecreaseQuantity(
                                                                                    indexCV,
                                                                                    indexSKU
                                                                                )
                                                                            }
                                                                        >
                                                                            -
                                                                        </span>
                                                                        <Input
                                                                            type="number"
                                                                            className="w-20 text-center"
                                                                            value={
                                                                                sku.quantity
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleQuantityChange(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    indexCV,
                                                                                    indexSKU
                                                                                )
                                                                            }
                                                                        />
                                                                        <span
                                                                            className="px-2 border border-blue-600 rounded-full text-lg cursor-pointer select-none"
                                                                            onClick={() =>
                                                                                handleIncreaseQuantity(
                                                                                    indexCV,
                                                                                    indexSKU
                                                                                )
                                                                            }
                                                                        >
                                                                            +
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-2 flex gap-2 items-center">
                                                                        <p>
                                                                            Giờ:
                                                                        </p>
                                                                        <Select
                                                                            className="w-20"
                                                                            value={
                                                                                sku.hour
                                                                            }
                                                                            onChange={(
                                                                                value
                                                                            ) =>
                                                                                handleHourChange(
                                                                                    value,
                                                                                    indexCV,
                                                                                    indexSKU
                                                                                )
                                                                            }
                                                                            options={Array.from(
                                                                                {
                                                                                    length: 24,
                                                                                },
                                                                                (
                                                                                    _,
                                                                                    value
                                                                                ) => ({
                                                                                    label: `${value} Giờ`,
                                                                                    value,
                                                                                })
                                                                            )}
                                                                        />
                                                                    </div>

                                                                    <div className="flex-2 flex gap-2 items-center">
                                                                        <p>
                                                                            Ngày:
                                                                        </p>
                                                                        <Input
                                                                            type="number"
                                                                            className="w-20"
                                                                            value={
                                                                                sku.day
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleDayChange(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    indexCV,
                                                                                    indexSKU
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="flex gap-1 text-orange-700 justify-end">
                                                                    <p>
                                                                        Tổng
                                                                        tiền
                                                                    </p>
                                                                    <p>
                                                                        {formatMoney(
                                                                            calTotalRental(
                                                                                sku
                                                                            )
                                                                        )}{" "}
                                                                        vnđ
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        );
                                    }
                                })}
                        </div>
                    </div>
                </div>
                <div className="w-1/3 border rounded bg-white px-4 py-2 flex flex-col max-h-[90vh] overflow-auto">
                    <div className="font-bold text-primary p-2 border-b border-primary">
                        Thông tin đơn
                    </div>
                    <h1 className="text-lg mb-4 font-bold">Địa chỉ</h1>
                    {isUpdateDelivery && (
                        <div className="bg-white p-4 rounded w-full">
                            <Button
                                className="my-2 flex justify-end ml-auto"
                                onClick={() => setIsUpdateDelivery(false)}
                            >
                                Lấy địa chỉ hiện tại
                            </Button>
                            <form
                                onSubmit={handleSubmit(handleRental)}
                                className="flex flex-col gap-4"
                            >
                                <div className="flex gap-4 items-center w-full">
                                    <p className="w-32 text-nowrap">
                                        Họ và tên:
                                    </p>
                                    <input
                                        type="text"
                                        placeholder="Nhập tên"
                                        {...register("username", {
                                            required: isUpdateDelivery
                                                ? "Yêu cầu nhập tên người dùng"
                                                : false,
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
                                    <p className="w-32 text-nowrap">
                                        Số điện thoại:
                                    </p>
                                    <input
                                        type="text"
                                        placeholder="Nhập số điện thoại"
                                        {...register("numberPhone", {
                                            required: isUpdateDelivery
                                                ? "Yêu cầu nhập số điện thoại"
                                                : false,
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
                                <div className="flex gap-2 flex-col">
                                    <div className="flex gap-4 items-center w-full">
                                        <p className="w-32 text-nowrap">
                                            Tỉnh/Thành phố:
                                        </p>
                                        <Select
                                            showSearch
                                            id="city"
                                            allowClear
                                            placeholder={"Chọn thành phố"}
                                            className={`w-full text-lg font-bold `}
                                            value={selectedProvince?.index}
                                            optionFilterProp="label"
                                            options={provinces?.map(
                                                (el, index) => ({
                                                    label: el?.name,
                                                    value: index,
                                                })
                                            )}
                                            onChange={(index) => {
                                                setSelectedProvince({
                                                    index,
                                                    data: provinces[index],
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="flex gap-4 items-center w-full">
                                        <p className="w-32 text-nowrap">
                                            Quận huyện:
                                        </p>
                                        <Select
                                            showSearch
                                            id="district"
                                            allowClear
                                            placeholder={"Chọn quận huyện"}
                                            className={`w-full text-lg font-bold `}
                                            value={selectedDistrict?.index}
                                            optionFilterProp="label"
                                            options={districts?.map(
                                                (el, index) => ({
                                                    label: el?.name,
                                                    value: index,
                                                })
                                            )}
                                            onChange={(index) => {
                                                setSelectedDistrict({
                                                    index,
                                                    data: districts[index],
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="flex gap-4 items-center w-full">
                                        <p className="w-32 text-nowrap">
                                            Phường xã:
                                        </p>
                                        <Select
                                            showSearch
                                            id="ward"
                                            allowClear
                                            placeholder={"Nhập phường"}
                                            className={`w-full text-lg font-bold `}
                                            value={selectedWard?.index}
                                            optionFilterProp="label"
                                            options={wards?.map(
                                                (el, index) => ({
                                                    label: el?.name,
                                                    value: index,
                                                })
                                            )}
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
                                            required: isUpdateDelivery
                                                ? "Yêu cầu nhập địa chỉ"
                                                : false,
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
                                    <p className="w-32 text-nowrap">
                                        Loại Địa chỉ:
                                    </p>
                                    <div className="flex gap-8">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="HOME"
                                                {...register("typeAddress", {
                                                    required:
                                                        "Chọn loại địa chỉ",
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
                                                    required:
                                                        "Chọn loại địa chỉ",
                                                })}
                                                className="hidden peer"
                                            />
                                            <span className="w-5 h-5 rounded-full border-2 border-gray-500 peer-checked:border-indigo-500 peer-checked:bg-indigo-500"></span>
                                            Cơ quan / Công ty
                                        </label>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    {totalDiscountVoucher > 0 &&
                                        selectedItems.length > 0 && (
                                            <div className="flex gap-1 text-orange-700 justify-end">
                                                <p>Đã giảm </p>
                                                <p>
                                                    {formatMoney(
                                                        totalDiscountVoucher
                                                    )}{" "}
                                                    vnđ
                                                </p>
                                            </div>
                                        )}
                                    {selectedItems.length > 0 ? (
                                        <p className="flex justify-end my-2">
                                            <span>Tổng tiền :</span>
                                            <span className="font-bold text-primary">
                                                <span>
                                                    {formatMoney(
                                                        totalOrder -
                                                            totalDiscountVoucher
                                                    )}
                                                    đ
                                                </span>
                                            </span>
                                        </p>
                                    ) : (
                                        <span className="text-primary justify-end flex">
                                            Vui lòng chọn sản phẩm thuê
                                        </span>
                                    )}

                                    <Button
                                        className="flex bg-primary text-white w-full"
                                        htmlType="submit"
                                    >
                                        Hoàn thành{" "}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                    {!isUpdateDelivery && (
                        <>
                            <span>
                                {rentalCurrent?.delivery?.street}
                                {rentalCurrent?.delivery?.ward && (
                                    <span>
                                        , {rentalCurrent?.delivery?.ward}
                                    </span>
                                )}
                                {rentalCurrent?.delivery?.district && (
                                    <span>
                                        , {rentalCurrent?.delivery?.district}
                                    </span>
                                )}
                                {rentalCurrent?.delivery?.city && (
                                    <span>
                                        , {rentalCurrent?.delivery?.city}
                                    </span>
                                )}
                                <span>
                                    {" "}
                                    <Button
                                        className="text-white bg-green-700"
                                        onClick={() =>
                                            setIsUpdateDelivery(true)
                                        }
                                    >
                                        Sửa
                                    </Button>
                                </span>
                            </span>
                            <div className="mt-auto">
                                {totalDiscountVoucher > 0 &&
                                    selectedItems.length > 0 && (
                                        <div className="flex gap-1 text-orange-700 justify-end">
                                            <p>Đã giảm </p>
                                            <p>
                                                {formatMoney(
                                                    totalDiscountVoucher
                                                )}{" "}
                                                vnđ
                                            </p>
                                        </div>
                                    )}
                                {selectedItems.length > 0 ? (
                                    <p className="flex justify-end my-2">
                                        <span>Tổng tiền :</span>
                                        <span className="font-bold text-primary">
                                            <span>
                                                {formatMoney(totalOrder)}đ
                                            </span>
                                        </span>
                                    </p>
                                ) : (
                                    <span className="text-primary justify-end flex">
                                        Vui lòng chọn sản phẩm thuê
                                    </span>
                                )}

                                <Button
                                    className="flex bg-primary text-white w-full"
                                    onClick={() => handleRental()}
                                >
                                    Hoàn thành{" "}
                                </Button>
                            </div>
                        </>
                    )}

                    <div className="my-2 flex justify-between">
                        <p>Áp dụng mã giảm giá</p>
                        <p className="text-gray-700"> Chỉ áp dụng được 2</p>
                    </div>
                    <div className="flex flex-col gap-2 flex-1  ">
                        {vouchers.map((el) => (
                            <CouponCard
                                data={el}
                                Unused={el?.min_order > totalOrder}
                                isAnimation={false}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {isLoading && (
                <HashLoader
                    size={100}
                    color="#b683df"
                    className="mx-auto mt-20"
                />
            )}
            {productData?.content?.length > 1 && (
                <div class="flex w-full justify-start p-2 ">
                    <Pagination
                        listLimit={[10, 25, 40, 100]}
                        limitCurrent={limit}
                        setLimit={setLimit}
                        totalPages={productData?.totalPages}
                        setPage={setPage}
                        pageCurrent={page}
                        totalElements={productData?.totalElements}
                    />
                </div>
            )}
        </div>
    );
}

export default EditRental;
