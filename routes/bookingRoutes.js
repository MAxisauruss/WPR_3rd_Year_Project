const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { isAuthenticated } = require('../middleWare/authMiddleware');

// Booking page
router.get('/', async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.session.userId) {
            return res.render('user_auth', { 
                error: 'Please login to view your bookings',
                showLoginPrompt: true 
            });
        }

        const userId = req.session.userId;

        // Total bookings (this user only)
        const totalBookings = await Booking.countDocuments({ user: userId });

        // Upcoming events (global count, not user-specific)
        const upcomingEvents = await Event.countDocuments({
            date: { $gte: new Date() }
        });

        // Total tickets purchased (this user only)
        const ticketsData = await Booking.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalTickets: { $sum: "$numberOfTickets" }
                }
            }
        ]);

        const ticketsPurchased =
            ticketsData.length > 0
                ? ticketsData[0].totalTickets
                : 0;

        // Get this user's booking list with event info
        const bookings = await Booking.find({ user: userId })
            .populate('event');

        // Format booking data for EJS
        const formattedBookings = bookings.map(booking => ({
            eventName: booking.event?.title || 'Unknown Event',
            tickets: booking.numberOfTickets,
            totalPrice: booking.totalPrice,
            status: booking.status
        }));

        res.render('booking', {
            totalBookings,
            upcomingEvents,
            ticketsPurchased,
            bookings: formattedBookings
        });

    } catch (error) {

        console.error(error);
        res.send('Error loading booking page');

    }

});

// Create booking
router.post('/create', isAuthenticated, async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }

        const { eventId, numberOfTickets } = req.body;
        const numTickets = parseInt(numberOfTickets);

        if (isNaN(numTickets) || numTickets < 1) {
            return res.status(400).send('Invalid number of tickets');
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).send('Event not found');
        }

        // Check capacity
        if (event.availableTickets < numTickets) {
            return res.status(400).send('Not enough tickets available');
        }

        console.log('Event price:', event.price, 'type:', typeof event.price);
        console.log('Num tickets:', numTickets, 'type:', typeof numTickets);

        const pricePerTicket = parseFloat(event.price);
        if (isNaN(pricePerTicket) || pricePerTicket < 0) {
            return res.status(400).send('Invalid event price: ' + event.price);
        }

        const totalPrice = pricePerTicket * numTickets;
        console.log('Total price calculated:', totalPrice);

        // Create booking
        const booking = new Booking({
            user: req.session.userId,
            event: eventId,
            numberOfTickets: numTickets,
            totalPrice
        });

        await booking.save();

        // Reduce available tickets
        event.availableTickets -= numTickets;
        await event.save();

        res.redirect('/booking/');

    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).send('Booking failed: ' + (error.message || error));
    }
});

// Book event page
router.get('/event/:eventId/book', isAuthenticated, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);

        if (!event) {
            return res.status(404).send('Event not found');
        }

        res.render('bookEvent', { event });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading booking page');
    }
});

module.exports = router;