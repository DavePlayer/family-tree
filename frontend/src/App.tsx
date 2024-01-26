import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function App() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/login");
    });
    return <div className="w-screen h-screen bg-mainBg"></div>;
}

export default App;
