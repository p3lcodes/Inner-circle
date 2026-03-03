import type { Transaction } from '../types';

export const calculateAUMGrowth = (transactions: Transaction[], months: number = 6) => {
    const data = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = d.toLocaleString('default', { month: 'short' });
        const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);

        // Sum all transactions up to the end of this month
        const total = transactions
            .filter(tx => new Date(tx.created_at) <= monthEnd)
            .reduce((acc, tx) => acc + tx.amount, 0);

        data.push({ name: monthName, total });
    }

    return data;
};

export const calculateInvestorPerformance = (transactions: Transaction[], investorId: string, months: number = 6) => {
    const data = [];
    const now = new Date();
    const invTransactions = transactions.filter(tx => tx.investor_id === investorId);

    for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = d.toLocaleString('default', { month: 'short' });
        const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);

        const balance = invTransactions
            .filter(tx => new Date(tx.created_at) <= monthEnd)
            .reduce((acc, tx) => acc + tx.amount, 0);

        data.push({ name: monthName, balance });
    }

    return data;
};
