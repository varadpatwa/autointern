"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../supabase/client';

interface SubscriptionCheckProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export function SubscriptionCheck({
    children,
    redirectTo = '/pricing'
}: SubscriptionCheckProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkSubscription = async () => {
            try {
                // Check if environment variables are available
                if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
                    console.warn('Supabase environment variables not set, skipping subscription check');
                    setIsSubscribed(true); // Allow access when env vars are missing
                    setIsLoading(false);
                    return;
                }

                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push('/sign-in');
                    return;
                }

                // Check subscription status
                const { data: subscription } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (!subscription || subscription.status !== 'active') {
                    router.push(redirectTo);
                    return;
                }

                setIsSubscribed(true);
            } catch (error) {
                console.error('Error checking subscription:', error);
                // On error, allow access to prevent blocking the app
                setIsSubscribed(true);
            } finally {
                setIsLoading(false);
            }
        };

        checkSubscription();
    }, [router, redirectTo]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!isSubscribed) {
        return null;
    }

    return <>{children}</>;
}
