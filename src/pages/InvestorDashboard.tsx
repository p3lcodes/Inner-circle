import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../services/store';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatPercentage, formatDate } from '../utils';
import { Wallet, TrendingUp, ArrowDownToLine, Download, Info, PieChart, MessageSquare, ExternalLink, History as HistoryIcon, Clock, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Pie, PieChart as RePieChart, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

export const InvestorDashboard = () => {
    const { user } = useAuth();
    const { investors, transactions, marketUpdates, allocations, withdrawals, requestWithdrawal, loadData } = useStore();
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        loadData();
    }, [loadData]);

    const investor = investors.find(i => i.user_id === user?.id);
    const myTx = transactions.filter(t => t.investor_id === investor?.id);
    const myAllocations = allocations.filter(a => a.investor_id === investor?.id);
    const myWithdrawals = withdrawals.filter(w => w.investor_id === investor?.id);

    const totalCapital = myTx.reduce((acc: number, t: any) => acc + t.amount, 0);
    const totalProfit = myTx.filter(t => t.type === 'profit').reduce((acc: number, t: any) => acc + t.amount, 0);
    const principal = myTx.filter(t => t.type === 'deposit').reduce((acc: number, t: any) => acc + t.amount, 0);
    const netReturn = principal > 0 ? (totalProfit / principal) * 100 : 0;

    const isNewUser = myTx.length === 0;

    const sortedTx = [...myTx].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    const growthData = sortedTx.reduce((acc: any[], t: any) => {
        const prevValue = acc.length > 0 ? acc[acc.length - 1].value : 0;
        acc.push({
            name: new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: prevValue + t.amount
        });
        return acc;
    }, []);

    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault();
        if (!investor || !withdrawAmount) return;
        setIsSubmitting(true);
        setTimeout(() => {
            requestWithdrawal(investor.id, Number(withdrawAmount));
            setIsSubmitting(false);
            setIsWithdrawModalOpen(false);
            setWithdrawAmount('');
            setSuccessMessage('Withdrawal request sent. Management will review it shortly.');
            setTimeout(() => setSuccessMessage(''), 5000);
        }, 1000);
    };

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

    const combinedHistory = [...myTx, ...myWithdrawals].sort((a: any, b: any) => {
        const dateA = new Date(a.created_at || a.requested_at).getTime();
        const dateB = new Date(b.created_at || b.requested_at).getTime();
        return dateB - dateA;
    });

    return (
        <div className="space-y-8 pb-12">
            {/* Welcome Overlay for New Users */}
            {isNewUser && (
                <Card className="bg-[var(--color-accent-500)]/5 border-2 border-dashed border-[var(--color-accent-500)]/30 p-8 text-center animate-in fade-in zoom-in duration-500">
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="w-16 h-16 bg-[var(--color-accent-500)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Info className="w-8 h-8 text-[var(--color-accent-500)]" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Welcome</h2>
                        <p className="text-neutral-400">
                            Your account is ready. To start making profit, please add some money to your balance.
                        </p>
                        <Link to="/dashboard/funding">
                            <Button size="lg" className="w-full mt-4 group">
                                <Wallet className="mr-2 h-5 w-5" /> Add Money Now <ExternalLink className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>
                        </Link>
                    </div>
                </Card>
            )}

            {successMessage && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-center gap-3 text-emerald-400 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="text-sm font-medium">{successMessage}</p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">My Dashboard</h1>
                    <p className="text-neutral-500 font-medium">Account: {user?.full_name}</p>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-3">
                    <Button variant="outline" className="border-neutral-800 text-neutral-400 hover:text-white">
                        <Download className="mr-2 h-4 w-4" /> Get Report
                    </Button>
                    {!isNewUser && (
                        <Button onClick={() => setIsWithdrawModalOpen(true)}>
                            <ArrowDownToLine className="mr-2 h-4 w-4" /> Ask for Payout
                        </Button>
                    )}
                </div>
            </div>

            {/* Performance Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                {[
                    { label: 'Total Balance', value: formatCurrency(totalCapital), icon: Wallet, color: 'text-[var(--color-accent-500)]' },
                    { label: 'Profit Made', value: formatCurrency(totalProfit), icon: TrendingUp, color: 'text-emerald-500' },
                    { label: 'Growth %', value: formatPercentage(netReturn), icon: TrendingUp, color: 'text-blue-500' },
                ].map((stat, i) => (
                    <Card key={i} animate className="bg-[var(--color-surface)] shadow-xl border-neutral-800/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 mb-0">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                                {stat.label}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <div className="text-2xl font-bold text-white mt-1">{stat.value}</div>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Growth Chart */}
                <Card className="lg:col-span-2 shadow-2xl overflow-hidden" animate>
                    <CardHeader className="border-b border-neutral-900 bg-neutral-900/20">
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                            My Growth (KSh)
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[320px] p-6">
                        {isNewUser ? (
                            <div className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-2">
                                <TrendingUp className="h-12 w-12 opacity-20" />
                                <p className="text-sm italic">You will see your growth chart after your first deposit.</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={growthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                                    <XAxis dataKey="name" stroke="#4a4a4a" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#4a4a4a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `KSh ${v / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#1f1f1f', borderRadius: '12px' }}
                                        itemStyle={{ color: '#10b981' }}
                                        formatter={(val: any) => [formatCurrency(val), 'Balance']}
                                    />
                                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </Card>

                {/* Allocation Matrix */}
                <Card className="shadow-2xl" animate>
                    <CardHeader className="border-b border-neutral-900 bg-neutral-900/20">
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5 text-blue-500" />
                            Where my money is
                        </CardTitle>
                    </CardHeader>
                    <div className="h-[320px] p-6 flex flex-col items-center justify-center relative">
                        {myAllocations.length === 0 ? (
                            <div className="text-center text-neutral-500 space-y-2">
                                <PieChart className="h-10 w-10 mx-auto opacity-20" />
                                <p className="text-xs italic">Awaiting account setup.</p>
                            </div>
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={myAllocations}
                                            innerRadius={65}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            dataKey="percentage"
                                            stroke="none"
                                        >
                                            {myAllocations.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0a0a0a', border: 'none', borderRadius: '8px' }}
                                            formatter={(v: any, name: any) => [`${v}%`, name]}
                                        />
                                    </RePieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 w-full grid grid-cols-2 gap-2">
                                    {myAllocations.map((a, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-tighter">{a.asset_type} ({a.percentage}%)</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Market Updates Commentary */}
                <Card animate className="shadow-xl">
                    <CardHeader className="border-b border-neutral-900">
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-amber-500" />
                            News & Updates
                        </CardTitle>
                    </CardHeader>
                    <div className="p-6 space-y-6">
                        {marketUpdates.length === 0 ? (
                            <p className="text-neutral-500 italic text-sm">No new updates right now.</p>
                        ) : (
                            marketUpdates.map((update) => (
                                <div key={update.id} className="space-y-3 pb-6 border-b border-neutral-900 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-white font-bold">{update.title}</h3>
                                        <span className="text-[10px] text-neutral-500 font-bold uppercase">{formatDate(update.created_at)}</span>
                                    </div>
                                    <p className="text-sm text-neutral-400 leading-relaxed whitespace-pre-wrap">
                                        {update.content}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Legacy Transactions */}
                <Card animate className="shadow-xl overflow-hidden">
                    <CardHeader className="border-b border-neutral-900">
                        <CardTitle className="flex items-center gap-2">
                            <HistoryIcon className="h-5 w-5 text-neutral-400" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest bg-neutral-900/40">
                                <tr>
                                    <th className="px-6 py-4">Item</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-900">
                                {combinedHistory.slice(0, 8).map((item: any) => {
                                    const isWithdrawal = 'status' in item;
                                    return (
                                        <tr key={item.id} className="hover:bg-neutral-900/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {isWithdrawal ? <Clock className="w-3 h-3 text-orange-500" /> : <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'deposit' ? 'bg-emerald-500' : 'bg-blue-500'}`} />}
                                                    <span className="text-white font-medium capitalize">{isWithdrawal ? 'Payout Request' : item.type}</span>
                                                </div>
                                                {isWithdrawal && <span className="text-[10px] text-orange-500 font-bold uppercase">{item.status}</span>}
                                            </td>
                                            <td className="px-6 py-4 text-neutral-500 tabular-nums text-xs font-medium">{formatDate(item.created_at || item.requested_at)}</td>
                                            <td className={`px-6 py-4 text-right font-bold tabular-nums ${item.amount > 0 && !isWithdrawal ? 'text-emerald-400' : 'text-orange-500'}`}>
                                                {item.amount > 0 && !isWithdrawal ? '+' : ''}{formatCurrency(item.amount)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {combinedHistory.length === 0 && (
                            <div className="p-8 text-center bg-neutral-900/10">
                                <p className="text-xs text-neutral-600 uppercase font-bold tracking-widest">No activity yet</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Withdrawal Modal */}
            <Modal
                isOpen={isWithdrawModalOpen}
                onClose={() => !isSubmitting && setIsWithdrawModalOpen(false)}
                title="Ask for Payout"
            >
                <form onSubmit={handleWithdraw} className="space-y-4">
                    <p className="text-xs text-neutral-400">
                        Enter the amount you wish to withdraw. Our team will review and approve it within 24 hours.
                    </p>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Amount (KSh)</label>
                        <Input
                            required
                            type="number"
                            autoFocus
                            placeholder="0.00"
                            max={totalCapital}
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                        />
                        <p className="text-[10px] text-neutral-500">Available: {formatCurrency(totalCapital)}</p>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsWithdrawModalOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" isLoading={isSubmitting}>
                            Send Request
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

