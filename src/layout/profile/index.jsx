import React from "react";
import Navigation from "./Navigation";
import { Outlet } from "react-router-dom";

const ProfileLayout = () => {
    return (
        <div className="flex min-h-screen justify-center px-10 gap-2 mt-2">
            <Navigation />
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
};

export default ProfileLayout;
