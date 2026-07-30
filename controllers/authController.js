const User = require('../models/User');
const bcrypt = require('bcrypt');
const showRegister = (req, res) => {
    res.render('user_auth', { error: null });
};

// Handle registration
const register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        
        // Check if passwords match
        if (password !== confirmPassword) {
            return res.render('user_auth', { error: 'Passwords do not match' });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.render('user_auth', { error: 'Username or email already exists' });
        }
        
        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user'
        });
        
        await user.save();
        res.redirect('/auth/login');
        
    } catch (error) {
        console.error(error);
        res.render('user_auth', { error: 'Registration failed. Please try again.' });
    }
};

const showLogin = (req, res) => {
    res.render('user_auth', { error: null });
};

const login = async (req, res) => {
    console.log('LOGIN ROUTE HIT - Request body:', req.body);
    
    try {
        const { email, password } = req.body;
        
        if (!email) {
            return res.render('user_auth', { 
                error: 'Email is required'
            });
        }
        
        // Find user by email
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.render('user_auth', { 
                error: 'User not found. Please register first.'
            });
        }
        
        
        // Create session
        req.session.userId = user._id;
        req.session.userRole = user.role;
        
        console.log('Login successful for user:', user.email, 'Role:', user.role);
        
        // Redirect based on role
        if (String(user.role).toLowerCase() === 'admin') {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/events');
        }
        
    } catch (error) {
        console.error(error);
        res.render('user_auth', { 
            error: 'Login failed. Please try again.'
        });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/auth/login');
    });
};

module.exports = { showRegister, register, showLogin, login, logout };