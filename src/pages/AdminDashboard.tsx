import { useEffect } from 'react';
import { useStore } from '../services/store';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { formatCurrency, formatDate } from '../utils';
import { calculateAUMGrowth } from '../utils/performance';
import {
    BarChart3,
    Users,
    TrendingUp,
    ArrowDownToLine,
    Check,
    X,
    Clock
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

export const AdminDashboard = () => {
    const { investors, transactions, withdrawals, processWithdrawal, loadData } = useStore();

    useEffect(() => {
        loadData();
    }, [loadData]);

    const totalAUM = transactions.reduce((acc, tx) => acc + tx.amount, 0);
    const totalProfit = transactions
        .filter(tx => tx.type === 'profit')
        .reduce((acc, tx) => acc + tx.amount, 0);

    const totalInvestors = investors.length;
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');

    const historicalData = calculateAUMGrowth(transactions, 6);

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];
    const allocationData = [
        { name: 'Forex', value: 40 },
        { name: 'Money Market', value: 40 },
        { name: 'Crypto', value: 20 },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Portfolio Overview</h1>
                <p className="text-neutral-400">Real-time status of the Inner Circle fund.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Total AUM', value: formatCurrency(totalAUM), icon: BarChart3, color: 'text-emerald-500' },
                    { label: 'Total Investors', value: totalInvestors.toString(), icon: Users, color: 'text-blue-500' },
                    { label: 'Total Profits', value: formatCurrency(totalProfit), icon: TrendingUp, color: 'text-emerald-500' },
                    { label: 'Requests', value: pendingWithdrawals.length.toString(), icon: Clock, color: 'text-orange-500' },
                ].map((stat, i) => (
                    <Card key={i} animate className="bg-neutral-900 shadow-xl border-neutral-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 mb-0">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                                {stat.label}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <div className="text-2xl font-bold text-white mt-1">{stat.value}</div>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4" animate>
                    <CardHeader className="border-b border-neutral-800/50">
                        <CardTitle>Growth History</CardTitle>
                    </CardHeader>
                    <div className="h-[320px] p-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={historicalData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis
                                    stroke="#525252"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `KSh ${value / 1000}k`}
                                />
                                <CartesianGrid stroke="#1f1f1f" vertical={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#1f1f1f', borderRadius: '12px' }}
                                    itemStyle={{ color: '#10b981' }}
                                    formatter={(value: any) => [formatCurrency(value || 0), 'AUM']}
                                />
                                <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="lg:col-span-3" animate>
                    <CardHeader className="border-b border-neutral-800/50">
                        <CardTitle>Asset Distribution</CardTitle>
                    </CardHeader>
                    <div className="h-[320px] p-6 flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={allocationData}
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {allocationData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a0a0a', border: 'none', borderRadius: '8px' }}
                                    formatter={(value: any) => [`${value || 0}%`, 'Allocation']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-3xl font-bold text-white">Global</span>
                            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest mt-1">Allocation</span>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Pending Payouts */}
                <Card animate className="overflow-hidden border-orange-500/20">
                    <CardHeader className="bg-orange-500/5 border-b border-orange-500/10">
                        <CardTitle className="flex items-center gap-2 text-orange-500">
                            <ArrowDownToLine className="w-5 h-5" />
                            Pending Payout Requests
                        </CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-900/50 text-[10px] uppercase font-bold text-neutral-500 tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Investor</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-900">
                                {pendingWithdrawals.map((req) => {
                                    const investor = investors.find(i => i.id === req.investor_id);
                                    return (
                                        <tr key={req.id} className="hover:bg-neutral-900/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-white">{investor?.user?.full_name}</div>
                                                <div className="text-[10px] text-neutral-500">{formatDate(req.requested_at)}</div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-orange-400">{formatCurrency(req.amount)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => processWithdrawal(req.id, 'rejected')}
                                                        className="p-2 rounded-full border border-neutral-800 hover:bg-neutral-800 text-neutral-500 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => processWithdrawal(req.id, 'approved')}
                                                        className="p-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-500 transition-colors"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {pendingWithdrawals.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-neutral-600 italic text-xs">
                                            Clear! No pending payouts at the moment.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Recent Clients */}
                <Card animate className="overflow-hidden">
                    <CardHeader className="border-b border-neutral-900">
                        <CardTitle>Recent Clients</CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-900/50 text-[10px] uppercase font-bold text-neutral-500 tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4 text-right">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-900">
                                {investors.slice(0, 5).map((inv) => {
                                    const balance = transactions
                                        .filter(tx => tx.investor_id === inv.id)
                                        .reduce((a, b) => a + b.amount, 0);

                                    return (
                                        <tr key={inv.id} className="hover:bg-neutral-900/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-white">{inv.user?.full_name}</div>
                                                <div className="text-[10px] text-neutral-500">Joined {formatDate(inv.join_date)}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-emerald-400">
                                                {formatCurrency(balance)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};
