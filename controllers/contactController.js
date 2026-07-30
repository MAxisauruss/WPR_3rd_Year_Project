const Contact = require('../Smart-Event-Platform/Models/Enquiry');

const showContactForm = (req, res) => {
    res.render('contact', {
        user: req.session ? req.session.userId : null
    });
};

const submitEnquiry = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        const contact = new Contact({
            name,
            email,
            subject,
            message,
            status: 'Unread'
        });

        await contact.save();
        res.status(201).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Enquiry Error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to submit enquiry. Please try again.' });
    }
};

module.exports = {
    showContactForm,
    submitEnquiry
};