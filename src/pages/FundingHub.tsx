import React from 'react';
import { Card } from '../components/ui/Card';
import { Landmark, Wallet, ShieldAlert, Copy, CheckCircle2 } from 'lucide-react';

export const FundingHub = () => {
    const [copied, setCopied] = React.useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-10">
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">How to Deposit</h1>
                <p className="text-lg text-neutral-400 max-w-2xl mx-auto font-light">
                    Follow these steps to add money to your account.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Bank Transfer */}
                <Card className="p-8 border-l-4 border-blue-500 bg-[var(--color-surface)] shadow-2xl space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Landmark className="text-blue-500 w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Bank Transfer</h2>
                    </div>

                    <p className="text-sm text-neutral-400 leading-relaxed italic">
                        Best for large amounts and bank accounts.
                    </p>

                    <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
                        {[
                            { label: 'Bank Name', value: 'Stanbic Bank Kenya' },
                            { label: 'Name on Account', value: 'Inner Circle Private Equity' },
                            { label: 'Account number', value: '0100 1234 5678 90' },
                            { label: 'Bank Code', value: 'STANKEKB' },
                            { label: 'Reference Code', value: 'IC-254-VIP' }
                        ].map((field, i) => (
                            <div key={i} className="flex flex-col gap-1 group">
                                <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">{field.label}</span>
                                <div className="flex justify-between items-center group cursor-pointer" onClick={() => handleCopy(field.value, field.label)}>
                                    <span className="text-white text-sm font-medium">{field.value}</span>
                                    {copied === field.label ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-3 w-3 text-neutral-600 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Crypto Options */}
                <Card className="p-8 border-l-4 border-emerald-500 bg-[var(--color-surface)] shadow-2xl space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <Wallet className="text-emerald-500 w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">USDT (Crypto)</h2>
                    </div>

                    <p className="text-sm text-neutral-400 leading-relaxed italic">
                        Best for fast deposits from anywhere.
                    </p>

                    <div className="space-y-6 pt-4 border-t border-[var(--color-border)]">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Network</span>
                                <span className="text-white text-sm font-medium">TRC20 (Tron Network)</span>
                            </div>
                            <div className="p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg break-all space-y-2 relative">
                                <span className="text-[10px] uppercase font-bold text-neutral-600">Wallet Address</span>
                                <p className="text-xs text-white font-mono leading-relaxed">
                                    TPKz9f8X2GjYm4L5N6P7Q8R9S0T1U2V3W4X
                                </p>
                                <button
                                    onClick={() => handleCopy('TPKz9f8X2GjYm4L5N6P7Q8R9S0T1U2V3W4X', 'USDT')}
                                    className="absolute top-2 right-2 p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                                >
                                    {copied === 'USDT' ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-neutral-600" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                            <ShieldAlert className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-orange-200/80 leading-relaxed">
                                Make sure to use **USDT** on the **TRC20** network. If you use the wrong network, your money will be lost.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="bg-neutral-900/40 border border-[var(--color-border)] rounded-2xl p-8 text-center space-y-4">
                <h2 className="text-xl font-bold text-white italic underline">Next Steps</h2>
                <ul className="text-sm text-neutral-400 space-y-3 max-w-lg mx-auto leading-relaxed">
                    <li>1. Send us the proof: After you send the money, send a photo or screenshot to your manager.</li>
                    <li>2. Watch your balance: Your money will show up here within 1 or 2 hours.</li>
                    <li>3. Getting started: New deposits are added to the trading pool automatically.</li>
                </ul>
            </div>
        </div>
    );
};
