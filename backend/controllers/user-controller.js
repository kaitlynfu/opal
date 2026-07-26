import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import userModel from "../models/user-model.js"

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const exists = await userModel.findOne({ email })

        if (exists) {
            return res.json({
                success: false,
                message: 'User already exists.'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
        })

        const token = createToken(user._id)

        res.json({
            success: true,
            token
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({
                success: false,
                message: 'User does not exist.'
            })
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            return res.json({
                success: false,
                message: 'Invalid credentials.'
            })
        }

        const token = createToken(user._id)

        res.json({
            success: true,
            token
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

export {
    loginUser,
    registerUser
}