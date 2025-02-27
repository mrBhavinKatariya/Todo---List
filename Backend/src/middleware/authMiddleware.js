const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/UserModel.js"); 
const asyncHandler = require("../utils/asyncHandler.js");
dotenv.config();

const authenticate = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    console.log("token:", token);
    
    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id); 
        if (!user) {
            return res.status(401).json({ message: "User not found. Authentication failed." });
        }

        req.user = { id: user.id, username: user.username };
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};

module.exports = authenticate;

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            throw new ApiError(401, "Authorization header is missing");
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new ApiError(401, "Bearer token is missing");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log('Decoded Token:', decodedToken); 

        const user = await User.findByPk(decodedToken.id, {
            attributes: { exclude: ["password", "refreshToken"] }
        });

        if (!user) {const jwt = require("jsonwebtoken");
            const dotenv = require("dotenv");
            const User = require("../models/UserModel.js"); 
            const asyncHandler = require("../utils/asyncHandler.js");
            const ApiError = require("../utils/ApiError.js");
            
            dotenv.config();
            
         
            const authenticate = asyncHandler(async (req, res, next) => {
                const authHeader = req.header("Authorization");
            
                if (!authHeader || !authHeader.startsWith("Bearer ")) {
                    return res.status(401).json({ message: "Access denied. No token provided." });
                }
            
                const token = authHeader.split(" ")[1]; 
                console.log("Received Token:", token);
            
                try {
                    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                    const user = await User.findByPk(decoded.id); 
            
                    if (!user) {
                        return res.status(401).json({ message: "User not found. Authentication failed." });
                    }
            
                    req.user = { id: user.id, username: user.username };
                    next();
                } catch (error) {
                    console.error("JWT Verification Error:", error);
                    res.status(401).json({ message: "Invalid token." });
                }
            });
            
            // Middleware for verifying JWT access tokens
            const verifyJWT = asyncHandler(async (req, res, next) => {
                try {
                    const authHeader = req.header("Authorization");
            
                    if (!authHeader || !authHeader.startsWith("Bearer ")) {
                        throw new ApiError(401, "Authorization header is missing or invalid");
                    }
            
                    const token = authHeader.split(" ")[1];
                    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                    console.log("Decoded Token:", decodedToken); // Debugging statement
            
                    const user = await User.findByPk(decodedToken.id, {
                        attributes: { exclude: ["password", "refreshToken"] }
                    });
            
                    if (!user) {
                        throw new ApiError(401, "Invalid Access Token");
                    }
            
                    req.user = user;
                    next();
                } catch (error) {
                    console.error("JWT Error:", error);
                    throw new ApiError(401, error?.message || "Invalid access token");
                }
            });
            
            module.exports = { authenticate, verifyJWT };
            
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('JWT Error:', error); // Debugging statement
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

module.exports = verifyJWT;

    