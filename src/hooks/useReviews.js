import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
export function useReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data, error: fetchError } = await supabase
                    .from('reviews')
                    .select('*');
                if (fetchError)
                    throw fetchError;
                setReviews(data || []);
            }
            catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch reviews';
                setError(message);
                console.error('Fetch reviews error:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchReviews();
        const channel = supabase
            .channel('reviews-changes')
            .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'reviews',
        }, (payload) => {
            if (payload.eventType === 'INSERT') {
                setReviews((prev) => [...prev, payload.new]);
            }
            else if (payload.eventType === 'UPDATE') {
                setReviews((prev) => prev.map((r) => (r.id === payload.new.id ? payload.new : r)));
            }
            else if (payload.eventType === 'DELETE') {
                setReviews((prev) => prev.filter((r) => r.id !== payload.old.id));
            }
        })
            .subscribe();
        return () => {
            channel.unsubscribe();
        };
    }, []);
    const getBarberRating = (barberId) => {
        const barberReviews = reviews.filter((r) => r.barber_id === barberId);
        if (barberReviews.length === 0)
            return 0;
        const total = barberReviews.reduce((sum, r) => sum + r.rating, 0);
        return Math.round((total / barberReviews.length) * 10) / 10;
    };
    return {
        reviews,
        loading,
        error,
        getBarberRating,
    };
}
