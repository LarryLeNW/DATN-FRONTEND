import React from "react";
import TopProducts from "./TopProducts";
import Subscribe from "./Subscribe";
import Banner from "./Banner";
import ProductsHome from "./Products";

function Home() {
    return (
        <div className="bg-gray-100 dark:bg-gray-900 dark:text-white duration-200 w-full ">
            {/* <img
                data-aos="fade-zoom-in"
                src={Img10}
                alt="Banner"
                className="w-[70%] object-cover  mx-auto shadow-md shadow-blue-400 my-10"
            /> */}
            
            <TopProducts />
            <Banner />
            <Subscribe />
            <ProductsHome/>

        </div>
    );
}

export default Home;
