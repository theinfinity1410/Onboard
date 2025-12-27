import * as whatsappService from './service.js';

export const completeOnboarding = async (req, res, next) => {
    try {
        const { code, wabaId, phoneNumberId, pin } = req.body;

        if (!code || !wabaId || !phoneNumberId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: code, wabaId, or phoneNumberId'
            });
        }

        // 1. Exchange code for business token
        console.log('Exchanging code for token...');
        const accessToken = await whatsappService.exchangeCodeForToken(code);
        console.log('Token acquired.');

        // 2. Subscribe app to WABA
        if (wabaId) {
            console.log(`Subscribing app to WABA ${wabaId}...`);
            await whatsappService.subscribeAppToWaba(wabaId, accessToken);
            console.log('Subscribed.');
        }

        // 3. Register phone number
        if (pin && phoneNumberId) {
            console.log(`Registering phone number ${phoneNumberId}...`);
            await whatsappService.registerPhoneNumber(phoneNumberId, accessToken, pin);
            console.log('Registered.');
        } else {
            console.log('Skipping phone registration (PIN or Phone ID missing).');
        }

        // --- IN-MEMORY SAVING FOR TESTING ---
        const clientData = {
            id: Date.now(),
            wabaId,
            phoneNumberId,
            accessToken,
            onboardedAt: new Date().toISOString()
        };

        // Save to our "Mock DB"
        global.mockDatabase = global.mockDatabase || [];
        global.mockDatabase.push(clientData);

        console.log('\n=== CLIENT ONBOARDED SUCCESSFULLY ===');
        console.log('Saved to Memory:', clientData);
        console.log('Total Clients in Memory:', global.mockDatabase.length);
        console.log('=====================================\n');
        // ------------------------------------

        res.status(200).json({
            success: true,
            message: 'Onboarding completed successfully',
            data: clientData
        });

    } catch (error) {
        next(error);
    }
};
