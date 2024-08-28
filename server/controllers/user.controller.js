import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const generateAccessToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();

        return { accessToken };
    } catch (error) {
        throw new ApiError(500, `Something went wrong while generating access token`);
    }
}

const registerUser = asyncHandler(async(req, resp) => {
    // Get data from frontend
    const { username, email, password } = req.body;

    // Validation
    if ([username, email, password].some((fields) => fields.trim() === "")) {
        throw new ApiError(400, `All fields are required`);
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, `User with email or username already exists`);
    }

    // Create user object
    const user = await User.create({
        username,
        email,
        password,
    });

    // Remove password and refresh token from response
    const createdUser = await User.findById(user._id).select("--password");

    // Log success message with database name
    const dbName = mongoose.connection.name;
    console.log(`User registered successfully in database: ${dbName}`);
    console.log(`User details: ${username}, ${email}`);

    // Return response
    return resp.status(201).json(
        new ApiResponse(200, createdUser, `User registered successfully`)
    );
});

const loginUser = asyncHandler(async(req, resp) => {
    // Data from frontend
    const { username, password } = req.body;

    // Validation
    if (!username) {
        throw new ApiError(400, `Username is required`);
    }

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
        throw new ApiError(400, `User does not exist`);
    }

    // Password check
    const isPasswordCheck = await user.isPasswordCorrect(password);

    if (!isPasswordCheck) {
        throw new ApiError(401, `Invalid Password`);
    }

    // Access and refresh token
    const { accessToken } = await generateAccessToken(user._id);

    const loggedInUser = await User.findById(user._id).select("--password");

    return resp
        .status(200)
        .json(
            new ApiResponse(
                200, {
                    user: loggedInUser,
                    access_token: accessToken
                },
                `User logged in successfully`
            )
        );
});

export {
    registerUser,
    loginUser
};
