import { useRoutes } from "react-router-dom";

function useRouter() {
    const element = useRoutes([
        {}
    ]);


    return element;
}

export default useRouter;