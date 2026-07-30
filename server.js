
const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const mongoose = require('mongoose');



dotenv.config();

const app = express();

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const path = require('path');
const stylePath = path.join(__dirname, 'style');
console.log('[boot] stylePath =', stylePath, 'exists=', require('fs').existsSync(stylePath));
console.log('[boot] mounting /Style from', stylePath);
app.use('/Style', express.static(stylePath));

const imagesPath = path.join(__dirname, 'Smart-Event-Platform', 'Images');
console.log('[boot] imagesPath =', imagesPath, 'exists=', require('fs').existsSync(imagesPath));
app.use('/images', express.static(imagesPath));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    proxy: false
}));

app.use((req, res, next) => {
    res.locals.user = req.session.userId || null;
    res.locals.userRole = req.session.userRole || null;
    res.locals.isAuthenticated = !!req.session.userId;
    next();
});


app.set('view engine', 'ejs');
app.set('views', './views');
app.set('views', path.join(__dirname, 'Smart-Event-Platform', 'Views'));
console.log('[boot] viewsDir =', app.get('views'));

 
const authRoutes = require('./routes/authRoutes');
const Event = require('./models/Event');

app.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        const isAdmin = req.session.userRole && String(req.session.userRole).toLowerCase() === 'admin';
        console.log(`[home] loaded ${events.length} event(s)`);
        res.render('home', { events, isAdmin });
    } catch (error) {
        console.error('Error fetching events for home page:', error);
        res.render('home', { events: [] });
    }
});

app.get('/login', (req, res) => {
    return res.redirect('/auth/login');
});

app.get('/__debug/routes', (req, res) => {
    const stack = app._router?.stack || [];
    const routes = [];
    for (const layer of stack) {
        if (layer.route && layer.route.path) {
            routes.push({ method: Object.keys(layer.route.methods).join(','), path: layer.route.path });
        }
    }
    res.json(routes);
});




const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/booking', bookingRoutes);
app.use('/contact', contactRoutes);
app.use('/admin', adminRoutes);


process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

app.on('error', (err) => {
    console.error('Express error:', err);
});


const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL;
if (!MONGODB_URI) {
    console.error('Missing MongoDB connection string. Set MONGODB_URI or MONGO_URL in .env');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        // Start server only after DB is connected
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            // Debug: list registered routes
            const stack = app._router?.stack || [];
            const routes = [];
            for (const layer of stack) {
                if (layer.route && layer.route.path) {
                    routes.push({ method: Object.keys(layer.route.methods).join(','), path: layer.route.path });
                }
            }
            console.log('[routes]', routes);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
