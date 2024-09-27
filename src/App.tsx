import "./App.css";
import useRouter from "hooks/useRoutes";

function App() {
    const element = useRouter();
    return <div className="App">{element}</div>;
}

export default App;
