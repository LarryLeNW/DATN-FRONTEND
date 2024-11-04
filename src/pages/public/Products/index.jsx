import { useEffect, useMemo, useState } from "react";

import { Skeleton } from "antd";
import { getProductCate } from "apis/productCate.api";
import withBaseComponent from "hocs";
import { changeLoading, clearFilterParams } from "store/slicers/common.slicer";
import { getProductListRequest } from "store/slicers/product.slicer";

function Products({ useSelector, dispatch }) {
    const [filterCategories, setFilterCategories] = useState([]);
    const [isLoadingCategory, setIsLoadingCategory] = useState(true);
    const { filterParams } = useSelector((state) => state.common);
    const { productList } = useSelector((state) => state.product);
    console.log("🚀 ~ Products ~ productList:", productList)

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

    const filterRender = useMemo(
        () => (
            <div className="relative">
                <aside className="sticky top-20 w-full bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Filters
                    </h2>
                    <div className="mb-4 flex flex-col gap-2">
                        <div>
                            <h3>Name</h3>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                                placeholder="Tìm theo tên SP"
                            />
                        </div>
                        <h3 className="mb-2">Category :</h3>
                        <Skeleton loading={isLoadingCategory} active>
                            <ul className="flex flex-col gap-2">
                                {filterCategories.map((cate) => (
                                    <li
                                        key={cate?.id}
                                        className="flex border px-2 py-1 rounded items-center gap-4"
                                    >
                                        <img
                                            src={cate?.image}
                                            alt={cate?.name}
                                            width={"40px"}
                                            height={"40px"}
                                        />
                                        <p>{cate?.name}</p>
                                    </li>
                                ))}
                            </ul>
                        </Skeleton>
                    </div>
                </aside>
            </div>
        ),
        [filterCategories, isLoadingCategory]
    );

    const productsRender = useMemo(
        () => (
            <div className="w-3/4 p-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            data-aos="fade-up"
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-56 object-cover"
                            />
                            <div className="p-5">
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                    {product.name}
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    ${product.price.toFixed(2)}
                                </p>
                                <div className="flex items-center gap-4">
                                    <button>
                                        <Icons.FaShoppingCart size={24} />
                                    </button>
                                    <Link to={paths.DETAIL_PRODUCT}>
                                        <span className="text-blue-700 hover:underline text-sm">
                                            Xem chi tiết sản phẩm
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))} */}
                </div>
            </div>
        ),
        []
    );

    return (
        <div className="bg-gray-100 min-h-screen flex pt-10 px-2 gap-2 md:px-8">
            {filterRender}
            {productsRender}
        </div>
    );
}

export default withBaseComponent(Products);
