const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiErrors = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");
const User = require("../models/UserModel.js"); 

const generateAccessToken = async (userId) => {
    return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2d" });
};

const generateRefreshToken = async (userId) => {
    return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// exports.registerUser = asyncHandler(async (req, res) => {
//     const { username, password } = req.body;

//     if (!username || !password) {
//         throw new ApiErrors(409, "All fields are required");
//     }

//     const existedUser = await User.findOne({ where: { username } });

//     if (existedUser) {
//         throw new ApiErrors(409, "Username already exists");
//     }

//     // const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//         username: username.toLowerCase(),
//         password: password
//     });

    
//     // const accessToken = await generateAccessToken(user.id);
//     // const refreshToken = await generateRefreshToken(user.id);

//     // const options = {
//     //     httpOnly: true,
//     //     secure: process.env.NODE_ENV === "production",
//     // };
//     return res.status(201)
//     // .cookie("accessToken", accessToken, options)
//     //     .cookie("refreshToken", refreshToken, options)
//         .json(new ApiResponse(200, user, "User registered successfully"));
// });

exports.registerUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new ApiErrors(409, "All fields are required");
    }

    const existedUser = await User.findOne({ where: { username } });

    if (existedUser) {
        throw new ApiErrors(409, "Username already exists");
    }

    const hashedPassword = password 

    const user = await User.create({
        username: username.toLowerCase(),
        password: hashedPassword 
    });


    const accessToken = await generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);


    await User.update({ refreshToken }, { where: { id: user.id } });


    const registeredUser = await User.findOne({
        where: { id: user.id },
        attributes: { exclude: ["password", "refreshToken"] }
    });

    return res.status(201)
        .json(new ApiResponse(
            201, 
            { 
                accessToken, 
                user: registeredUser 
            }, 
            "User registered successfully"
        ));
});

// exports.loginUser = asyncHandler(async (req, res) => {
//     const { username, password } = req.body;

//     if (!username || !password) {
//         throw new ApiErrors(400, "Please enter both username and password");
//     }

//     const user = await User.findOne({
//         where: { username },
//     });

//     if (!user) {
//         throw new ApiErrors(404, "User does not exist");
//     }

//     if (password !== user.password) {
//         throw new ApiErrors(401, "Incorrect password");
//     }


//     const accessToken = await generateAccessToken(user.id);
//     const refreshToken = await generateRefreshToken(user.id);

//     await User.update({ refreshToken }, { where: { id: user.id } });

//     const loggedInUser = await User.findOne({
//         where: { id: user.id },
//         attributes: { exclude: ["password", "refreshToken"] },
//     });

//     const options = {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//     };

//     return res
//         .status(200)
//         .cookie("accessToken", accessToken, options)
//         .cookie("refreshToken", refreshToken, options)
//         .json(
//             new ApiResponse(
//                 200,
//                 {
//                     user: loggedInUser,
//                     accessToken,
//                     refreshToken,
//                 },
//                 "User logged in successfully"
//             )
//         );
// });


exports.loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new ApiErrors(400, "Please enter both username and password");
    }

    const user = await User.findOne({
        where: { username },
    });

    if (!user) {
        throw new ApiErrors(404, "User does not exist");
    }

    console.log("password",password);
    console.log("this",user.password);
    
    
 
   
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiErrors(401, "Incorrect password");
    }

 
    const accessToken = await generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    await User.update({ refreshToken }, { where: { id: user.id } });

    const loggedInUser = await User.findOne({
        where: { id: user.id },
        attributes: { exclude: ["password", "refreshToken"] },
    });

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        );
});




exports.getCurrentUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id: req.user.id },
            attributes: { exclude: ["password", "refreshToken"] },
        });

        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, "User not found"));
        }

        return res.status(200).json(
            new ApiResponse(200, user, "Current user fetched successfully")
        );
    } catch (error) {
        console.error("Error fetching current user:", error);
        return res.status(500).json(new ApiResponse(500, null, "Server error"));
    }
});