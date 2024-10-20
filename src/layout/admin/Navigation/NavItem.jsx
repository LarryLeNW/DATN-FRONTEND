import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Icons from "utils/icons";

function NavItem({ data, isShowText, setNav }) {
    const [isOpenParent, setIsOpenParent] = useState(false);
    const location = useLocation();

    const isSubmenuActive = data.submenu?.some(
        (item) => location.pathname === item.path
    );

    useEffect(() => {
        if (!isShowText) {
            setIsOpenParent(false);
        }
    }, [isShowText]);

    return (
        <div key={data.id}>
            {data.type === "SINGLE" && (
                <NavLink
                    to={data.path}
                    className={({ isActive }) =>
                        `px-6 py-2 flex items-center gap-2 font-bold hover:bg-gray-500 transition-all rounded ${
                            isActive
                                ? "bg-light bg-gray-500"
                                : " text-gray-200 "
                        }`
                    }
                >
                    <span>{data.icon}</span>
                    {isShowText && <span>{data.text}</span>}
                </NavLink>
            )}
            {data.type === "PARENT" && (
                <div>
                    <div
                        onClick={() => {
                            setNav(true);
                            setIsOpenParent(!isOpenParent);
                        }}
                        className={`px-6 py-2 flex items-center gap-5 text-gray-200 hover:bg-gray-500 font-bold cursor-pointer rounded ${
                            isSubmenuActive ? "text-primary" : ""
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <span>{data.icon}</span>
                            {isShowText && <span>{data.text}</span>}
                        </div>
                        {isShowText && isOpenParent && (
                            <Icons.IoIosArrowDropdown className="text-[24px] ml-auto " />
                        )}
                        {isShowText && !isOpenParent && (
                            <Icons.IoIosArrowDropright className="text-[24px] ml-auto" />
                        )}
                    </div>
                    {isOpenParent && isShowText && (
                        <div className="flex flex-col pl-4 mt-2 gap-2">
                            {data.submenu.map((item) => (
                                <NavLink
                                    key={item.id}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `px-4 py-2 flex items-center gap-2 font-bold hover:bg-gray-300 hover:text-slate-900  rounded transition-all duration-600 ease-in-out  ${
                                            isActive
                                                ? "bg-light hover:text-white "
                                                : " text-gray-200 "
                                        }`
                                    }
                                >
                                    <Icons.FaRegCircle size={8} />
                                    <span>{item.text}</span>
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NavItem;
