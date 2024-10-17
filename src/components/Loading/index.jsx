import logo from "assets/logo.png";
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ICONS from "utils/icons";

function Loading() {
    const [dots, setDots] = useState(".");
    const isLoading = useSelector((state) => state.common.isLoading);

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setDots((prevDots) =>
                    prevDots.length == 3 ? "." : prevDots + "."
                );
            }, 300);
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    return (
        <>
            {isLoading && (
                <div
                    className="fixed inset-0 z-50 flex justify-center items-center transition-all duration-300 ease-in-out"
                    style={{ background: "rgba(0, 0, 0, 0.4)" }}
                >
                    <div className="flex select-none gap-2 flex-col justify-center items-center p-4 text-white relative">
                        <img
                            src={logo}
                            alt="img"
                            className={`w-[140px] drop-shadow-[-10px_0_10px_aqua]  `}
                        />
                        <div class="absolute top-[82px] left-[46px] flex gap-1 align-center items-center text-sm ">
                            <ICONS.AiOutlineLoading3Quarters
                                size={32}
                                color="purple"
                                className="animate-spin "
                            />
                            <div class="font-bold  w-2">
                                <span>Loading</span>
                                <span>{dots}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default memo(Loading);
