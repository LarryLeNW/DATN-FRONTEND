import "./Header.css";

import { BiSearch } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import { RiSettingsLine } from "react-icons/ri";

import { IoAnalytics } from "react-icons/io5";
import { TbMessages } from "react-icons/tb";

import { HiOutlineMoon, HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import paths from "constant/paths";

const Header = ({ setDarkTheme, DarkTheme }) => {
    const navigate = useNavigate();
    function changeTheme() {
        setDarkTheme(!DarkTheme);
    }
    return (
        <header
            className={` relative flex items-center justify-between p-2  text-blue-600   ${
                DarkTheme && "dark"
            }`}
        >
            <div className="relative w-[25%] flex items-center border px-2 rounded-lg">
                <input
                    type="text"
                    placeholder="search..."
                    class="py-2 px-4 rounded flex-1 bg-transparent text-lg outline-none"
                    border
                />
                <div class="px-2 border-l-2">
                    <BiSearch className="icon  " size={24} />
                </div>
            </div>
            <div className="tools">
                <AiOutlineUser className="icon" />
                <TbMessages className="icon" />
                <IoAnalytics className="icon" />

                <div className="divider"></div>

                <HiOutlineMoon className="icon" onClick={changeTheme} />
                <RiSettingsLine className="icon" />
                <HiOutlineLogout
                    className="icon"
                    onClick={() => navigate(paths.HOME)}
                />

                <div className="divider"></div>

                <img
                    src="https://images.unsplash.com/photo-1669170023257-4da4bc7adfbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
                    alt=""
                    className="h-[40px] w-[40px] rounded-full  aspect-auto"
                />
            </div>
        </header>
    );
};

export default Header;
