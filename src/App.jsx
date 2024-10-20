import useRouter from "hooks/useRoutes";
import AOS from "aos";
import "aos/dist/aos.css";
import React from "react";
import Loading from "components/Loading";
function App() {
    React.useEffect(() => {
        AOS.init({
            offset: 100,
            duration: 800,
            easing: "ease-in-sine",
            delay: 100,
        });
        AOS.refresh();
    }, []);

    const element = useRouter();
    return (
        <div className="App">
            {element}
            <Loading />
        </div>
    );
}

export default App;
