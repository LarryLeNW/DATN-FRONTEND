import { faker } from "@faker-js/faker";
import { menuProfileSidebar } from "constant/menu";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Navigation() {
    const { userInfo } = useSelector((state) => state.auth);
    console.log("🚀 ~ Navigation ~ userInfo:", userInfo);

    return (
        <div className="w-1/5 p-4 bg-white space-y-6">
            <div className="flex items-center justify-center gap-4 border-b border-primary p-2 bg-slate-100 rounded">
                <div>
                    <img
                        src={userInfo?.data?.avatar || faker.image.avatar()}
                        className="w-8 h-8 rounded-full "
                        height={4}
                    />
                </div>
                <h2 className="text-xl ">
                    <p className="text-slate-700">Tài khoản của</p>
                    <p className="font-bold">
                        {userInfo?.data?.username ||
                            userInfo?.data?.email.split("@")[0]}
                    </p>
                </h2>
            </div>
            <nav className="space-y-2">
                {menuProfileSidebar.map((el) => (
                    <Link
                        to={el.path}
                        className="text-bold flex text-lg p-4 items-center gap-2"
                    >
                        {el.icon}
                        <span>{el.text}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}

export default Navigation;
