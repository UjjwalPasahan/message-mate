import express from 'express'
import User from '../models/userModel.js'


export const getAllUsers = async (req,res) => {
    try {
        const users = await User.find({},'username')
        if(!users){
            return res.status(409).json({msg:"no user found"})
        }
        return res.status(201).json({msg:users})
    } catch (error) {
        return res.status(501).json({msg:"Something went wrong while fetching all users"})
    }
}