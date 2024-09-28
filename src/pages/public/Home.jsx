import React from "react";
import Banner from "components/Banner/Banner";
import Hero from "components/Hero/Hero";
import Navbar from "components/Navbar/Navbar";
import Popup from "components/Popup/Popup";
import Products from "components/Products/Products";
import Subscribe from "components/Subscribe/Subscribe";
import Testimonials from "components/Testimonials/Testimonials";
import TopProducts from "components/TopProducts/TopProducts";
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
        <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 w-full">
            <Products />
            <TopProducts />
            <Banner />
            <Subscribe />
            <Products />
        </div>
    );
}

export default Home;
