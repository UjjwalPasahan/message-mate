import express from 'express'
import User from '../models/userModel.js';
import bcrypt from 'bcrypt'
import generateJWTTokensAndSetCookie from '../utils/generateJWTToken.js';

const signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username);

        let user = await User.findOne({ username });
        if (user) {
            return res.status(409).json({ msg: "User already exists" }); // 409 for conflict
        }

        const hashPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            username,
            password: hashPassword,
        });

        generateJWTTokensAndSetCookie(user._id, res);

        return res.status(201).json({ user, msg: "User signed up successfully" }); // 201 for success
    } catch (error) {
        return res.status(500).json({ msg: error.message }); // 500 for server errors
    }
};


const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ msg: "User does not exist" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        generateJWTTokensAndSetCookie(user._id, res);

        return res.status(200).json({user, msg: "User logged in successfully" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};



export { signup,login }