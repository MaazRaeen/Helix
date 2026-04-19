const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'helix-governance-secret-2026';

/**
 * Verify JWT token and attach user to request.
 * If no token, request continues as anonymous (for backward compatibility).
 */
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.user = null;
        return next();
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, email, role, name }
        next();
    } catch (error) {
        req.user = null;
        next();
    }
}

/**
 * Require authentication — returns 401 if no valid token.
 */
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

/**
 * Require admin role.
 */
function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

module.exports = { authMiddleware, requireAuth, requireAdmin, JWT_SECRET };
