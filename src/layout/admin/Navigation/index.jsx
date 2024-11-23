import { FiChevronLeft } from "react-icons/fi";
import { menuAdminSidebar } from "constant/menu";
import NavItem from "./NavItem";
import { useState } from "react";

const Navigation = () => {
    const [nav, setNav] = useState(true);

    return (
        <div
            className={`navigation bg-slate-900 p-2 transition-all duration-200 ease-in-out
                h-[100vh]
                sticky top-0 flex flex-col min-h-screen text-white overflow-y-scroll 
            select-none 
                ${nav ? "active w-[20%]" : "w-[6%]"}  `}
        >
            <div
                className={`absolute z-10 right-1 top-0 ml-auto text-lg h-9 flex justify-center items-center  ${
                    nav ? "rotate-180 " : ""
                } `}
                onClick={() => {
                    setNav((prevState) => !prevState);
                }}
            >
                <FiChevronLeft className="menu-icon" />
            </div>
            <header
                className={`relative flex flex-col justify-center items-center gap-3  rounded mb-2 ${
                    nav ? "p-6  px-4 bg-slate-600" : "p-0 mt-2 bg-transparent"
                }`}
            >
                <img
                    src="https://images.unsplash.com/photo-1669170023257-4da4bc7adfbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
                    alt="user-img"
                    className="h-[40px] w-[40px] rounded-full object-cover aspect-auto"
                />
                {nav && <span>DATN</span>}
            </header>
            <div class="flex flex-col gap-2">
                {menuAdminSidebar.map((el) => (
                    <NavItem data={el} isShowText={nav} setNav={setNav} />
                ))}
            </div>
        </div>
    );
};

export default Navigation;
