import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function AdminLayout() {
    return (
        <div>
            <Navbar />
            components admin
            <Outlet />
        </div>
    );
}

export default AdminLayout;
