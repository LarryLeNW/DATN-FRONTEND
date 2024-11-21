import React, { useEffect, useState } from "react";
import TopDealProduct from "pages/public/Home/TopDealProduct";
import { getProductCate } from "apis/productCate.api";
import { getProducts } from "apis/product.api";
import { formatCurrency } from "utils/formatCurrency";
import { trunCateText } from "utils/helper";

const TopProducts = () => {
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Cập nhật kích thước màn hình và lắng nghe thay đổi
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getProductCate();
            setCategories(res?.result?.content);
        };

        const fetchProducts = async () => {
            const res = await getProducts();
            setProducts(res?.result?.content);
        };

        Promise.all([fetchProducts(), fetchCategories()]).catch((err) =>
            console.log(err.message)
        );
    }, []);

    const toggleShowCategories = () => {
        setShowAllCategories(!showAllCategories);
    };

    return (
        <div className="flex flex-col md:flex-row">
            {/* Category Section */}
            <div className="md:w-1/5 w-full md:sticky md:top-20 bg-white p-4 md:p-6 rounded-lg shadow-xl space-y-6 max-h-screen overflow-y-auto">
                <h2 className="text-2xl font-semibold text-center text-gray-900">
                    Danh mục
                </h2>

                <div className="space-y-4">
                    {/* Hiển thị tất cả danh mục trên màn hình lớn và tối đa 4 danh mục trên màn hình nhỏ */}
                    {categories &&
                        (showAllCategories || !isMobile
                            ? categories
                            : categories.slice(0, 3)
                        ).map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-200 cursor-pointer transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
                            >
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-50">
                                    <img
                                        src={item.image}
                                        className="w-full h-full object-cover transition-all duration-200 ease-in-out"
                                        alt={item.name}
                                    />
                                </div>
                                <span className="text-gray-800 md:text-lg font-medium">
                                    {item.name}
                                </span>
                            </div>
                        ))}

                    {/* Nút "Xem thêm" hoặc "Thu gọn" chỉ hiển thị trên màn hình nhỏ */}
                    {isMobile && categories && categories.length > 3 && (
                        <div className="text-center mt-4">
                            <button
                                onClick={toggleShowCategories}
                                className="px-1 py-1 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-all duration-200 ease-in-out shadow-lg focus:outline-none text-md "
                            >
                                {showAllCategories ? "Thu gọn" : "Xem thêm"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Section */}
            <div className="md:w-4/5 w-full p-4">
                <div>
                    <TopDealProduct />
                </div>
                <h1 className="text-center text-red-600 text-3xl mt-5 font-semibold">
                    Gợi ý hôm nay
                </h1>
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
                                            src={
                                                product.skus[0]?.images.split(
                                                    ","
                                                )[0]
                                            }
                                            alt={product.name}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-normal text-gray-800">
                                            {trunCateText(product.name, 50)}
                                        </h3>

                                        <h4 className="text-lg text-red-600 font-bold mt-4">
                                            Giá:{" "}
                                            {formatCurrency(
                                                product.skus[0]?.price
                                            )}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Size:{" "}
                                            {product.skus[0]?.attributes.size} -
                                            Màu:{" "}
                                            {product.skus[0]?.attributes.color}
                                        </p>
                                        <p className="text-sm text-green-500 mt-2">
                                            Giảm giá:{" "}
                                            {product.skus[0]?.discount}%
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
