import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
export const useRole = () => {
    const { user, setRole } = useAuthStore();
    useEffect(() => {
        if (user?.email) {
            fetchUserRole(user.email);
        }
    }, [user?.email]);
    const fetchUserRole = async (email) => {
        try {
            const { data } = await supabase
                .from('users')
                .select('role')
                .eq('email', email)
                .single();
            setRole(data?.role || null);
        }
        catch (err) {
            setRole(null);
        }
    };
    return { role: useAuthStore((state) => state.role) };
};
