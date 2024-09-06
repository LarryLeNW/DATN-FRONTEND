import { Outlet } from "react-router-dom";

let Public = () => {
    return (
        <>
            <header>header</header>
            <Outlet />
            <footer>footer</footer>
        </>
    );
};

export default Public;
