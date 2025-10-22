// 1. Import Dependencies
const express = require('express');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const cors = require('cors');
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
// Enable CORS for frontend communication
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], // Allow frontend URLs
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
}));
// Serve static files from the 'public' directory (HTML, CSS)
app.use(express.static('public'));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by the React frontend)
app.use(express.json());

// 5. Define Routes
// GET route for the homepage
app.get('/', (req, res) => {
    res.json({ message: 'Backend server is running!' });
});

// POST route to handle form submission
app.post('/subscribe', (req, res) => {
    console.log('Received subscribe request:', req.body);
    const { email } = req.body; // Extract email from the form submission

    // Validate email
    if (!email) {
        console.log('Email validation failed: email is required');
        return res.status(400).json({ error: 'Email is required.' });
    }

    // Mailgun message data
    const messageData = {
        from: 'DEV@Deakin <mailgun@sandboxf85b8e8bde804f439e2fd9cf385064e7.mailgun.org>', 
        to: email, // The email submitted by the user
        subject: 'Welcome to the DEV@Deakin Insider!',
        text: `Hi there,\n\nThank you for subscribing to our daily insider newsletter. We're excited to have you on board!\n\nBest,\nThe DEV@Deakin Team`,
        html: `<h3>Hi there,</h3><p>Thank you for subscribing to our daily insider newsletter. We're excited to have you on board!</p><p>Best,<br>The DEV@Deakin Team</p>`
    };

    // Send the email using Mailgun
    console.log('Sending email to:', email);
    mg.messages.create(process.env.MAILGUN_DOMAIN, messageData)
        .then(msg => {
            console.log('Email sent successfully:', msg); // Log the success message from Mailgun
            res.status(200).json({ message: 'Success! Please check your email for a welcome message.' });
        })
        .catch(err => {
            console.error('Mailgun error:', err); // Log the error
            res.status(500).json({ error: 'Something went wrong. Please try again later.' });
        });
});

// 6. Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});