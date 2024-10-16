import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./demo-component/HeaderTemplate/Header";
import Navigation from "./demo-component/NavigationTemplate/Navigation";

function AdminLayout() {
    const [DarkTheme, setDarkTheme] = useState(false);

    return (
        <div class=" relative flex m-h-[100vh] justify-start items-start bg-black">
            <Navigation setDarkTheme={setDarkTheme} DarkTheme={DarkTheme} />
            <div
                className={` flex relative flex-col flex-1 bg-pink-100 min-h-[100vh]  ${
                    DarkTheme && "bg-black color-white"
                }`}
            >
                <Header setDarkTheme={setDarkTheme} DarkTheme={DarkTheme} />
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;
