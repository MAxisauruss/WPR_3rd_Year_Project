//const bcrypt = require('bcrypt');
const User = require('../models/User');


// Authentication middleware - checks if user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }

    // Not logged in: send them to login instead of letting the request through
    req.session.loginRequired = true;
    return res.redirect('/auth/login');
};

// Authorization middleware - checks if user is admin
const isAdmin = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }

        const storedRole = req.session.userRole;
        if (storedRole && String(storedRole).toLowerCase() === 'admin') {
            return next();
        }

        const user = await User.findById(req.session.userId);
        if (user && String(user.role).toLowerCase() === 'admin') {
            req.session.userRole = user.role;
            return next();
        }

        return res.status(403).send('Access denied. Admin only.');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
};

module.exports = { isAuthenticated, isAdmin };