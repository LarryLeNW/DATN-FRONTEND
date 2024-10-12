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
    React.useEffect(() => {
        AOS.init({
            offset: 100,
            duration: 800,
            easing: "ease-in-sine",
            delay: 100,
        });
        AOS.refresh();
    }, []);

    return (
        <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 w-full pt-[122px]">
            {/* Thêm padding-top cho nội dung bằng với chiều cao header */}
            <div className="relative">
                <img
                    src={Img10}
                    alt="Banner"
                    className="w-full h-[500px] object-cover"
                />
            </div>
            <Products />
            <TopProducts />
            <Banner />
            <Subscribe />
            <Products />
        </div>
    );
}

export default Home;
