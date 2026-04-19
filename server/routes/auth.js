const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { JWT_SECRET, requireAuth } = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

/**
 * POST /api/auth/register — Create new account
 */
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if MongoDB is connected
    if (!mongoose.connection.readyState || mongoose.connection.readyState !== 1) {
        // Mock mode — simple in-memory user store
        global.mockUsers = global.mockUsers || [];
        const exists = global.mockUsers.find(u => u.email === email.toLowerCase());
        if (exists) return res.status(400).json({ error: 'Email already registered' });

        const mockUser = {
            _id: Date.now().toString(16) + Math.random().toString(16).slice(2, 10),
            name,
            email: email.toLowerCase(),
            password, // Not hashed in mock mode
            role: role || 'user',
            createdAt: new Date()
        };
        global.mockUsers.push(mockUser);

        const token = jwt.sign(
            { id: mockUser._id, email: mockUser.email, role: mockUser.role, name: mockUser.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(201).json({
            token,
            user: { _id: mockUser._id, name: mockUser.name, email: mockUser.email, role: mockUser.role }
        });
    }

    try {
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) return res.status(400).json({ error: 'Email already registered' });

        const user = new User({ name, email, password, role: role || 'user' });
        await user.save();

        // Audit log
        await AuditLog.create({
            userId: user._id,
            userName: user.name,
            userRole: user.role,
            action: 'REGISTER',
            details: `New ${user.role} account created: ${user.email}`
        });

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ token, user: user.toJSON() });
    } catch (error) {
        console.error('[AUTH] Register error:', error);
        res.status(500).json({ error: 'Registration failed', detail: error.message });
    }
});

/**
 * POST /api/auth/login — Authenticate and get JWT
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Mock mode
    if (!mongoose.connection.readyState || mongoose.connection.readyState !== 1) {
        global.mockUsers = global.mockUsers || [];
        const user = global.mockUsers.find(u => u.email === email.toLowerCase());
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.json({
            token,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role }
        });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        // Audit log
        await AuditLog.create({
            userId: user._id,
            userName: user.name,
            userRole: user.role,
            action: 'LOGIN',
            details: `User logged in: ${user.email}`
        });

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: user.toJSON() });
    } catch (error) {
        console.error('[AUTH] Login error:', error.message);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * GET /api/auth/me — Get current user from token
 */
router.get('/me', requireAuth, async (req, res) => {
    if (!mongoose.connection.readyState || mongoose.connection.readyState !== 1) {
        return res.json({ user: req.user });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user: user.toJSON() });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

module.exports = router;
