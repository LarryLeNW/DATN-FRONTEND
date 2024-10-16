import { useState } from "react";
import { NavLink } from "react-router-dom";
import Icons from "utils/icons";

function NavItem({ data }) {
    const [isOpenParent, setIsOpenParent] = useState(false);

    return (
        <div key={data.id}>
            {data.type === "SINGLE" && (
                <NavLink
                    to={data.path}
                    className={({ isActive }) =>
                        `px-4 py-2 flex items-center gap-2 font-bold hover:bg-gray-500 transition-all rounded ${
                            isActive ? "bg-gray-500" : " text-gray-200 "
                        }`
                    }
                >
                    <span>{data.icon}</span>
                    <span>{data.text}</span>
                </NavLink>
            )}
            {data.type === "PARENT" && (
                <div>
                    <div
                        onClick={() => setIsOpenParent(!isOpenParent)}
                        className="px-4 py-2 flex items-center gap-5 text-gray-200 hover:bg-gray-500 font-bold cursor-pointer rounded"
                    >
                        <div className="flex items-center gap-2">
                            <span>{data.icon}</span>
                            <span>{data.text}</span>
                        </div>
                        {isOpenParent ? (
                            <Icons.IoIosArrowDropdown className="text-[24px] ml-auto " />
                        ) : (
                            <Icons.IoIosArrowDropright className="text-[24px] ml-auto" />
                        )}
                    </div>
                    {isOpenParent && (
                        <div className="flex flex-col pl-4 mt-2">
                            {data.submenu.map((item) => (
                                <NavLink
                                    key={item.id}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `px-4 py-2 flex items-center gap-2 font-bold hover:bg-gray-300 hover:text-slate-900  rounded transition-all duration-600 ease-in-out  ${
                                            isActive
                                                ? "bg-gray-500 "
                                                : " text-gray-200 "
                                        }`
                                    }
                                >
                                    {item.text}
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
