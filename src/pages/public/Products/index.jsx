import { useEffect, useMemo, useState } from "react";

import {
    Button,
    Checkbox,
    Col,
    Input,
    notification,
    Row,
    Select,
    Skeleton,
    Tooltip,
} from "antd";
import { getProductCate } from "apis/productCate.api";
import withBaseComponent from "hocs";
import {
    changeLoading,
    clearFilterParams,
    setFilterParams,
} from "store/slicers/common.slicer";
import { getProductListRequest } from "store/slicers/product.slicer";

import Product from "./Product";
import {
    BRAND_DATA_OPTIONS,
    COLOR_DATA_OPTIONS,
    COLOR_DATA_OPTIONS_PANEL,
    MATERIAL_DATA_OPTIONS,
    SIZE_DATA_OPTIONS,
} from "constant/filterData";
import Icons from "utils/icons";
import { useNavigate } from "react-router-dom";
import QueryString from "qs";
import paths from "constant/paths";
import { HashLoader } from "react-spinners";
import ReactStars from "react-stars";
import useDebounce from "hooks/useDebounce";
import { capitalizeWords, formatCurrency, formatMoney } from "utils/helper";

function Products({ useSelector, dispatch }) {
    const navigate = useNavigate();
    const [filterCategories, setFilterCategories] = useState([]);
    const [isLoadingCategory, setIsLoadingCategory] = useState(true);
    const { filterParams } = useSelector((state) => state.common);
    const { productList } = useSelector((state) => state.product);
    const [keyword, setKeyword] = useState("");
    const keywordDebounce = useDebounce(keyword, 400);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);

    useEffect(() => {
        handleFilter("keyword", keywordDebounce);
    }, [keywordDebounce]);

    const handleFetchCategory = async () => {
        try {
            const res = await getProductCate();
            setFilterCategories(res.result.content);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingCategory(false);
        }
    };

    useEffect(() => {
        dispatch(changeLoading());
        handleFetchCategory();
        dispatch(
            getProductListRequest({
                ...filterParams,
                page: 1,
                limit: +process.env.REACT_APP_LIMIT_PRODUCT_PAGE,
            })
        );
        dispatch(changeLoading());
        window.scrollTo(0, 0);
        return () => dispatch(clearFilterParams());
    }, []);

    const deleteFilterParam = (key) => {
        const newFilterParams = {
            ...filterParams,
        };
        delete newFilterParams[key];

        dispatch(setFilterParams(newFilterParams));
        dispatch(getProductListRequest(newFilterParams));
        navigate({
            pathname: paths.PRODUCTS,
            search: QueryString.stringify(newFilterParams),
        });
    };

    const handleFilter = (key, value) => {
        const newFilterParams = {
            ...filterParams,
            [key]: value,
            page: 1,
            limit: +process.env.REACT_APP_LIMIT_PRODUCT_PAGE,
        };

        if (key === "color") delete newFilterParams.size;
        if (key === "size") delete newFilterParams.color;

        dispatch(setFilterParams(newFilterParams));

        dispatch(getProductListRequest(newFilterParams));

        navigate({
            pathname: paths.PRODUCTS,
            search: QueryString.stringify(newFilterParams),
        });
    };

    const handleFillByPrice = () => {
        if (!minPrice && !maxPrice) {
            notification.warning({
                message: "Nhập vào ô input giá",
                duration: 1,
            });
            return;
        }

        const newFilterParams = {
            ...filterParams,
            page: 1,
            limit: +process.env.REACT_APP_LIMIT_PRODUCT_PAGE,
        };

        if (minPrice) newFilterParams.minPrice = minPrice;
        else delete newFilterParams.minPrice;

        if (maxPrice) newFilterParams.maxPrice = maxPrice;
        else delete newFilterParams.maxPrice;

        dispatch(setFilterParams(newFilterParams));

        dispatch(getProductListRequest(newFilterParams));

        navigate({
            pathname: paths.PRODUCTS,
            search: QueryString.stringify(newFilterParams),
        });
    };

    const renderCategoryList = useMemo(() => {
        return filterCategories.map((item) => {
            return (
                <Col key={item} span={24}>
                    <Checkbox value={item?.slug}>
                        <div className="flex items-center gap-2">
                            <img src={item.image} className="w-8 h-8"></img>
                            <span>{item.name}</span>
                        </div>
                    </Checkbox>
                </Col>
            );
        });
    }, [filterCategories, filterParams]);

    const handleShowMore = () => {
        dispatch(
            getProductListRequest({
                ...filterParams,
                page: productList.meta.page + 1,
                limit: +process.env.REACT_APP_LIMIT_PRODUCT_PAGE,
                more: true,
            })
        );
    };

    const filterRender = useMemo(
        () => (
            <div className="relative ">
                <aside className="sticky top-20 w-full bg-white px-4 py-6 rounded-lg shadow-md min-h-[85vh]">
                    <h2 className="text-sm font-semibold mb-4 text-gray-600 ">
                        Khám phá thời trang của bạn
                    </h2>

                    <div className="mb-4 flex flex-col gap-2">
                        <h3 className="mb-2 text-gray-700 font-bold">
                            Khoảng giá
                        </h3>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center gap-2">
                                <Input
                                    placeholder="₫ TỪ"
                                    allowClear
                                    value={minPrice}
                                    onChange={(e) =>
                                        setMinPrice(e.target.value)
                                    }
                                ></Input>
                                <div className="h-1 bg-gray-600 w-8"></div>
                                <Input
                                    placeholder="₫ ĐẾN"
                                    allowClear
                                    value={maxPrice}
                                    onChange={(e) =>
                                        setMaxPrice(e.target.value)
                                    }
                                ></Input>
                            </div>
                            <div className="flex justify-end text-gray-500 text-sm italic gap-2">
                                {minPrice && (
                                    <span>Từ {formatCurrency(minPrice)}</span>
                                )}
                                {maxPrice && (
                                    <span> đến {formatCurrency(maxPrice)}</span>
                                )}
                            </div>
                            <Button
                                className="bg-primary text-white"
                                onClick={() => {
                                    handleFillByPrice();
                                }}
                            >
                                Áp dụng
                            </Button>
                        </div>
                    </div>

                    <div className="mb-4 flex flex-col gap-2">
                        <h3 className="mb-2 text-gray-700 font-bold">
                            Màu sắc
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                            {COLOR_DATA_OPTIONS_PANEL.map((el) => (
                                <div
                                    onClick={() =>
                                        handleFilter("color", el.key)
                                    }
                                    className={`w-9 h-9 rounded-full border border-gray-400 ${
                                        el.color
                                    } cursor-pointer ${
                                        filterParams?.color == el.key &&
                                        " shadow-md shadow-blue-600 border-blue-600"
                                    }`}
                                ></div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4 flex flex-col gap-2">
                        <h3 className="mb-2 text-gray-700 font-bold">
                            Loại sản phẩm
                        </h3>
                        <Skeleton loading={isLoadingCategory} active>
                            <Checkbox.Group
                                className="flex flex-col gap-2"
                                onChange={(values) =>
                                    handleFilter("category", values.join(","))
                                }
                                value={filterParams.category}
                            >
                                <div>{renderCategoryList}</div>
                            </Checkbox.Group>
                        </Skeleton>
                    </div>

                    <div className="mb-4 flex flex-col gap-2">
                        <h3 className="mb-1 text-gray-700 font-bold">
                            Đánh giá
                        </h3>
                        <div className="flex flex-col gap-2">
                            <div
                                className={`cursor-pointer p-2  ${
                                    filterParams?.stars === 5 &&
                                    `border rounded bg-gray-200 font-bold`
                                }`}
                                onClick={() => handleFilter("stars", 5)}
                            >
                                <ReactStars
                                    value={5}
                                    color2="#E9C71B"
                                    edit={false}
                                    size={18}
                                    className="cursor-pointer"
                                />
                            </div>
                            <div
                                className={` flex gap-2  p-2 items-center cursor-pointer ${
                                    filterParams?.stars === 4 &&
                                    `border rounded bg-gray-200 font-bold`
                                }`}
                                onClick={() => handleFilter("stars", 4)}
                            >
                                <div>
                                    <ReactStars
                                        value={4}
                                        color2="#E9C71B"
                                        edit={false}
                                        size={18}
                                    />
                                </div>
                                <div>trở lên</div>
                            </div>
                            <div
                                className={` flex gap-2  p-2 items-center cursor-pointer ${
                                    filterParams?.stars === 3 &&
                                    `border rounded bg-gray-200 font-bold`
                                }`}
                                onClick={() => handleFilter("stars", 3)}
                            >
                                <div>
                                    <ReactStars
                                        value={3}
                                        color2="#E9C71B"
                                        edit={false}
                                        size={18}
                                    />
                                </div>
                                <div>trở lên</div>
                            </div>
                            <div
                                className={` flex gap-2  p-2 items-center cursor-pointer ${
                                    filterParams?.stars === 2 &&
                                    `border rounded bg-gray-200 font-bold`
                                }`}
                                onClick={() => handleFilter("stars", 2)}
                            >
                                <div>
                                    <ReactStars
                                        value={2}
                                        color2="#E9C71B"
                                        edit={false}
                                        size={18}
                                    />
                                </div>
                                <div>trở lên</div>
                            </div>
                            <div
                                className={` flex gap-2  p-2 items-center cursor-pointer ${
                                    filterParams?.stars === 1 &&
                                    `border rounded bg-gray-200 font-bold`
                                }`}
                                onClick={() => handleFilter("stars", 1)}
                            >
                                <div>
                                    <ReactStars
                                        value={1}
                                        color2="#E9C71B"
                                        edit={false}
                                        size={18}
                                    />
                                </div>
                                <div>trở lên</div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        ),
        [
            filterCategories,
            isLoadingCategory,
            filterParams,
            minPrice,
            maxPrice,
            COLOR_DATA_OPTIONS_PANEL,
        ]
    );

    const productsRender = useMemo(
        () => (
            <div className="w-4/5  rounded">
                <div className="p-2 bg-white flex flex-col gap-2">
                    <div className="flex items-center gap-2 justify-between">
                        <h1 className="text-primary">Tất cả sản phẩm</h1>
                        <div className="flex items-center gap-2">
                            {filterParams?.stars && (
                                <div className="bg-slate-100 border rounded flex items-center px-4 gap-2 py-2 justify-between">
                                    <p className="text-primary text-lg">
                                        {filterParams?.stars} sao
                                    </p>
                                    <p
                                        className="h-6 w-6 rounded bg-red-500 text-white  flex items-center justify-center cursor-pointer"
                                        onClick={() =>
                                            deleteFilterParam("stars")
                                        }
                                    >
                                        <span>x</span>
                                    </p>
                                </div>
                            )}
                            {filterParams?.brand && (
                                <div className="bg-slate-100 border rounded flex items-center px-4 gap-2 py-2 justify-between">
                                    <p className=" text-lg">
                                        <span className="text-gray-600">
                                            Thương hiệu{" "}
                                        </span>
                                        <span className="text-primary">
                                            {capitalizeWords(
                                                filterParams?.brand
                                            )}
                                        </span>
                                    </p>
                                    <p
                                        className="h-6 w-6 rounded bg-red-500 text-white  flex items-center justify-center cursor-pointer"
                                        onClick={() =>
                                            deleteFilterParam("brand")
                                        }
                                    >
                                        <span>x</span>
                                    </p>
                                </div>
                            )}
                            {filterParams?.category?.length > 0 && (
                                <div className="bg-slate-100 border rounded flex items-center px-4 gap-2 py-2 justify-between">
                                    <p className="text-primary">
                                        {filterParams?.category}
                                    </p>
                                    <p
                                        className="h-6 w-6 rounded bg-red-500 text-white  flex items-center justify-center cursor-pointer"
                                        onClick={() =>
                                            deleteFilterParam("category")
                                        }
                                    >
                                        <span>x</span>
                                    </p>
                                </div>
                            )}
                            {filterParams?.size && (
                                <div className="bg-slate-100 border rounded flex items-center px-4 gap-2 py-2 justify-between">
                                    <p className=" text-lg">
                                        <span className="text-gray-600">
                                            Kích thước{" "}
                                        </span>
                                        <span className="text-primary">
                                            {capitalizeWords(
                                                filterParams?.size
                                            )}
                                        </span>
                                    </p>
                                    <p
                                        className="h-6 w-6 rounded bg-red-500 text-white  flex items-center justify-center cursor-pointer"
                                        onClick={() =>
                                            deleteFilterParam("size")
                                        }
                                    >
                                        <span>x</span>
                                    </p>
                                </div>
                            )}
                            {filterParams?.material && (
                                <div className="bg-slate-100 border rounded flex items-center px-4 gap-2 py-2 justify-between">
                                    <p className=" text-lg">
                                        <span className="text-gray-600">
                                            Chất liệu{" "}
                                        </span>
                                        <span className="text-primary">
                                            {capitalizeWords(
                                                filterParams?.material
                                            )}
                                        </span>
                                    </p>
                                    <p
                                        className="h-6 w-6 rounded bg-red-500 text-white  flex items-center justify-center cursor-pointer"
                                        onClick={() =>
                                            deleteFilterParam("material")
                                        }
                                    >
                                        <span>x</span>
                                    </p>
                                </div>
                            )}
                            {filterParams?.color && (
                                <div className="bg-slate-100 border rounded flex items-center px-4 gap-2 py-2 justify-between">
                                    <p className=" text-lg">
                                        <span className="text-gray-600">
                                            Màu :{" "}
                                        </span>
                                        <span className="text-primary">
                                            {capitalizeWords(
                                                filterParams?.color
                                            )}
                                        </span>
                                    </p>
                                    <p
                                        className="h-6 w-6 rounded bg-red-500 text-white  flex items-center justify-center cursor-pointer"
                                        onClick={() =>
                                            deleteFilterParam("color")
                                        }
                                    >
                                        <span>x</span>
                                    </p>
                                </div>
                            )}
                            {filterParams?.minPrice && (
                                <div className="bg-slate-100 border rounded flex items-center px-4 gap-2 py-2 justify-between">
                                    <p className="text-primary">
                                        {formatCurrency(
                                            +filterParams?.minPrice
                                        )}{" "}
                                        trở lên
                                    </p>
                                    <p
                                        className="h-6 w-6 rounded bg-red-500 text-white  flex items-center justify-center cursor-pointer"
                                        onClick={() =>
                                            deleteFilterParam("minPrice")
                                        }
                                    >
                                        <span>x</span>
                                    </p>
                                </div>
                            )}
                            {filterParams?.maxPrice && (
                                <div className="bg-slate-100 border rounded flex items-center px-4 gap-2 py-2 justify-between">
                                    <p className="text-primary">
                                        {formatCurrency(
                                            +filterParams?.maxPrice
                                        )}{" "}
                                        trở xuống
                                    </p>
                                    <p
                                        className="h-6 w-6 rounded bg-red-500 text-white  flex items-center justify-center cursor-pointer"
                                        onClick={() =>
                                            deleteFilterParam("maxPrice")
                                        }
                                    >
                                        <span>x</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2 items-center justify-between py-2 border-b">
                        <div>
                            <h2 className="text-gray-500">Thương hiệu</h2>
                            <div className="flex gap-2">
                                {BRAND_DATA_OPTIONS.slice(0, 4).map((el) => (
                                    <div
                                        key={el}
                                        className={`text-nowrap border px-2 py-1 rounded cursor-pointer  ${
                                            filterParams?.brand == el &&
                                            "border-blue-600 text-blue-600"
                                        } `}
                                        onClick={() =>
                                            handleFilter("brand", el)
                                        }
                                    >
                                        {el}
                                    </div>
                                ))}
                                <Tooltip
                                    title={
                                        <div className="p-2 flex gap-2 flex-wrap">
                                            {BRAND_DATA_OPTIONS.slice(
                                                4,
                                                BRAND_DATA_OPTIONS.length
                                            ).map((el) => (
                                                <div
                                                    key={el}
                                                    className={`text-nowrap border px-2 py-1 rounded cursor-pointer  ${
                                                        filterParams?.brand ==
                                                            el &&
                                                        "border-blue-600 text-blue-600"
                                                    } `}
                                                    onClick={() => {
                                                        handleFilter(
                                                            "brand",
                                                            el
                                                        );
                                                    }}
                                                >
                                                    {el}
                                                </div>
                                            ))}
                                        </div>
                                    }
                                    placement="bottom"
                                >
                                    <Button className="rounded-full">
                                        <Icons.FaChevronDown />
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="border-l px-4">
                            <h2 className="text-gray-500">Size</h2>
                            <div className="flex gap-2">
                                {SIZE_DATA_OPTIONS.slice(0, 4).map((el) => (
                                    <div
                                        key={el}
                                        className={`text-nowrap border px-2 py-1 rounded cursor-pointer  ${
                                            filterParams?.size == el &&
                                            "border-blue-600 text-blue-600"
                                        } `}
                                        onClick={() => {
                                            handleFilter("size", el);
                                        }}
                                    >
                                        {el}
                                    </div>
                                ))}
                                <Tooltip
                                    title={
                                        <div className="p-2 flex gap-2">
                                            {SIZE_DATA_OPTIONS.slice(
                                                4,
                                                SIZE_DATA_OPTIONS.length
                                            ).map((el) => (
                                                <div
                                                    key={el}
                                                    className={`text-nowrap border px-2 py-1 rounded cursor-pointer  ${
                                                        filterParams?.size ==
                                                            el &&
                                                        "border-blue-600 text-blue-600"
                                                    } `}
                                                    onClick={() => {
                                                        handleFilter(
                                                            "size",
                                                            el
                                                        );
                                                    }}
                                                >
                                                    {el}
                                                </div>
                                            ))}
                                        </div>
                                    }
                                    placement="bottom"
                                >
                                    <Button className="rounded-full">
                                        <Icons.FaChevronDown />
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="border-l px-4">
                            <h2 className="text-gray-500">Chất liệu</h2>
                            <div className="flex gap-2">
                                {MATERIAL_DATA_OPTIONS.slice(0, 4).map((el) => (
                                    <div
                                        key={el}
                                        className={`text-nowrap border px-2 py-1 rounded cursor-pointer  ${
                                            filterParams?.material == el &&
                                            "border-blue-600 text-blue-600"
                                        } `}
                                        onClick={() => {
                                            handleFilter("material", el);
                                        }}
                                    >
                                        {el}
                                    </div>
                                ))}
                                <Tooltip
                                    title={
                                        <div className="p-2 flex gap-2">
                                            {MATERIAL_DATA_OPTIONS.slice(
                                                4,
                                                MATERIAL_DATA_OPTIONS.length
                                            ).map((el) => (
                                                <div
                                                    key={el}
                                                    className={`text-nowrap border px-2 py-1 rounded cursor-pointer  ${
                                                        filterParams?.material ==
                                                            el &&
                                                        "border-blue-600 text-blue-600"
                                                    } `}
                                                    onClick={() => {
                                                        handleFilter(
                                                            "material",
                                                            el
                                                        );
                                                    }}
                                                >
                                                    {el}
                                                </div>
                                            ))}
                                        </div>
                                    }
                                    placement="bottom"
                                >
                                    <Button className="rounded-full">
                                        <Icons.FaChevronDown />
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="border-l px-2">
                            <Button className="rounded-full">
                                <span>Tất cả</span>
                                <Icons.CiFilter />
                            </Button>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="flex gap-2 items-center">
                            <Select
                                defaultValue="Sắp xếp"
                                style={{ width: 150 }}
                                onChange={(value) =>
                                    handleFilter("sort", value)
                                }
                            >
                                <Select.Option value="sold.desc">
                                    Phổ biến
                                </Select.Option>
                                <Select.Option value="stars.desc">
                                    Đánh giá cao
                                </Select.Option>
                                <Select.Option value="price.asc">
                                    Giá thấp đến cao
                                </Select.Option>
                                <Select.Option value="price.desc">
                                    Giá cao đến thấp
                                </Select.Option>
                            </Select>
                        </div>
                        <Input.Search
                            allowClear
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            enterButton
                            placeholder="Tìm kiếm theo từ khóa"
                        ></Input.Search>
                    </div>
                </div>

                {!productList.loading && (
                    <div className="p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {productList.data.map((product) => (
                            <Product data={product} />
                        ))}
                    </div>
                )}

                {productList.loading && (
                    <HashLoader
                        size={100}
                        color="#b683df"
                        className="mx-auto mt-20"
                    />
                )}
                {!productList.loading &&
                    productList.meta?.page < productList.meta?.totalPage && (
                        <Button
                            className="mt-4 flex justify-center mx-auto text-primary"
                            onClick={() => handleShowMore()}
                        >
                            Xem thêm
                        </Button>
                    )}
            </div>
        ),
        [productList, keyword, filterParams]
    );

    return (
        <div className="flex flex-col p-2">
            <div className=" bg-gray-100 min-h-screen flex pt-10 px-2 gap-2 md:px-8">
                {filterRender}
                {productsRender}
            </div>
        </div>
    );
}

export default withBaseComponent(Products);
