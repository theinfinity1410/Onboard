import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const {
    APP_ID,
    APP_SECRET,
    GRAPH_API_VERSION
} = process.env;

const BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

/**
 * Exchange the code for a business access token
 * @param {string} code - The code returned from the Embedded Signup flow
 * @returns {Promise<string>} - The business access token
 */
export const exchangeCodeForToken = async (code) => {
    try {
        const response = await axios.get(`${BASE_URL}/oauth/access_token`, {
            params: {
                client_id: APP_ID,
                client_secret: APP_SECRET,
                code: code
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error exchanging code for token:', error.response?.data || error.message);
        throw new Error('Failed to exchange code for token');
    }
};

/**
 * Subscribe the app to the WABA's webhooks
 * @param {string} wabaId - The WhatsApp Business Account ID
 * @param {string} accessToken - The business access token
 */
export const subscribeAppToWaba = async (wabaId, accessToken) => {
    try {
        const response = await axios.post(`${BASE_URL}/${wabaId}/subscribed_apps`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error subscribing app to WABA:', error.response?.data || error.message);
        throw new Error('Failed to subscribe app to WABA');
    }
};

/**
 * Register the phone number for WhatsApp Cloud API
 * @param {string} phoneNumberId - The Business Phone Number ID
 * @param {string} accessToken - The business access token
 * @param {string} pin - The 6-digit PIN for 2FA
 */
export const registerPhoneNumber = async (phoneNumberId, accessToken, pin) => {
    try {
        const response = await axios.post(`${BASE_URL}/${phoneNumberId}/register`, {
            messaging_product: 'whatsapp',
            pin: pin
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error registering phone number:', error.response?.data || error.message);
        throw new Error('Failed to register phone number');
    }
};

/**
 * Send a test message
 * @param {string} phoneNumberId - Sending Phone Number ID
 * @param {string} recipientDetail - Recipient Phone Number
 * @param {string} accessToken - Business Access Token
 */
export const sendTestMessage = async (phoneNumberId, recipientDetail, accessToken) => {
    try {
        const response = await axios.post(`${BASE_URL}/${phoneNumberId}/messages`, {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: recipientDetail,
            type: 'text',
            text: {
                body: 'Hello! This is a test message from the Onboarding API.'
            }
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error sending test message:', error.response?.data || error.message);
        throw new Error('Failed to send test message');
    }
};
