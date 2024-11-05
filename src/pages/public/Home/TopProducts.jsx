import React, { useEffect, useState } from "react";
import Img1 from "assets/shirt/shirt.png";
import Img2 from "assets/shirt/shirt2.png";
import Img3 from "assets/shirt/shirt3.png";

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

    const fetchCategories = async () => {
        const params = {
            limit,
            page,
        };
        const res = await getProductCate();
        setCategories(res?.result?.content);
    };
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

    return (
        <div className="flex ">
            <div className="container-fluid grid grid-cols-5 gap-x-4">
                {/* Category Section */}
                <div className="relative">
                    <div className="sticky top-[50px] bg-gray-200 p-4 shadow-md w-55">
                        <h2 className="text-xl font-semibold mb-4 text-center">
                            Danh mục
                        </h2>
                        <div className="space-y-3">
                            {categories &&
                                categories.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                                    >
                                        <img
                                            src={item.image}
                                            className="w-12 h-12 mb-2 rounded-2xl "
                                        />
                                        <span className="text-gray-800">
                                            {item.name}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                {/* Product Section */}
                <div className="col-span-4">
                    <div>
                        <TopDealProduct></TopDealProduct>
                    </div>
                    <h1 className="text-center text-red-600 text-3xl mt-5">
                        Gợi ý hôm nay
                    </h1>
                    <div className="bg-gray-100 lg:max-w-7xl sm:max-w-full mt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-xl:gap-4 gap-6">
                            {products &&
                                products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="bg-white rounded-2xl p-2 cursor-pointer hover:-translate-y-2 transition-all relative"
                                    >
                                        <div className="bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer absolute top-4 right-4">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16px"
                                                className="fill-gray-800 inline-block"
                                                viewBox="0 0 64 64"
                                            >
                                                <path d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"></path>
                                            </svg>
                                        </div>

                                        <div className="w-5/6 h-[210px] overflow-hidden mx-auto aspect-w-16 aspect-h-8 md:mb-2 mb-4">
                                            <img
                                                src={
                                                    product.skus[0].images.split(
                                                        ","
                                                    )[0]
                                                }
                                                alt={product.name}
                                                className="h-full w-full object-contain"
                                            />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-extrabold text-gray-800">
                                                {trunCateText(product.name, 55)}
                                            </h3>

                                            <h4 className="text-lg text-red-600 font-bold mt-4">
                                                Giá:{" "}
                                                {formatCurrency(
                                                    product.skus[0].price
                                                )}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                Size:{" "}
                                                {
                                                    product.skus[0].attributes
                                                        .size
                                                }{" "}
                                                - Màu:{" "}
                                                {
                                                    product.skus[0].attributes
                                                        .color
                                                }
                                            </p>
                                            <p className="text-sm text-green-500 mt-2">
                                                Giảm giá:{" "}
                                                {product.skus[0].discount}%
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopProducts;
