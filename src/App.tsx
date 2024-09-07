import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/public/Home";
import useRouter from "hooks/useRoutes";

function App() {
    const element = useRouter();
    return <div className="App">{element}</div>;
}

export default App;
