import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
export function useBarbers() {
    const [barbers, setBarbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchBarbers = async () => {
            try {
                const { data, error: fetchError } = await supabase
                    .from('barbers')
                    .select('*');
                if (fetchError)
                    throw fetchError;
                setBarbers(data || []);
            }
            catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch barbers';
                setError(message);
                console.error('Fetch barbers error:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchBarbers();
        const channel = supabase
            .channel('barbers-changes')
            .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'barbers',
        }, (payload) => {
            if (payload.eventType === 'INSERT') {
                setBarbers((prev) => [...prev, payload.new]);
            }
            else if (payload.eventType === 'UPDATE') {
                setBarbers((prev) => prev.map((b) => (b.id === payload.new.id ? payload.new : b)));
            }
            else if (payload.eventType === 'DELETE') {
                setBarbers((prev) => prev.filter((b) => b.id !== payload.old.id));
            }
        })
            .subscribe();
        return () => {
            channel.unsubscribe();
        };
    }, []);
    const getBarber = (id) => barbers.find((b) => b.id === id);
    return {
        barbers,
        loading,
        error,
        getBarber,
    };
}
