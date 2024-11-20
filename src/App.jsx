import useRouter from "hooks/useRoutes";
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect } from "react";
import Loading from "components/Loading";
import Cookies from "js-cookie";
import withBaseComponent from "hocs";
import { getUserInfoRequest } from "store/slicers/auth.slicer";
import { useSelector } from "react-redux";
import { getCartListRequest } from "store/slicers/cart.slicer";
import useConfetti from "hooks/useConfetti";
import paths from "constant/paths";
function App({ navigate, dispatch, location }) {
    const userInfo = useSelector((state) => state.auth.userInfo.data);
    const { messageSystem } = useSelector((state) => state.common);

    React.useEffect(() => {
        AOS.init({
            offset: 100,
            duration: 800,
            easing: "ease-in-sine",
            delay: 100,
        });
        AOS.refresh();

        if (Cookies.get("accessToken")) {
            dispatch(getUserInfoRequest());
        }
    }, []);

    useEffect(() => {
        if (userInfo?.role === "ROLE_USER") {
            dispatch(getCartListRequest());
            if (
                location.pathname === paths.LOGIN ||
                location.pathname === paths.CONFIRM_REGISTER
            )
                navigate(paths.HOME);
            return;
        }

        if (!!userInfo?.role && userInfo?.role !== "ROLE_USER")
            navigate(paths.ADMIN.HOME);
    }, [userInfo]);

    const triggerConfetti = useConfetti(messageSystem.typeEffect);
    useEffect(() => {
        if (messageSystem.isShow) {
            triggerConfetti();
        }
    }, [messageSystem, triggerConfetti]);

    const element = useRouter();
    return (
        <div className="App">
            {element}
            <Loading />
        </div>
    );
}

export default withBaseComponent(App);
