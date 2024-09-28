import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useState } from "react";
import Sidebar from "./Sidebar";

function AdminLayout() {
    const activeMenu = useState(false);
    return (
        <div className="flex relative dark:bg-main-dark-bg">
            <Sidebar />
            <div className="transition-all">
                <Navbar />
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;
