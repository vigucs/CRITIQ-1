import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User';
import { IUser } from '../models/User';
import { OAuth2Client } from 'google-auth-library';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const register = async (req: Request, res: Response) => {
  try {
    console.log('Registration request received:', { ...req.body, password: '[HIDDEN]' });
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
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(409).json({ message: 'A user with this email already exists' });
    }

    // Create new user
    console.log('Creating new user...');
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    console.log('User created successfully:', { id: user._id, name: user.name, email: user.email });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET as jwt.Secret,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );

    console.log('JWT token generated successfully');

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
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
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    return res.status(500).json({ 
      message: 'An error occurred during registration. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Development mode - allow login with any credentials when MongoDB is not connected
    if (process.env.NODE_ENV === 'development' && req.get('X-Dev-Mode') === 'true') {
      console.log('DEV MODE: Allowing login without database check');
      const mockToken = jwt.sign(
        { id: 'dev-user-id' },
        JWT_SECRET as jwt.Secret,
        { expiresIn: JWT_EXPIRES_IN } as SignOptions
      );
      
      return res.json({
        token: mockToken,
        user: {
          id: 'dev-user-id',
          name: 'Development User',
          email: email || 'dev@example.com',
          role: 'admin'
        },
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET as jwt.Secret,
      { expiresIn: JWT_EXPIRES_IN } as SignOptions
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.body;
    
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }
    
    const { email, name, picture } = payload;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // User exists, log them in
      const token = jwt.sign(
        { id: user._id },
        JWT_SECRET as jwt.Secret,
        { expiresIn: JWT_EXPIRES_IN } as SignOptions
      );
      
      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      // Create a new user with Google data
      // Generate a random password since we won't use it with Google auth
      const password = Math.random().toString(36).slice(-8);
      
      user = await User.create({
        name: name,
        email: email,
        password: password,
        profileImage: picture,
      });
      
      const token = jwt.sign(
        { id: user._id },
        JWT_SECRET as jwt.Secret,
        { expiresIn: JWT_EXPIRES_IN } as SignOptions
      );
      
      return res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    }
  } catch (error: any) {
    console.error('Google login error:', error);
    res.status(500).json({ message: error.message });
  }
}; 