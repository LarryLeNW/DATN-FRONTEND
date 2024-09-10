import React from "react";
import Banner from "components/Banner/Banner";
import Footer from "components/Footer/Footer";
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
    const [orderPopup, setOrderPopup] = React.useState(false);

    const handleOrderPopup = () => {
        setOrderPopup(!orderPopup);
    };
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
        <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
            <Hero handleOrderPopup={handleOrderPopup} />
            <Products />
            <TopProducts handleOrderPopup={handleOrderPopup} />
            <Banner />
            <Subscribe />
            <Products />
            <Testimonials />
            <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
        </div>
    );
}

export default Home;
