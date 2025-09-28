const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Store access requests (in production, use a database)
const accessRequests = new Map();
const approvedUsers = new Map();

// Submit access request
app.post('/api/request-access', async (req, res) => {
    try {
        const { name, email, organization, purpose, message } = req.body;
        const requestId = Date.now().toString();

        // Store request
        accessRequests.set(requestId, {
            name,
            email,
            organization,
            purpose,
            message,
            status: 'pending',
            timestamp: new Date()
        });

        // Send notification email to admin
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Gallery Access Request',
            html: `
                <h2>New Gallery Access Request</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Organization:</strong> ${organization || 'N/A'}</p>
                <p><strong>Purpose:</strong> ${purpose}</p>
                <p><strong>Message:</strong> ${message || 'N/A'}</p>
                <p>Request ID: ${requestId}</p>
            `
        });

        res.json({ success: true, message: 'Request submitted successfully' });
    } catch (error) {
        console.error('Error submitting request:', error);
        res.status(500).json({ success: false, message: 'Error submitting request' });
    }
});

// Approve access request (admin endpoint)
app.post('/api/approve-access', async (req, res) => {
    try {
        const { requestId } = req.body;
        const request = accessRequests.get(requestId);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        // Generate access token
        const token = jwt.sign(
            { email: request.email, requestId },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Store approved user
        approvedUsers.set(request.email, {
            token,
            approvedAt: new Date()
        });

        // Update request status
        request.status = 'approved';
        accessRequests.set(requestId, request);

        // Send approval email to user
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: request.email,
            subject: 'Gallery Access Approved',
            html: `
                <h2>Your Gallery Access Has Been Approved</h2>
                <p>Dear ${request.name},</p>
                <p>Your request to access the gallery has been approved. You can now view the gallery by clicking the link below:</p>
                <p><a href="${process.env.SITE_URL}/gallery.html?token=${token}">Access Gallery</a></p>
                <p>This link will expire in 30 days.</p>
            `
        });

        res.json({ success: true, message: 'Access approved successfully' });
    } catch (error) {
        console.error('Error approving access:', error);
        res.status(500).json({ success: false, message: 'Error approving access' });
    }
});

// Verify access token
app.post('/api/verify-access', (req, res) => {
    try {
        const { token } = req.body;
        const decoded = jwt.verify(token, JWT_SECRET);

        if (approvedUsers.has(decoded.email)) {
            res.json({ success: true, message: 'Access verified' });
        } else {
            res.status(401).json({ success: false, message: 'Access denied' });
        }
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 