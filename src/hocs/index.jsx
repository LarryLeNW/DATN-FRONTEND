import {
    useNavigate,
    useLocation,
    useParams,
    createSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import paths from "constant/paths";

const withBaseComponent = (Component) => (props) => {
    const { isLogged } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const params = useParams();

    const checkLoginBeforeAction = (callback) => {
        console.log("🚀 ~ checkLoginBeforeAction ~ isLogged:", isLogged);
        if (isLogged) {
            callback();
            return;
        }
        Swal.fire({
            title: "Bạn cần đăng nhập để thực hiện chức năng này!",
            icon: "warning",
            confirmButtonText: "Go",
            confirmButtonColor: "#3085d6",
        }).then((result) => {
            if (result.isConfirmed) {
                navigate({
                    pathname: paths.LOGIN,
                    search: createSearchParams({
                        redirect: location.pathname,
                    }).toString(),
                });
            }
        });
    };

    return (
        <Component
            {...props}
            navigate={navigate}
            dispatch={dispatch}
            location={location}
            params={params}
            useSelector={useSelector}
            checkLoginBeforeAction={checkLoginBeforeAction}
        />
    );
};

export default withBaseComponent;
