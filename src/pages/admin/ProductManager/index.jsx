import { notification, Tooltip } from "antd";
import { getProducts } from "apis/product.api";
import { deleteProductCate } from "apis/productCate.api";
import Button from "components/Button";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import Icons from "utils/icons";
import Pagination from "../components/Pagination";
import logo from "assets/images/logo.jpg";

function ProductCategoryManager() {
    const dispatch = useDispatch();

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [products, setProducts] = useState([]);
    const [hoveredRow, setHoveredRow] = useState(null);

    const fetchProducts = async () => {
        dispatch(changeLoading());
        try {
            const params = {
                limit,
                page,
            };
            const res = await getProducts(params);
            setProducts(res?.result?.content);
            setTotalPages(res?.result?.page.totalPages);
            setTotalElements(res?.result?.page.totalElements);
        } catch (message) {
            notification.error({ message, duration: 2 });
        }
        dispatch(changeLoading());
    };

    useEffect(() => {
        fetchProducts();
    }, [page, limit]);

    const handleMouseEnter = (index) => {
        if (hoveredRow != index) setHoveredRow(index);
    };

    const handleMouseLeave = () => {
        setHoveredRow(null);
    };

    const handleDelete = async (id) => {
        dispatch(changeLoading());
        try {
            await deleteProductCate(id);
            notification.success({ message: "Delete Successfully" });
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

    const openFormUpdate = (data) => {};

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
                    <span data-aos="fade-up">Product</span>
                    <Button
                        iconBefore={<Icons.FaPlus />}
                        name="Create"
                        handleClick={() => openFormUpdate()}
                        style={
                            "border rounded bg-green-600 cursor-pointer px-4 py-2 text-white text-sm"
                        }
                    />
                </div>

                {/* <div className="flex gap-4">
                    <div className="border border-main p-2 rounded h-full flex flex-col gap-2 ">
                        <span className="text-white">Search By Category :</span>
                        <select
                            name="sort"
                            id=""
                            className="w-full text-black"
                            onChange={(e) => {
                                if (e.target.value === "all") {
                                    const { category, prevParams } = params;
                                    setParams(prevParams);
                                    return;
                                }
                                handleFilter("category", e.target.value);
                            }}
                        >
                            <option className=" p-2" value="all">
                                all categories
                            </option>
                            {categories?.data?.map((el) => (
                                <option
                                    className=" p-2"
                                    key={el?.title}
                                    value={el?.title}
                                >
                                    {el?.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div> */}
            </div>
            <div className="p-4">
                {/* <div className="flex justify-around gap-2 items-center h-[15vh]  text-black p-2">
                    <div className="border border-main p-2 rounded h-full flex flex-col gap-2 ">
                        <span className="text-white">SORT BY :</span>
                        <select
                            name="sort"
                            id=""
                            onChange={(e) =>
                                handleFilter("sort", e.target.value)
                            }
                            className="w-full text-black"
                        >
                            <option className=" p-2" value="" disabled>
                                Option
                            </option>
                            <option className=" p-2" value="price">
                                Low To High Price
                            </option>
                            <option className=" p-2" value="-price">
                                High To Low Price
                            </option>
                            <option className=" p-2" value="-totalRatings">
                                Appreciate
                            </option>
                            <option className=" p-2" value="-sold">
                                Most Purchases
                            </option>
                            <option className=" p-2" value="-quantity">
                                High To Low Quantity
                            </option>
                            <option className=" p-2" value="quantity">
                                Low To Hight Quantity
                            </option>
                        </select>
                    </div>
                    <div className="border border-main p-4 rounded h-full">
                        <span className="text-white">Filter Price :</span>
                        <div className="flex gap-1">
                            <input
                                type="number"
                                placeholder="Price From"
                                onChange={(e) =>
                                    handleFilter("priceFrom", e.target.value)
                                }
                                className="p-2  outline-main"
                            />
                            <input
                                type="number"
                                placeholder="Price To"
                                onChange={(e) =>
                                    handleFilter("priceTo", e.target.value)
                                }
                                className="p-2  outline-main"
                            />
                        </div>
                    </div>
                    <div className="border border-main p-4 rounded h-full flex justify-around items-center gap-2">
                        <input
                            type="text"
                            value={keyword}
                            placeholder="search products by key ..."
                            onChange={(e) => setKeyword(e.target.value)}
                            className="p-2 flex-2 outline-main"
                        />
                        <button
                            className="text-white flex-1 cursor-pointer border text-sm  bg-green-600 "
                            onClick={() => navigate(path.ADMIN.UPDATE_PRODUCT)}
                        >
                            Create Product
                        </button>
                    </div>
                </div> */}
            </div>
            <div className="flex flex-col border justify-between">
                <table
                    data-aos="zoom-in"
                    className="table-auto rounded p-2 bg-slate-50 mb-1 text-left w-full border-separate  transition-all duration-300 ease-in"
                >
                    <thead className="font-bold bg-light text-white text-[13px] text-center border border-blue-300">
                        <tr>
                            <th className="px-4 py-2">#</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Brand</th>
                            <th className="px-4 py-2">Category</th>
                            <th className="px-4 py-2">SKUS</th>
                            <th className="px-4 py-2">STOCK</th>
                            <th className="px-4 py-2">Modified At</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products?.map((e, index) => (
                            <Tooltip
                                title={
                                    e?.skus ? (
                                        <img
                                            src={
                                                e.skus[0]?.images?.split(",")[0]
                                            }
                                            alt={e.skus[0].code}
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
                                    onMouseEnter={() => handleMouseEnter(e.id)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <td className="px-2 py-1 border border-slate-500 text-center text-lg font-bold">
                                        {index + 1}
                                    </td>
                                    <td className="px-2 py-1 border border-slate-500  text-lg font-bold">
                                        <span>{e?.name}</span>
                                    </td>
                                    <td className="px-2 py-1 border border-slate-500 text-lg font-bold">
                                        <span>{e?.brand?.name}</span>
                                    </td>
                                    <td className="px-2 py-1 border border-slate-500 text-lg font-bold">
                                        <span>{e?.category?.name}</span>
                                    </td>
                                    <td className="px-2 py-1 border border-slate-500 text-lg font-bold">
                                        <span>{e?.skus.length}</span>
                                    </td>
                                    <td className="px-2 py-1 border border-slate-500 text-lg font-bold">
                                        <span>
                                            {e?.skus?.reduce(
                                                (prev, cur) =>
                                                    prev + (cur?.stock || 0),
                                                0
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-2 py-1 border border-slate-500 text-lg font-bold text-center">
                                        {e?.updatedAt ? (
                                            <span>
                                                {moment(e?.updatedAt).format(
                                                    "DD/MM/YYYY"
                                                )}
                                            </span>
                                        ) : (
                                            <span>N/A</span>
                                        )}
                                    </td>
                                    {/* <td className="px-2 py-1 border border-slate-500">
                                        <span
                                            className="line-clamp-4"
                                            dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(
                                                    e?.description
                                                ),
                                            }}
                                        ></span>
                                    </td> */}

                                    <td className="px-1 py-2 h-full flex  gap-4 items-center justify-center border border-slate-500">
                                        <Button
                                            name={"Edit"}
                                            handleClick={() =>
                                                openFormUpdate(e)
                                            }
                                            style={
                                                "border rounded bg-blue-600 cursor-pointer px-4 py-2 text-white text-sm"
                                            }
                                            iconBefore={<Icons.FaEdit />}
                                        />
                                        <Button
                                            name={"Delete"}
                                            style={
                                                "border rounded bg-red-600 cursor-pointer px-4 py-2 text-white text-sm"
                                            }
                                            handleClick={() =>
                                                handleDelete(e?.id)
                                            }
                                            iconBefore={
                                                <Icons.MdDeleteForever />
                                            }
                                        />
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
        </div>
    );
}

export default ProductCategoryManager;
