import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import React from "react";

let PublicLayout = () => {
    return (
        <div className="flex flex-col min-h-screen w-screen ">
            <Header />
            <div className="flex-1 d-flex flex-col">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default PublicLayout;
