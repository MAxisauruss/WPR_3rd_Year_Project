const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

const {
    isAuthenticated,
    isAdmin
} = require('../middleWare/authMiddleware');


// Admin only routes
router.get('/admin/create', isAuthenticated, isAdmin, eventController.showCreateForm);
router.post('/admin/create', isAuthenticated, isAdmin, eventController.createEvent);
router.get('/admin/edit/:id', isAuthenticated, isAdmin, eventController.showEditForm);
router.post('/admin/edit/:id', isAuthenticated, isAdmin, eventController.updateEvent);
router.post('/admin/delete/:id', isAuthenticated, isAdmin, eventController.deleteEvent);

// Dashboard routes
router.get('/dashboard', eventController.getDashboard);

// Admin create alias route
router.get('/create', isAuthenticated, isAdmin, eventController.showCreateForm);

// Public routes
router.get('/', eventController.getAllEvents);

// Event detail route must come after static routes
router.get('/:id', eventController.getEventById);




module.exports = router;