import { supabase } from './supabase';
// Generate a random, URL-safe token
export const generateToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 24; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
};
// Generate tokens for all guests missing qr_token
export const generateAllRSVPTokens = async () => {
    try {
        // Fetch all guests without qr_token
        const { data: guests, error: fetchError } = await supabase
            .from('guests')
            .select('id')
            .is('qr_token', null);
        if (fetchError)
            throw fetchError;
        if (!guests || guests.length === 0) {
            console.log('✅ All guests already have RSVP tokens');
            return { success: true, count: 0 };
        }
        // Generate and update tokens
        const updates = guests.map((guest) => ({
            id: guest.id,
            qr_token: generateToken()
        }));
        // Batch update (split into chunks of 100 to avoid timeout)
        let updated = 0;
        for (let i = 0; i < updates.length; i += 100) {
            const chunk = updates.slice(i, i + 100);
            for (const update of chunk) {
                const { error } = await supabase
                    .from('guests')
                    .update({ qr_token: update.qr_token })
                    .eq('id', update.id);
                if (error)
                    throw error;
                updated++;
            }
        }
        console.log(`✅ Generated ${updated} RSVP tokens`);
        return { success: true, count: updated };
    }
    catch (error) {
        console.error('❌ Error generating tokens:', error);
        return { success: false, error };
    }
};
// Get RSVP URL for a guest
export const getRSVPUrl = (qr_token) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/rsvp/${qr_token}`;
};
