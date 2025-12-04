// backend/src/routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = express.Router();

const createToken = (user) =>
    jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "supersecretkey",
        { expiresIn: "7d" }
    );

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Name, email and password are required" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
        });

        return res.json({
            token: createToken(user),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error("REGISTER ERROR:", err);
        return res.status(500).json({ message: "Registration failed" });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password || "");
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Invalid email or password" });
        }

        return res.json({
            token: createToken(user),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({ message: "Login failed" });
    }
});

export default router;
