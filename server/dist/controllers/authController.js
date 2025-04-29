"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const google_auth_library_1 = require("google-auth-library");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID);
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Registration request received:', Object.assign(Object.assign({}, req.body), { password: '[HIDDEN]' }));
        const { name, email, password } = req.body;
        // Validate input
        if (!name || !email || !password) {
            console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Invalid email format:', email);
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }
        // Validate password length
        if (password.length < 6) {
            console.log('Password too short');
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        // Check if user already exists
        console.log('Checking for existing user with email:', email.toLowerCase());
        const existingUser = yield User_1.default.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            console.log('User already exists with email:', email);
            return res.status(409).json({ message: 'A user with this email already exists' });
        }
        // Create new user
        console.log('Creating new user...');
        const user = yield User_1.default.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password
        });
        console.log('User created successfully:', { id: user._id, name: user.name, email: user.email });
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        console.log('JWT token generated successfully');
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error('Registration error details:', {
            error: error.message,
            stack: error.stack,
            code: error.code,
            name: error.name
        });
        if (error.code === 11000) {
            return res.status(409).json({ message: 'A user with this email already exists' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        return res.status(500).json({
            message: 'An error occurred during registration. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if user exists
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.login = login;
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenId } = req.body;
        // Verify the Google token
        const ticket = yield client.verifyIdToken({
            idToken: tokenId,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({ message: 'Invalid Google token' });
        }
        const { email, name, picture } = payload;
        // Check if user exists
        let user = yield User_1.default.findOne({ email });
        if (user) {
            // User exists, log them in
            const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
            return res.json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
        }
        else {
            // Create a new user with Google data
            // Generate a random password since we won't use it with Google auth
            const password = Math.random().toString(36).slice(-8);
            user = yield User_1.default.create({
                name: name,
                email: email,
                password: password,
                profileImage: picture,
            });
            const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
            return res.status(201).json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
        }
    }
    catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ message: error.message });
    }
});
exports.googleLogin = googleLogin;
