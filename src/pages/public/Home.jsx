import React from "react";
import Banner from "components/Banner/Banner";
import Hero from "components/Hero/Hero";
import Navbar from "components/Navbar/Navbar";
import Popup from "components/Popup/Popup";
import Products from "components/Products/Products";
import Subscribe from "components/Subscribe/Subscribe";
import Testimonials from "components/Testimonials/Testimonials";
import TopProducts from "components/TopProducts/TopProducts";
import Img10 from "assets/images/banner10.webp";
import AOS from "aos";
import "aos/dist/aos.css";

function Home() {
    return (
        <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 w-full ">
            <img
                data-aos="fade-zoom-in"
                src={Img10}
                alt="Banner"
                className="w-[70%] object-cover  mx-auto shadow-md shadow-blue-400 my-10"
            />
            <Products />
            <TopProducts />
            <Banner />
            <Subscribe />
            <Products />
        </div>
    );
}

export default Home;
