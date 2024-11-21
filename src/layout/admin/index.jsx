import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import { useSelector } from "react-redux";
import paths from "constant/paths";

function AdminLayout() {
    const [DarkTheme, setDarkTheme] = useState(false);
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo.loading) {
            return;
        } else if (!userInfo?.data || userInfo.data?.role == "ROLE_USER") {
            navigate(paths.HOME, { replace: true });
        }
    }, [userInfo, navigate]);

    return (
        <div className="relative flex m-h-[100vh] justify-start items-start">
            <Navigation setDarkTheme={setDarkTheme} DarkTheme={DarkTheme} />
            <div className={`flex relative flex-col flex-1 min-h-[100vh]`}>
                <Header setDarkTheme={setDarkTheme} DarkTheme={DarkTheme} />
                <div className="bg-gray-200 flex-grow">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;
