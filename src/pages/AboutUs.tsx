import { Card } from '../components/ui/Card';
import { Globe, ShieldCheck, Users } from 'lucide-react';

export const AboutUs = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-12 py-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-white">The Inner Circle</h1>
                <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                    A small group of experts helping you grow your money using smart, automatic trading.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-8 space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-500)]/10 flex items-center justify-center">
                        <Globe className="text-[var(--color-accent-500)] w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-white">How we work</h2>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                        We trade in different areas like bank currencies, stocks, and crypto. By spreading out where we put money, we aim for steady growth every month while keeping risks low.
                    </p>
                </Card>

                <Card className="p-8 space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <ShieldCheck className="text-emerald-500 w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Safe and Secure</h2>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                        Keeping your money safe is our most important job. We keep your funds in separate accounts and our systems watch every trade 24/7 to make sure everything is safe.
                    </p>
                </Card>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white text-center">Our Team</h2>
                <div className="grid sm:grid-cols-3 gap-6">
                    {[
                        { name: 'Arthur Pendelton', role: 'Investment Manager' },
                        { name: 'Sarah Jenkins', role: 'Head of Operations' },
                        { name: 'David Reynolds', role: 'Lead Trader' }
                    ].map((member, i) => (
                        <div key={i} className="text-center p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                            <div className="w-16 h-16 rounded-full bg-neutral-800 mx-auto mb-4 flex items-center justify-center border border-[var(--color-border)]">
                                <Users className="w-6 h-6 text-neutral-500" />
                            </div>
                            <h3 className="text-white font-semibold">{member.name}</h3>
                            <p className="text-xs text-neutral-500">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl text-center">
                <h2 className="text-xl font-bold text-white mb-2">Need help?</h2>
                <p className="text-sm text-neutral-400 mb-6">Your manager is always here to help you if you have any questions.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <div className="px-6 py-3 bg-[var(--color-surface-hover)] rounded-lg text-sm font-medium text-white border border-[var(--color-border)]">
                        Email: support@innercircle.com
                    </div>
                    <div className="px-6 py-3 bg-[var(--color-surface-hover)] rounded-lg text-sm font-medium text-white border border-[var(--color-border)]">
                        WhatsApp: +254 712 345 678
                    </div>
                </div>
            </div>
        </div>
    );
};
