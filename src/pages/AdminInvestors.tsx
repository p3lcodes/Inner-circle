import { useState } from 'react';
import { useStore } from '../services/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatDate } from '../utils';
import { Search, Plus, MoreVertical, Wallet, CheckCircle2 } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

export const AdminInvestors = () => {
    const { investors, transactions, addInvestor, addTransaction } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
    const [formData, setFormData] = useState({ fullName: '', email: '', initialCapital: '' });
    const [depositAmount, setDepositAmount] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const filteredInvestors = investors.filter(i =>
        i.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddInvestor = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            addInvestor(formData.fullName, formData.email, Number(formData.initialCapital));
            setIsSubmitting(false);
            setIsAddModalOpen(false);
            setSuccessMessage(`Account created for ${formData.fullName}. Invite sent!`);
            setFormData({ fullName: '', email: '', initialCapital: '' });
            setTimeout(() => setSuccessMessage(''), 5000);
        }, 1000);
    };

    const handleDeposit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInvestor || !depositAmount) return;
        setIsSubmitting(true);
        setTimeout(() => {
            addTransaction(selectedInvestor.id, 'deposit', Number(depositAmount), 'New Deposit');
            setIsSubmitting(false);
            setIsDepositModalOpen(false);
            setDepositAmount('');
            setSuccessMessage(`KSh ${depositAmount} added to ${selectedInvestor.user.full_name}'s account.`);
            setTimeout(() => setSuccessMessage(''), 5000);
        }, 800);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Our People</h1>
                    <p className="text-neutral-400">List of all investors and their money.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Person
                </Button>
            </div>

            {successMessage && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-center gap-3 text-emerald-400 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="text-sm font-medium">{successMessage}</p>
                </div>
            )}

            <Card animate className="p-0 overflow-hidden">
                <div className="p-4 border-b border-neutral-800 bg-neutral-900/50">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                        <Input
                            placeholder="Search names or emails..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] uppercase font-bold bg-neutral-900 text-neutral-500 tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Name & Email</th>
                                <th className="px-6 py-4">Started On</th>
                                <th className="px-6 py-4 text-right">Total Balance</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-900">
                            {filteredInvestors.map((inv) => {
                                const balance = transactions
                                    .filter(tx => tx.investor_id === inv.id)
                                    .reduce((a, b) => a + b.amount, 0);

                                return (
                                    <tr key={inv.id} className="hover:bg-neutral-900/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{inv.user?.full_name}</div>
                                            <div className="text-xs text-neutral-500">{inv.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-400">{formatDate(inv.join_date)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-bold text-emerald-400">
                                                {formatCurrency(balance)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2.5 py-1 text-[10px] rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 uppercase tracking-tighter">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="h-8 px-3 text-xs"
                                                    onClick={() => {
                                                        setSelectedInvestor(inv);
                                                        setIsDepositModalOpen(true);
                                                    }}
                                                >
                                                    <Wallet className="mr-2 h-3 w-3" /> Add Money
                                                </Button>
                                                <button className="p-2 text-neutral-500 hover:text-white transition-colors">
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredInvestors.length === 0 && (
                        <div className="p-12 text-center text-neutral-500 italic">
                            No one found for "{searchTerm}"
                        </div>
                    )}
                </div>
            </Card>

            {/* Add Investor Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => !isSubmitting && setIsAddModalOpen(false)}
                title="Create New Account"
            >
                <form onSubmit={handleAddInvestor} className="space-y-4">
                    <p className="text-xs text-neutral-400 mb-4">
                        This will create a new account and send an email to the investor to set their password.
                    </p>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Full Name</label>
                        <Input
                            required
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Email Address</label>
                        <Input
                            required
                            type="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Initial Deposit (KSh)</label>
                        <Input
                            required
                            type="number"
                            placeholder="0.00"
                            value={formData.initialCapital}
                            onChange={(e) => setFormData({ ...formData, initialCapital: e.target.value })}
                        />
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsAddModalOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" isLoading={isSubmitting}>
                            Create Account
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Add Deposit Modal */}
            <Modal
                isOpen={isDepositModalOpen}
                onClose={() => !isSubmitting && setIsDepositModalOpen(false)}
                title={`Add Money for ${selectedInvestor?.user?.full_name}`}
            >
                <form onSubmit={handleDeposit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Amount (KSh)</label>
                        <Input
                            required
                            type="number"
                            autoFocus
                            placeholder="0.00"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                        />
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsDepositModalOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" isLoading={isSubmitting}>
                            Add Deposit
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
