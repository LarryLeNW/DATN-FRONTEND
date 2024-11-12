import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import TopDealProduct from "pages/public/Home/TopDealProduct";
import { getProductCate } from "apis/productCate.api";
import { getProducts } from "apis/product.api";
import DOMPurify from "dompurify";
import { formatCurrency } from "utils/formatCurrency";
import { trunCateText } from "utils/helper";

const TopProducts = () => {
    const [blogs, setBlogs] = useState([]);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [showAllCategories, setShowAllCategories] = useState(false);  // state to toggle category display

    // Fetch categories from API
    const fetchCategories = async () => {
        const params = {
            limit,
            page,
        };

        const res = await getProductCate();
        setCategories(res?.result?.content);
    };

    // Fetch products from API
    const fetchProducts = async () => {
        const params = {
            limit,
            page,
        };

        const res = await getProducts();
        setProducts(res?.result?.content);
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const toggleShowCategories = () => {
        setShowAllCategories(!showAllCategories);
    };//quản lý tất cả danh mục

    return (
        <div className="flex flex-col md:flex-row">
            {/* Category Section */}
            <div className="md:w-1/5 w-full md:sticky md:top-20 bg-white p-4 md:p-6 rounded-lg shadow-xl space-y-6 max-h-screen overflow-y-auto">
                <h2 className="text-xl font-semibold text-center text-gray-800">Danh mục</h2>
                <div className="space-y-4">
                    {/* Hiển thị tối đa 4 mục danh mục trên màn hình nhỏ */}
                    {categories &&
                        (showAllCategories ? categories : categories.slice(0, 4)).map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-3 rounded-lg hover:bg-indigo-100 cursor-pointer transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
                            >
                                <img
                                    src={item.image}
                                    className="w-14 h-14 object-cover rounded-full transition-all duration-200 ease-in-out"
                                    alt={item.name}
                                />
                                <span className="text-gray-800 text-lg font-medium">{item.name}</span>
                            </div>
                        ))}
                </div>

                {/* Nút "Xem thêm" */}
                <div className="text-center mt-4">
                    <button
                        onClick={toggleShowCategories}
                        className="text-blue-500 font-medium hover:underline"
                    >
                        {showAllCategories ? "Thu gọn" : "Xem thêm"}
                    </button>
                </div>
            </div>

            {/* Product Section */}
            <div className="md:w-4/5 w-full p-4">
                <div>
                    <TopDealProduct />
                </div>
                <h1 className="text-center text-red-600 text-3xl mt-5">Gợi ý hôm nay</h1>
                <div className="bg-gray-100 lg:max-w-7xl sm:max-w-full mt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products &&
                            products.map((product) => (
                                <div
                                    key={product?.id}
                                    className="bg-white rounded-2xl p-2 cursor-pointer hover:-translate-y-2 transition-all relative"
                                >
                                    <div className="bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer absolute top-4 right-4">
                                        {/* Icon */}
                                    </div>

                                    <div className="w-5/6 h-[210px] overflow-hidden mx-auto aspect-w-16 aspect-h-8 md:mb-2 mb-4">
                                        <img
                                            src={product.skus[0]?.images.split(",")[0]}
                                            alt={product.name}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-normal text-gray-800">
                                            {trunCateText({ text: product.name, maxLength: 50 })}
                                        </h3>

                                        <h4 className="text-lg text-red-600 font-bold mt-4">
                                            Giá: {formatCurrency(product.skus[0]?.price)}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Size: {product.skus[0]?.attributes.size} - Màu: {product.skus[0]?.attributes.color}
                                        </p>
                                        <p className="text-sm text-green-500 mt-2">
                                            Giảm giá: {product.skus[0]?.discount}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopProducts;
