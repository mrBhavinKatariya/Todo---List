import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub } from "react-icons/fa"; 
import { loginUser } from "../services/api";
import AuthContext from "../context/AuthContext"; 

function LoginPage() {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
    
        if (!credentials.username.trim()) {
            setErrorMessage("Please enter a username.");
            return;
        }
        if (!credentials.password.trim()) {
            setErrorMessage("Please enter a password.");
            return;
        }
    
        try {
            const response = await loginUser(credentials);
            console.log("Full API Response:", response); 
    
            if (!response || !response.data) {
                setErrorMessage("Invalid API response. Please try again.");
                return;
            }
    
            const { accessToken, user } = response.data;
            console.log("Access Token:", accessToken);
    
            login(accessToken);
            localStorage.setItem("token", accessToken);
            localStorage.setItem("user", JSON.stringify(user)); 
    
 
            navigate("/dashboard");
        } 
        catch (error) {
            console.error("Login error:", error);
            
            if (error.response) {

                if (error.response.status == 401) {
                    setErrorMessage("Invalid credentials. Please try again.");
                } if(error.response.status == 404 ) {
                    setErrorMessage("User does not exist");                   
                 }
                
            } else if (error.request) {
 
                setErrorMessage("Network error. Please check your connection.");
            } else {
          
                setErrorMessage("An unexpected error .");
            }
        }
    };
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-8 relative overflow-hidden">
                <div className="absolute -top-1 -left-1 -right-1 -bottom-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl z-0 blur-sm opacity-20 animate-pulse"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-10">
                        Welcome Back
                    </h1>

                    {errorMessage && (
                        <div className="text-red-400 bg-red-700/30 p-3 rounded-lg text-center">{errorMessage}</div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="relative">
                            <input
                                type="text"
                                id="username"
                                className="peer w-full px-4 py-3 bg-gray-700 rounded-lg border-2 border-gray-600 text-white placeholder-transparent focus:outline-none focus:border-blue-500 transition-all"
                                placeholder="Username"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            />
                            <label
                                htmlFor="username"
                                className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-400"
                            >
                                Username
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                type="password"
                                id="password"
                                className="peer w-full px-4 py-3 bg-gray-700 rounded-lg border-2 border-gray-600 text-white placeholder-transparent focus:outline-none focus:border-blue-500 transition-all"
                                placeholder="Password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-400"
                            >
                                Password
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3.5 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="flex items-center justify-center space-x-4 my-4">
                        <div className="w-full h-px bg-gray-600"></div>
                        <span className="text-gray-400 text-sm">OR</span>
                        <div className="w-full h-px bg-gray-600"></div>
                    </div>

                    <div className="flex justify-center space-x-6">
                        <button className="p-3 rounded-full border-2 border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-all">
                            <FaGoogle className="text-xl" />
                        </button>
                        <button className="p-3 rounded-full border-2 border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-all">
                            <FaGithub className="text-xl" />
                        </button>
                    </div>

                    <p className="text-center text-gray-400 mt-4">
                        New here?{" "}
                        <a href="/register" className="text-blue-400 hover:underline hover:text-blue-300 transition-all">
                            Create Account
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
