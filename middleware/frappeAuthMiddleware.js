import { NextResponse } from 'next/server';
const axios = require('axios');

// Middleware to check if the user is authenticated with Frappe
export const frappeAuthMiddleware = async (req, res, next) => {
    try {
        // Assuming user has a session cookie or token in headers
        const sessionId = req.cookies.get('sid').value || req.headers.get('x-frappe-session-id');
        if (!sessionId) {
            return NextResponse.json({ message: 'Unauthorized. No session found.' },{status:401});
        }

        // Make an API request to Frappe to validate the session
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/frappe.auth.get_logged_user`, {
            headers: {
                'Cookie': `sid=${sessionId}`, // If using session cookie
                //'Authorization': `token ${process.env.FRAPPE_API_KEY}:${process.env.FRAPPE_API_SECRET}`, // If using token
            },
        });

        // Check if user is authenticated
        if (response.data && response.data.message) {
            req.user = response.data.message; // Store the logged user data in the request
            next();
        } else {
            return NextResponse.json({ message: 'Unauthorized. Invalid session.' }, { status: 401 });
        }

    } catch (error) {
        console.error('Error in frappe authentication:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
