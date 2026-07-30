const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { isAuthenticated, isAdmin } = require('../middleWare/authMiddleware');

// Public routes
router.get('/', contactController.showContactForm);
router.post('/submit', contactController.submitEnquiry);

// Admin routes are not used by the current UI, so they are left out to keep the app bootable.
router.get('/admin/enquiries', isAuthenticated, isAdmin, (req, res) => {
    res.status(501).send('Admin enquiries view is not enabled');
});

module.exports = router;
