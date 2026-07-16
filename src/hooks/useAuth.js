import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email || '',
                        user_metadata: session.user.user_metadata,
                    });
                }
            }
            catch (err) {
                console.error('Auth check error:', err);
            }
            finally {
                setLoading(false);
            }
        };
        checkAuth();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    user_metadata: session.user.user_metadata,
                });
            }
            else {
                setUser(null);
            }
        });
        return () => {
            subscription?.unsubscribe();
        };
    }, []);
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (signInError)
                throw signInError;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    const signup = async (email, password, fullName) => {
        setLoading(true);
        setError(null);
        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });
            if (signUpError)
                throw signUpError;
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Signup failed';
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    const logout = async () => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            setUser(null);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Logout failed';
            setError(message);
        }
        finally {
            setLoading(false);
        }
    };
    return {
        user,
        loading,
        error,
        login,
        signup,
        logout,
    };
}
