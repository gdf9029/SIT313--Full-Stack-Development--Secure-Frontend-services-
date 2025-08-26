// 1. Import Dependencies
const express = require('express');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
require('dotenv').config(); // Load environment variables from .env file

// 2. Initialize Express App
const app = express();
const port = 3000;

// 3. Configure Mailgun
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
});

// 4. Set up Middleware
// Serve static files from the 'public' directory (HTML, CSS)
app.use(express.static('public'));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// 5. Define Routes
// GET route for the homepage (already handled by express.static)
// POST route to handle form submission
app.post('/subscribe', (req, res) => {
    const { email } = req.body; // Extract email from the form submission

    // Validate email
    if (!email) {
        return res.status(400).send('Email is required.');
    }

    // Mailgun message data
    const messageData = {
        from: 'DEV@Deakin <mailgun@YOUR_MAILGUN_DOMAIN>', // Replace with your domain
        to: email, // The email submitted by the user
        subject: 'Welcome to the DEV@Deakin Insider!',
        text: `Hi there,\n\nThank you for subscribing to our daily insider newsletter. We're excited to have you on board!\n\nBest,\nThe DEV@Deakin Team`,
        html: `<h3>Hi there,</h3><p>Thank you for subscribing to our daily insider newsletter. We're excited to have you on board!</p><p>Best,<br>The DEV@Deakin Team</p>`
    };

    // Send the email using Mailgun
    mg.messages.create(process.env.MAILGUN_DOMAIN, messageData)
        .then(msg => {
            console.log(msg); // Log the success message from Mailgun
            res.send('<h1>Success!</h1><p>Thank you for subscribing. Please check your email for a welcome message.</p>');
        })
        .catch(err => {
            console.error(err); // Log the error
            res.status(500).send('<h1>Error</h1><p>Something went wrong. Please try again later.</p>');
        });
});

// 6. Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});