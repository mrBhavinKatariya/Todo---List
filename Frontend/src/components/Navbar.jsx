import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="p-4 bg-blue-600 text-white flex justify-between">
            <h1 className="text-xl">Task Manager</h1>
            <button className="bg-red-500 px-3 py-1" onClick={handleLogout}>Logout</button>
        </nav>
    );
}

export default Navbar;