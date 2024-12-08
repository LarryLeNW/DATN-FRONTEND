import { notification, Radio, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import logo from "assets/images/logo.jpg";
import InputForm from "components/InputForm";
import MarkdownEditor from "components/MarkdownEditor";
import { changeLoading } from "store/slicers/common.slicer";
import { getProductCate } from "apis/productCate.api";
import { useDispatch } from "react-redux";
import { getProductBrands } from "apis/productBrand.api";
import { createProduct, getProductById, updateProduct } from "apis/product.api";
import ATTOptionPanel from "./ATTOptionPanel";
import SkuTable from "./SkuTable";
import ImageProductCtrl from "./ImageProductCtrl";
import { useLocation } from "react-router-dom";
import { fillUniqueATTSkus } from "utils/helper";

function UpdateProduct() {
    const dispatch = useDispatch();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [productCurrent, setProductCurrent] = useState({
        isLoading: false,
        data: null,
    });
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [isShowATTOptionPanel, setIsShowATTOptionPanel] = useState(false);
    const [isUpdateOption, setIsUpdateOption] = useState(true);
    const [variants, setVariants] = useState([
        {
            price: null,
            stock: null,
            code: null,
            discount: null,
            images: [],
        },
    ]);

    const [variantErrors, setVariantErrors] = useState([]);
    const [description, setDescription] = useState("");

    useEffect(() => {
        const fetchProductCurrent = async () => {
            const id = queryParams.get("id");
            if (id) {
                try {
                    setProductCurrent((prev) => ({ ...prev, isLoading: true }));
                    const res = await getProductById(id);

                    if (res.result) {
                        setProductCurrent((prev) => ({
                            ...prev,
                            data: res.result,
                        }));

                        setValue("name", res.result.name);
                        setDescription(res.result.description);
                        setSelectedCategory(res.result.category?.id);
                        setSelectedBrand(res.result.brand?.id);

                        const skus = res.result.skus || [];

                        if (skus.length > 1) {
                            setIsShowATTOptionPanel(true);
                            setIsUpdateOption(false);

                            const colorATT = fillUniqueATTSkus(skus, "color");
                            if (colorATT) {
                                setVariantAtts((prev) => [
                                    ...prev,
                                    {
                                        label: "Color",
                                        value: "color",
                                        options: colorATT.map((el) => ({
                                            raw: el.attributes?.color,
                                            images: el?.images.split(","),
                                        })),
                                    },
                                ]);
                            }

                            const sizeATT = fillUniqueATTSkus(skus, "size");
                            if (sizeATT) {
                                setVariantAtts((prev) => [
                                    ...prev,
                                    {
                                        label: "Size",
                                        value: "size",
                                        options: sizeATT.map((el) => ({
                                            raw: el.attributes?.size,
                                        })),
                                    },
                                ]);
                            }

                            const materialATT = fillUniqueATTSkus(
                                skus,
                                "material"
                            );
                            if (materialATT) {
                                setVariantAtts((prev) => [
                                    ...prev,
                                    {
                                        label: "Material",
                                        value: "material",
                                        options: materialATT.map((el) => ({
                                            raw: el.attributes?.material,
                                        })),
                                    },
                                ]);
                            }
                        }

                        setVariants(
                            skus.map((sku) => {
                                const variant = {
                                    id: sku.id,
                                    price: sku.price || null,
                                    stock: sku.stock || null,
                                    code: sku.code || null,
                                    discount: sku.discount || null,
                                    attributes: sku.attributes,
                                    images: sku.images
                                        ? sku.images.split(",")
                                        : [],
                                };

                                return variant;
                            })
                        );
                    }
                } catch (error) {
                    notification.error({ message: error.message, duration: 1 });
                }
                setProductCurrent((prev) => ({ ...prev, isLoading: false }));
            }
        };

        fetchProductCurrent();
    }, []);

    const [variantAtts, setVariantAtts] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        setError,
        clearErrors,
    } = useForm();

    const fetchCategories = async () => {
        const params = { limit: 30 };
        const res = await getProductCate(params);
        setCategories(res?.result?.content);
    };

    const fetchBrands = async () => {
        const params = { limit: 30 };
        const res = await getProductBrands(params);
        setBrands(res?.result?.content);
    };

    useEffect(() => {
        const handleFetchData = async () => {
            await Promise.all([fetchBrands(), fetchCategories()]);
        };

        handleFetchData();
    }, []);

    const validateVariants = () => {
        const errors = variants.map((variant) => {
            const variantError = {};
            if (!variant.code) variantError.code = "SKU code is required";
            if (!variant.price) variantError.price = "Price is required";
            if (!variant.stock) variantError.stock = "Stock is required";
            if (!variant.discount)
                variantError.discount = "Discount is required";
            return variantError;
        });
        setVariantErrors(errors);
        return errors.every((error) => Object.keys(error).length === 0);
    };

    const handleUpdateProduct = async (data) => {
        try {
            clearErrors("category");
            setVariantErrors([]);

            if (!selectedCategory) {
                setError("category", {
                    type: "manual",
                    message: "Category is required",
                });
                return;
            }

            if (!validateVariants()) {
                notification.error({
                    message: "Please fill all required fields",
                });
                return;
            }

            if (!productCurrent?.id) {
                let productData = {
                    ...data,
                    categoryId: selectedCategory,
                    description,
                    brandId: selectedBrand,
                };

                productData.skus = variants.map((el) => ({
                    ...el,
                    images: el.images.join(","),
                    attributes: el.attributes || {},
                }));
                console.log(
                    "🚀 ~ handleUpdateProduct ~ productData:",
                    productData
                );

                dispatch(changeLoading());
                productCurrent.data?.id
                    ? await updateProduct(productCurrent?.data?.id, productData)
                    : await createProduct(productData);

                notification.success({
                    message: productCurrent?.data?.id
                        ? "Cập nhật thành công"
                        : "Tạo thành công",
                });
            }
        } catch (error) {
            const errorMessage = productCurrent?.data?.id
                ? "Cập nhật không thành công..."
                : "Tạo không thành công...";

            notification.error({
                message: `${errorMessage}: ${error.message}`,
            });
        }
        dispatch(changeLoading());
    };

    const handleAttSkuTableChange = () => {
        const skus = [];

        const imagesFromFirstSku = variants[0]?.images || [];

        const generateSKUs = (
            attributes,
            index = 0,
            currentCombination = {}
        ) => {
            if (index === attributes?.length) {
                let images = [...imagesFromFirstSku];

                if (
                    imagesFromFirstSku.length > 0 &&
                    !currentCombination.images
                ) {
                    images = imagesFromFirstSku;
                }

                skus.push({
                    price: null,
                    stock: null,
                    discount: null,
                    attributes: currentCombination,
                    images: images,
                });

                return;
            }

            const attribute = attributes[index];
            const options = attribute.options || [];

            options.forEach((option) => {
                const newCombination = {
                    ...currentCombination,
                    [attribute.value]: option.raw,
                };

                generateSKUs(attributes, index + 1, newCombination);
            });
        };

        generateSKUs(variantAtts);

        setVariants(skus);
    };

    const setImagesProduct = useCallback(
        (value) => {
            setVariants((prev) => {
                const variantsUpdated = [...prev];
                variantsUpdated[0] = { ...variantsUpdated[0], images: value };
                return [...variantsUpdated];
            });
        },
        [variants[0]]
    );

    return (
        <div className="flex flex-col justify-center items-center px-6 py-4 ">
            <div className="flex  justify-between  w-full items-center border-b border-blue-300 ">
                <img
                    src={logo}
                    alt="logo"
                    className="w-20 object-contain"
                    data-aos="fade"
                />
                <div className="text-2xl font-bold" data-aos="fade">
                    {productCurrent ? `Update ` : "Create "} Product
                </div>
                <div></div>
            </div>

            <form
                className="flex flex-col w-full gap-2 mt-2 "
                onSubmit={handleSubmit(handleUpdateProduct)}
            >
                <div className="px-6 py-8 border rounded bg-white">
                    <div className="font-bold text-xl">Basic information</div>
                    <div className={"flex gap-2"}>
                        {/*image product */}
                        <ImageProductCtrl
                            title={"Product Image"}
                            images={variants[0]?.images || []}
                            setImages={setImagesProduct}
                        />
                        <div
                            className={
                                "flex-1 flex flex-col gap-4 justify-center  w-full"
                            }
                        >
                            {/*name product */}
                            <div className="p-2 border rounded border-primary">
                                <InputForm
                                    errors={errors}
                                    id={"name"}
                                    register={register}
                                    fullWidth
                                    validate={{
                                        required: `Require this field`,
                                    }}
                                    isShowLabel={false}
                                />
                            </div>
                            {/*category*/}
                            <div className="flex gap-4 px-2 py-4 border rounded border-primary">
                                <label
                                    htmlFor="category"
                                    className="text-lg font-bold text-nowrap text-primary"
                                >
                                    Category :
                                </label>
                                <Select
                                    showSearch
                                    id="category"
                                    title="Category"
                                    allowClear
                                    placeholder={
                                        errors?.category
                                            ? "Required a category"
                                            : "Select a category"
                                    }
                                    className={`w-full text-lg font-bold ${
                                        errors["category"]
                                            ? "shadow-md  shadow-red-500 rounded-lg text-red-500"
                                            : ""
                                    }`}
                                    value={selectedCategory}
                                    optionFilterProp="label"
                                    options={categories?.map((el) => ({
                                        label: el?.name,
                                        value: el?.id,
                                    }))}
                                    onChange={(value) =>
                                        setSelectedCategory(value)
                                    }
                                />
                            </div>
                            {/*  brand*/}
                            <div className="flex gap-4 px-2 py-4 border rounded border-primary">
                                <label
                                    htmlFor="brand"
                                    className="text-lg font-bold text-nowrap text-primary"
                                >
                                    Brand :
                                </label>
                                <Select
                                    optionFilterProp="label"
                                    showSearch
                                    id="brand"
                                    title="Brand"
                                    allowClear
                                    placeholder="Choose Brand"
                                    className="w-full text-lg font-bold"
                                    options={brands?.map((el) => ({
                                        label: el?.name,
                                        value: el?.id,
                                    }))}
                                    onChange={(value) =>
                                        setSelectedBrand(value)
                                    }
                                    value={selectedBrand}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col border justify-between p-6 gap-2 bg-white rounded">
                    <div className="flex  justify-between">
                        <div>
                            <p className="font-thin italic">
                                You can add variations if this product has
                                options, like size or color.
                            </p>
                            <Radio
                                onClick={() => {
                                    setIsShowATTOptionPanel(
                                        !isShowATTOptionPanel
                                    );
                                }}
                                checked={isShowATTOptionPanel}
                            >
                                Enable Variations
                            </Radio>
                        </div>
                        <div className="font-bold text-lg">
                            <div>Sales Information</div>
                        </div>
                    </div>

                    {isShowATTOptionPanel && (
                        <ATTOptionPanel
                            isUpdateOption={isUpdateOption}
                            variantAtts={variantAtts}
                            setVariantAtts={setVariantAtts}
                            handleAttSkuTableChange={handleAttSkuTableChange}
                            variants={variants}
                            setIsUpdateOption={setIsUpdateOption}
                        />
                    )}
                    <SkuTable
                        variantErrors={variantErrors}
                        setVariants={setVariants}
                        variants={variants}
                        variantAtts={variantAtts}
                    />
                </div>
                <MarkdownEditor
                    height={500}
                    label={"Description : "}
                    name={"description"}
                    id={"description"}
                    value={description}
                    register={register}
                    validate={{}}
                    errors={errors}
                    setValue={setDescription}
                />
                <button
                    className=" rounded px-4 py-2 bg-light text-lg text-white "
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default UpdateProduct;
