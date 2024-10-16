import "./Navigation.css";
import { FiChevronLeft } from "react-icons/fi";
import { menuAdminSidebar } from "constant/menu";
import NavItem from "./NavItem";
import { useState } from "react";

const Navigation = ({ DarkTheme, setDarkTheme }) => {
    const [nav, setnav] = useState(false);

    return (
        <div
            className={`navigation bg-slate-900 px-4 py-2 transition-all duration-300 ease-in-out
                h-[100vh]
                sticky top-0 flex flex-col min-h-screen text-white overflow-y-scroll 
            select-none
                ${nav && "active"}  `}
        >
            <div
                className={`menu ${nav && "relative"} `}
                onClick={() => {
                    setnav((prevState) => !prevState);
                }}
            >
                <FiChevronLeft className="menu-icon" />
            </div>
            <header>
                <div className="profile">
                    <img
                        src="https://images.unsplash.com/photo-1669170023257-4da4bc7adfbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
                        alt="user-img"
                        className="profile-img"
                    />
                </div>
                <span>creative_ambition</span>
            </header>
            <div class="flex flex-col gap-2">
                {menuAdminSidebar.map((el) => (
                    <NavItem data={el} />
                ))}
            </div>
        </div>
    );
};

export default Navigation;
