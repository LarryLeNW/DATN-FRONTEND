import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./demo-component/HeaderTemplate/Header";
import Content from "./demo-component/Content/Content";
import "./Main.css";
import Navigation from "./demo-component/NavigationTemplate/Navigation";

function AdminLayout() {
    const [DarkTheme, setDarkTheme] = useState(false);

    return (
        <div class="wrapper-admin">
            <Navigation setDarkTheme={setDarkTheme} DarkTheme={DarkTheme} />
            <div className={`main ${DarkTheme && "dark"}`}>
                <Header setDarkTheme={setDarkTheme} DarkTheme={DarkTheme} />
                <Content DarkTheme={DarkTheme} />
            </div>
        </div>
    );
}

export default AdminLayout;
