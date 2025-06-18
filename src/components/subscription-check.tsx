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
    const supabase = createClient();

    useEffect(() => {
        const checkSubscription = async () => {
            try {
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
                router.push(redirectTo);
            } finally {
                setIsLoading(false);
            }
        };

        checkSubscription();
    }, [router, redirectTo, supabase]);

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
