import React from "react";
import Img1 from "assets/shirt/shirt.png";
import Img2 from "assets/shirt/shirt2.png";
import Img3 from "assets/shirt/shirt3.png";

import { FaStar } from "react-icons/fa";
import TopDealProduct from "pages/public/TopDealProduct";


const products = [
    {
        id: 1,
        name: "Sole Elegance",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: 10,
        image: "https://readymadeui.com/images/product9.webp",
    },
    {
        id: 2,
        name: "Urban Sneakers",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: 12,
        image: "https://readymadeui.com/images/product10.webp",
    },
    {
        id: 3,
        name: "Velvet Boots",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: 14,
        image: "https://readymadeui.com/images/product11.webp",
    },
    {
        id: 4,
        name: "Summit Hiking",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: 12,
        image: "https://readymadeui.com/images/product12.webp",
    },
    {
        id: 4,
        name: "Summit Hiking",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: 12,
        image: "https://readymadeui.com/images/product12.webp",
    },
    {
        id: 4,
        name: "Summit Hiking",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: 12,
        image: "https://readymadeui.com/images/product12.webp",
    },
    {
        id: 4,
        name: "Summit Hiking",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: 12,
        image: "https://readymadeui.com/images/product12.webp",
    },
    {
        id: 4,
        name: "Summit Hiking",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: 12,
        image: "https://readymadeui.com/images/product12.webp",
    },
    {
        id: 4,
        name: "Summit Hiking",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: 12,
        image: "https://readymadeui.com/images/product12.webp",
    },
    {
        id: 4,
        name: "Summit Hiking",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: 12,
        image: "https://readymadeui.com/images/product12.webp",
    },
    {
        id: 4,
        name: "Summit Hiking",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: 12,
        image: "https://readymadeui.com/images/product12.webp",
    },
    {
        id: 4,
        name: "Summit Hiking",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        price: 12,
        image: "https://readymadeui.com/images/product12.webp",
    },
];
    const categories = ["áo quần", "trang sức", "giày", "dép", "quần tây", "hihihi" ,"hihihi","hihihi","hihihi","hihihi","hihihi","hihihi","hihihi"];
    const TopProducts = () => {
    return (
        <div className="flex- mt-5 ">
            <div className="container grid grid-cols-5 gap-x-4">
                {/* Category Section */}
                <div className="relative">
                    <div className="sticky top-[80px] bg-light p-4 rounded-lg shadow-md w-55">
                        <h2 className="text-xl font-semibold mb-4">Danh mục</h2>
                        <div className="space-y-3">
                            {categories.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                                >
                                    <span className="text-gray-800">{item}</span>
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
                    <h1 className="text-center text-red-600 text-3xl mt-5">Gợi ý hôm nay</h1>
                    <div className="bg-gray-100 lg:max-w-7xl sm:max-w-full mt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-xl:gap-4 gap-6">
                            {products.map((product) => (
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
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-extrabold text-gray-800">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-2">
                                            {product.description}
                                        </p>
                                        <h4 className="text-lg text-gray-800 font-bold mt-4">
                                            ${product.price}
                                        </h4>
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
