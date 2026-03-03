import { useState } from 'react';
import { useStore } from '../services/store';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatCurrency } from '../utils';
import { Calendar, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminOperations = () => {
    const { investors, transactions, allocations, closeMonth } = useStore();
    const [returns, setReturns] = useState({
        forex: '',
        money_market: '',
        crypto: ''
    });
    const [monthName, setMonthName] = useState('March 2026');
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState<'input' | 'preview' | 'success'>('input');

    const activeInvestors = investors.filter(i => i.user?.status === 'active');

    // Calculate preview data
    const previewData = activeInvestors.map(inv => {
        const balance = transactions
            .filter(tx => tx.investor_id === inv.id)
            .reduce((acc, tx) => acc + tx.amount, 0);

        const invAllocations = allocations.filter(a => a.investor_id === inv.id);
        let profit = 0;

        invAllocations.forEach(alloc => {
            const assetReturn = Number(returns[alloc.asset_type as keyof typeof returns]) || 0;
            const assetAmount = balance * (alloc.percentage / 100);
            profit += assetAmount * (assetReturn / 100);
        });

        const fee = profit > 0 ? profit * 0.20 : 0;
        const netProfit = profit - fee;

        return {
            name: inv.user?.full_name,
            balance,
            profit: Math.floor(profit),
            fee: Math.floor(fee),
            netProfit: Math.floor(netProfit)
        };
    }).filter(d => d.balance > 0);

    const totalGrossProfit = previewData.reduce((acc, d) => acc + d.profit, 0);

    const handleCloseMonth = () => {
        setIsProcessing(true);
        setTimeout(() => {
            const numericReturns = {
                forex: Number(returns.forex) || 0,
                money_market: Number(returns.money_market) || 0,
                crypto: Number(returns.crypto) || 0
            };
            closeMonth(numericReturns, monthName);
            setIsProcessing(false);
            setStep('success');
        }, 1500);
    };

    if (step === 'success') {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h1 className="text-3xl font-bold text-white">{monthName} Closed Successfully</h1>
                <p className="text-neutral-400">
                    All profits have been added and management fees have been deducted.
                    Investors will see their updated balances instantly.
                </p>
                <Button onClick={() => setStep('input')} variant="outline">
                    Back to Module
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Monthly Close</h1>
                    <p className="text-neutral-400">Calculate and add monthly profits for all investors.</p>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-neutral-500" />
                    <Input
                        value={monthName}
                        onChange={e => setMonthName(e.target.value)}
                        className="bg-transparent border-0 p-0 text-sm font-bold w-32 focus:ring-0"
                    />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-1" animate>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            Input Returns (%)
                        </CardTitle>
                    </CardHeader>
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            {[
                                { id: 'forex', label: 'Forex' },
                                { id: 'money_market', label: 'Money Market' },
                                { id: 'crypto', label: 'Crypto' }
                            ].map(asset => (
                                <div key={asset.id} className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-400">{asset.label}</label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={returns[asset.id as keyof typeof returns]}
                                            onChange={e => setReturns({ ...returns, [asset.id]: e.target.value })}
                                            className="pr-8"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">%</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg flex gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                            <p className="text-xs text-amber-200/70">
                                This will apply to all <strong>{activeInvestors.length}</strong> active investors based on their set accounts.
                            </p>
                        </div>

                        <Button
                            className="w-full"
                            onClick={() => setStep('preview')}
                            disabled={!returns.forex && !returns.money_market && !returns.crypto}
                        >
                            Preview Results
                        </Button>
                    </div>
                </Card>

                <Card className="lg:col-span-2" animate>
                    <CardHeader className="border-b border-neutral-900">
                        <CardTitle>Distribution Preview</CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto max-h-[500px]">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-900/50 text-[10px] uppercase font-bold text-neutral-500 tracking-wider sticky top-0">
                                <tr>
                                    <th className="px-6 py-4">Investor</th>
                                    <th className="px-6 py-4 text-right">Balance</th>
                                    <th className="px-6 py-4 text-right">Profit</th>
                                    <th className="px-6 py-4 text-right">Fees (20%)</th>
                                    <th className="px-6 py-4 text-right">Net</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-900">
                                {previewData.map((data, i) => (
                                    <tr key={i} className="hover:bg-neutral-900/30">
                                        <td className="px-6 py-4 font-medium text-white">{data.name}</td>
                                        <td className="px-6 py-4 text-right text-neutral-500 tabular-nums">{formatCurrency(data.balance)}</td>
                                        <td className="px-6 py-4 text-right text-emerald-500 tabular-nums font-medium">+{formatCurrency(data.profit)}</td>
                                        <td className="px-6 py-4 text-right text-orange-500/70 tabular-nums">-{formatCurrency(data.fee)}</td>
                                        <td className="px-6 py-4 text-right text-emerald-400 tabular-nums font-bold">{formatCurrency(data.netProfit)}</td>
                                    </tr>
                                ))}
                                {previewData.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-neutral-600 italic">
                                            Enter return percentages to see preview.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {previewData.length > 0 && (
                        <div className="p-6 bg-neutral-900/50 border-t border-neutral-900 flex justify-between items-center">
                            <div className="space-y-1">
                                <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Total Payout</p>
                                <p className="text-2xl font-bold text-white">{formatCurrency(totalGrossProfit)}</p>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline" onClick={() => setStep('input')}>Cancel</Button>
                                <Button onClick={handleCloseMonth} isLoading={isProcessing}>Close {monthName}</Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};
