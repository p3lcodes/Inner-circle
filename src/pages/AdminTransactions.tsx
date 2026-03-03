import { useState } from 'react';
import { useStore } from '../services/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatDate } from '../utils';
import { ArrowDownRight, ArrowUpRight, TrendingUp, Filter } from 'lucide-react';

export const AdminTransactions = () => {
    const { transactions, investors } = useStore();
    const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'profit'>('all');

    const filteredTx = transactions.filter(t => filter === 'all' || t.type === filter)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-main)] mb-1">Transaction Ledger</h1>
                    <p className="text-[var(--color-text-muted)]">System-wide capital flows and distributions.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                    <Button>Log Transaction</Button>
                </div>
            </div>

            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {(['all', 'deposit', 'withdrawal', 'profit'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === f
                                ? 'bg-[var(--color-accent-600)] dark:bg-[var(--color-accent-500)] text-white shadow-sm'
                                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border)]'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}s
                    </button>
                ))}
            </div>

            <Card animate className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]">
                            <tr>
                                <th className="px-6 py-4">Transaction Details</th>
                                <th className="px-6 py-4">Investor</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {filteredTx.map(tx => {
                                const inv = investors.find(i => i.id === tx.investor_id);
                                const isPositive = tx.amount > 0;
                                const TypeIcon = tx.type === 'deposit' ? ArrowDownRight : tx.type === 'withdrawal' ? ArrowUpRight : TrendingUp;
                                const typeColor = tx.type === 'deposit' ? 'text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 border-emerald-500/20' :
                                    tx.type === 'withdrawal' ? 'text-orange-600 dark:text-orange-500 bg-orange-500/10 border-orange-500/20' :
                                        'text-blue-600 dark:text-blue-500 bg-blue-500/10 border-blue-500/20';

                                return (
                                    <tr key={tx.id} className="hover:bg-[var(--color-surface-hover)]/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg border ${typeColor}`}>
                                                    <TypeIcon className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-[var(--color-text-main)]">{tx.description}</div>
                                                    <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">{tx.type}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[var(--color-text-main)]">{inv?.user?.full_name || 'Unknown'}</div>
                                            <div className="text-xs text-[var(--color-text-muted)]">ID: {tx.investor_id.substring(0, 8)}...</div>
                                        </td>
                                        <td className="px-6 py-4 text-[var(--color-text-muted)] whitespace-nowrap">
                                            {formatDate(tx.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className={`font-semibold ${isPositive ? 'text-[var(--color-accent-600)] dark:text-[var(--color-accent-500)]' : 'text-orange-500'}`}>
                                                {isPositive ? '+' : ''}{formatCurrency(tx.amount)}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
