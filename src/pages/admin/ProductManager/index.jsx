import { Button, Input, notification, Select, Tooltip } from "antd";
import { deleteProduct, getProducts } from "apis/product.api";
import { deleteProductCate, getProductCate } from "apis/productCate.api";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import Icons from "utils/icons";
import Pagination from "../components/Pagination";
import logo from "assets/images/logo.jpg";
import { generatePath, useNavigate } from "react-router-dom";
import paths from "constant/paths";
import { trunCateText } from "utils/helper";
import useDebounce from "hooks/useDebounce";
import { getProductBrands } from "apis/productBrand.api";
import { HashLoader } from "react-spinners";
import ReactStars from "react-stars";

function ProductCategoryManager() {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [products, setProducts] = useState([]);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [keyword, setKeyword] = useState("");
    const searchDebounce = useDebounce(keyword, 600);
    const [filterCategories, setFilterCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filterBrands, setFilterBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedSort, setSelectedSort] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFetchCategory = async () => {
        try {
            const res = await getProductCate();
            setFilterCategories(res.result.content);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFetchBrand = async () => {
        try {
            const res = await getProductBrands();
            setFilterBrands(res.result.content);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleFetchCategory();
        handleFetchBrand();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const params = {
                limit,
                page,
            };

            if (searchDebounce) params.keyword = searchDebounce;
            if (selectedCategory) params.category = selectedCategory;
            if (selectedBrand) params.brand = selectedBrand;

            if (selectedSort) {
                params.sortBy = selectedSort.split(".")[0];
                params.orderBy = selectedSort.split(".")[1];
            }

            const res = await getProducts(params);
            setProducts(res?.result?.content);
            setTotalPages(res?.result?.totalPages);
            setTotalElements(res?.result?.totalElements);
        } catch (error) {
            notification.error({ message: error.message, duration: 2 });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, [page]);

    useEffect(() => {
        setPage(1);
        fetchProducts();
    }, [limit, searchDebounce, selectedCategory, selectedBrand, selectedSort]);

    const handleMouseEnter = (index) => {
        if (hoveredRow != index) setHoveredRow(index);
    };

    const handleMouseLeave = () => {
        setHoveredRow(null);
    };

    const handleDelete = async (id) => {
        dispatch(changeLoading());
        try {
            await deleteProduct(id);
            notification.success({ message: "Xóa thành công..." });
            fetchProducts();
        } catch (error) {
            const message =
                error.code == 1009
                    ? "Sản phẩm tồn tại trong loại này"
                    : "Lỗi vui lòng thử lại...";

            notification.error({
                message,
                duration: 2,
            });
        }
        dispatch(changeLoading());
    };

    return (
        <div className="w-full p-4 flex flex-col  overflow-auto min-h-full">
            <div className="h-[75px] flex gap-2 items-center justify-between p-4 border-b border-blue-300">
                <div className="text-2xl font-bold flex justify-between items-center w-full ">
                    <img
                        src={logo}
                        alt="logo"
                        className="w-16 object-contain"
                        data-aos="fade"
                    />
                    <span data-aos="fade-up">Danh sách sản phẩm</span>
                    <Button
                        color="green"
                        className="bg-green-600 text-white"
                        onClick={() => navigate(paths.ADMIN.UPDATE_PRODUCT)}
                    >
                        <span>Tạo</span>
                        <Icons.FaPlus />
                    </Button>
                </div>
            </div>

            {/* filter */}
            <div className="flex gap-4 mb-4 justify-between items-center p-4 bg-white mt-2 rounded">
                <div className="flex gap-2">
                    <Select
                        placeholder="Lọc theo loại"
                        value={selectedCategory}
                        onChange={(value) => setSelectedCategory(value)}
                        style={{ width: "200px" }}
                        allowClear
                    >
                        {filterCategories.map((el) => (
                            <Select.Option value={el?.slug}>
                                {el.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="Lọc theo thương hiệu"
                        value={selectedBrand}
                        onChange={(value) => setSelectedBrand(value)}
                        style={{ width: "200px" }}
                        allowClear
                    >
                        {filterBrands.map((el) => (
                            <Select.Option value={el?.slug}>
                                {el.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <Select
                        defaultValue="Sắp xếp"
                        style={{ width: 150 }}
                        onChange={(value) => setSelectedSort(value)}
                        allowClear
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
                <Input
                    placeholder="Search by keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    allowClear
                    addonAfter={<Icons.IoIosSearch />}
                    style={{ width: "300px" }}
                />
            </div>
            {!isLoading && (
                <div className="flex flex-col border justify-between">
                    <table className="table-auto rounded p-2 bg-slate-50 mb-1 text-left w-full border-separate  transition-all duration-300 ease-in">
                        <thead className="font-bold  text-white text-[13px] text-center border border-blue-300">
                            <tr>
                                <th className="px-4 py-2 bg-gradient-to-r from-primary to-secondary">
                                    #
                                </th>
                                <th className="px-4 py-2 bg-gradient-to-r from-primary to-secondary">
                                    Tên sản phẩm
                                </th>
                                <th className="px-4 py-2 bg-gradient-to-r from-primary to-secondary">
                                    Thương hiệu
                                </th>
                                <th className="px-4 py-2 bg-gradient-to-r from-primary to-secondary">
                                    Loại
                                </th>
                                <th className="px-4 py-2 bg-gradient-to-r from-primary to-secondary">
                                    Biến thể
                                </th>
                                <th className="px-4 py-2 bg-gradient-to-r from-primary to-secondary">
                                    Số lượng
                                </th>
                                <th className="px-4 py-2 bg-gradient-to-r from-primary to-secondary">
                                    Sao trung bình
                                </th>
                                <th className="px-4 py-2 bg-gradient-to-r from-primary to-secondary">
                                    Đã bán
                                </th>
                                <th className="px-4 py-2 bg-gradient-to-r from-primary to-secondary">
                                    Cập nhật lúc
                                </th>
                                <th className="px-4 py-2 bg-gradient-to-r from-primary to-secondary">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products?.map((e, index) => (
                                <Tooltip
                                    title={
                                        e?.skus ? (
                                            <img
                                                src={
                                                    e.skus[0]?.images?.split(
                                                        ","
                                                    )[0]
                                                }
                                                alt={"Image product..."}
                                                className="w-[240px] h-auto rounded"
                                            />
                                        ) : (
                                            <span></span>
                                        )
                                    }
                                    placement="top"
                                >
                                    <tr
                                        key={e.id}
                                        className=" relative "
                                        onMouseEnter={() =>
                                            handleMouseEnter(e.id)
                                        }
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <td className="px-2 py-1 border border-slate-500 text-center  font-bold">
                                            {index + 1}
                                        </td>
                                        <td className="px-2 py-1 border border-slate-500   font-bold">
                                            <span>
                                                {trunCateText(e?.name, 24)}
                                            </span>
                                        </td>
                                        <td className="px-2 py-1 border border-slate-500  font-bold">
                                            <span>{e?.brand?.name}</span>
                                        </td>
                                        <td className="px-2 py-1 border border-slate-500  font-bold">
                                            <span>{e?.category?.name}</span>
                                        </td>
                                        <td className="px-2 py-1 border border-slate-500  font-bold">
                                            <span>{e?.skus.length}</span>
                                        </td>
                                        <td className="px-2 py-1 border border-slate-500  font-bold">
                                            <span>
                                                {e?.skus?.reduce(
                                                    (prev, cur) =>
                                                        prev +
                                                        (cur?.stock || 0),
                                                    0
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-2 py-1 border border-slate-500  font-bold text-center">
                                            <span className="text-center">
                                                <ReactStars
                                                    value={e?.stars}
                                                    size={30}
                                                    half={true}
                                                    edit={false}
                                                />
                                            </span>
                                        </td>
                                        <td className="px-2 py-1 border border-slate-500  font-bold text-center">
                                            {e?.totalSold}
                                        </td>
                                        <td className="px-2 py-1 border border-slate-500  font-bold text-center">
                                            {e?.updatedAt ? (
                                                <span>
                                                    {moment(
                                                        e?.updatedAt
                                                    ).format("DD/MM/YYYY")}
                                                </span>
                                            ) : (
                                                <span>N/A</span>
                                            )}
                                        </td>
                                        <td className="px-1 py-2 h-full flex  gap-4 items-center justify-center border border-slate-500">
                                            <Tooltip title="Chỉnh sửa">
                                                <Button
                                                    className="bg-blue-500 text-white"
                                                    onClick={() =>
                                                        navigate(
                                                            paths.ADMIN
                                                                .UPDATE_PRODUCT +
                                                                `?id=${e?.id}`
                                                        )
                                                    }
                                                >
                                                    <Icons.FaEdit />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Duplicate">
                                                <Button
                                                    className="bg-purple-500 text-white"
                                                    onClick={() =>
                                                        navigate(
                                                            generatePath(
                                                                paths.ADMIN
                                                                    .DUPLICATE_PRODUCT,
                                                                { id: e?.id }
                                                            )
                                                        )
                                                    }
                                                >
                                                    <Icons.IoDuplicateOutline />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Xóa">
                                                <Button
                                                    className="bg-red-500 text-white"
                                                    onClick={() =>
                                                        handleDelete(e?.id)
                                                    }
                                                >
                                                    <Icons.MdDeleteForever />
                                                </Button>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                </Tooltip>
                            ))}
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
            )}
            {isLoading && (
                <HashLoader
                    size={100}
                    color="#b683df"
                    className="mx-auto mt-20"
                />
            )}
        </div>
    );
}

export default ProductCategoryManager;
