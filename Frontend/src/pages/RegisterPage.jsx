import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaTwitter, FaDiscord } from "react-icons/fa";

function RegisterPage() {
    const [credentials, setCredentials] = useState({ 
        username: "", 
        password: ""
    });
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!credentials.username) {
            alert("Please enter username");
            return;
        }
        if (!credentials.password) {
            alert("Please enter password");
            return;
        }
        try {
            await registerUser(credentials);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error during registration:", error); // Add detailed logging
            if (error.response && error.response.status === 409) {
                alert("Username already exists");
            } else {
                alert("Registration failed: " + (error.message || "Unknown error"));
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="relative bg-gray-800 rounded-xl p-8 w-full max-w-lg border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
                {/* Animated background elements */}
                <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,#3b82f640_0%,transparent_70%)] animate-pulse"></div>
                
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-center mb-8">
                        CYBER SIGNUP
                    </h1>

                    <div className="space-y-6">
                        {/* Username Input */}
                        <div className="group">
                            <label className="block text-sm font-medium text-cyan-300 mb-2">USERNAME</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg 
                                focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50
                                text-white placeholder-gray-400 transition-all"
                                placeholder="CyberWarrior123"
                                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="group">
                            <label className="block text-sm font-medium text-cyan-300 mb-2">PASSWORD</label>
                            <input 
                                type="password" 
                                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg 
                                focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50
                                text-white placeholder-gray-400 transition-all"
                                placeholder="••••••••"
                                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            />
                        </div>

                        {/* Register Button */}
                        <button 
                            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-gray-900 py-3.5 rounded-lg
                            font-bold hover:from-cyan-400 hover:to-purple-500 transition-all transform hover:scale-[1.02]
                            shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 active:scale-95"
                            onClick={handleRegister}
                        >
                            ACTIVATE ACCOUNT
                        </button>

                        {/* Social Auth */}
                        <div className="flex items-center justify-center space-x-6 mt-8">
                            <button className="p-3 rounded-full border-2 border-cyan-500/30 text-cyan-400
                                hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all">
                                <FaTwitter className="text-2xl" />
                            </button>
                            <button className="p-3 rounded-full border-2 border-purple-500/30 text-purple-400
                                hover:border-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-all">
                                <FaDiscord className="text-2xl" />
                            </button>
                        </div>

                        <p className="text-center text-gray-400 mt-6">
                            Existing user?{" "}
                            <a 
                                href="/" 
                                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 hover:underline-offset-2 transition-all"
                            >
                                Access Terminal
                            </a>
                        </p>
                    </div>
                </div>

                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-xl border border-cyan-500/20 pointer-events-none"></div>
            </div>
        </div>
    );
}

export default RegisterPage;