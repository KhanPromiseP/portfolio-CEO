// api/send-email/index.js
import {
    Resend
} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }

    const {
        name,
        email,
        message
    } = req.body;

    try {
        // (1) Forward client's message to YOUR email
        await resend.emails.send({
            from: 'contact@portfolio-pro-template.vercel.app', // Sender alias (no domain needed)
            to: 'khanpromise30@gmail.com', // Your inbox
            subject: `New message from ${name}`,
            html: `<p>${message}</p><p><strong>Reply to:</strong> ${email}</p>`,
        });

        // (2) Optional: Auto-confirm to the client
        await resend.emails.send({
            from: 'contact@portfolio-pro-template.vercel.app',
            to: email, // Client's email
            subject: "We got your message!",
            html: `<p>Hi ${name}, we'll reply soon!</p>`,
        });

        res.status(200).json({
            success: true
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}