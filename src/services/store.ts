import { create } from 'zustand';
import type { Investor, Transaction, AssetAllocation, WithdrawalRequest, User, MarketUpdate, TransactionType } from '../types';

interface DatabaseState {
    investors: Investor[];
    transactions: Transaction[];
    allocations: AssetAllocation[];
    withdrawals: WithdrawalRequest[];
    marketUpdates: MarketUpdate[];
    users: User[];
    loadData: () => void;
    addInvestor: (fullName: string, email: string, initialCapital: number) => void;
    addTransaction: (investorId: string, type: TransactionType, amount: number, description: string) => void;
    requestWithdrawal: (investorId: string, amount: number) => void;
    processWithdrawal: (requestId: string, status: 'approved' | 'rejected') => void;
    closeMonth: (returns: Record<string, number>, monthName: string) => void;
    postUpdate: (title: string, content: string) => void;
}

const STORAGE_KEY = 'ic_database_v1';

const getInitialState = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    // Default Seed Data
    const users: User[] = [
        { id: '1', role: 'super_admin', full_name: 'Main Admin', email: 'admin@innercircle.com', phone: '+254 712 345 678', status: 'active', created_at: new Date().toISOString() },
        { id: 'user_razak', role: 'super_admin', full_name: 'Razak', email: 'razakwako45@gmail.com', phone: '+254 700 111 222', status: 'active', created_at: new Date().toISOString() },
        { id: 'user_joseph', role: 'investor', full_name: 'Joseph Gitari', email: 'josephwanjohi@gmail.com', phone: '+254 722 333 444', status: 'active', created_at: new Date().toISOString() },
        { id: '101', role: 'investor', full_name: 'Samuel Mckenzie', email: 'sam@example.com', phone: '+254 722 000 000', status: 'active', created_at: new Date('2025-01-01').toISOString() }
    ];

    const investors: Investor[] = [
        { id: 'inv_101', user_id: '101', join_date: '2025-01-01', user: users[3] },
        { id: 'inv_joseph', user_id: 'user_joseph', join_date: new Date().toISOString(), user: users[2] }
    ];

    const transactions: Transaction[] = [
        { id: 't1', investor_id: 'inv_101', type: 'deposit', amount: 1000000, description: 'Initial Deposit', created_by: '1', created_at: '2025-01-01T10:00:00Z' },
        { id: 't2', investor_id: 'inv_101', type: 'profit', amount: 45000, description: 'January Profit', created_by: '1', created_at: '2025-02-01T10:00:00Z' }
    ];

    const allocations: AssetAllocation[] = [
        { id: 'a1', investor_id: 'inv_101', asset_type: 'forex', percentage: 50 },
        { id: 'a2', investor_id: 'inv_101', asset_type: 'money_market', percentage: 30 },
        { id: 'a3', investor_id: 'inv_101', asset_type: 'crypto', percentage: 20 }
    ];

    return {
        users,
        investors,
        transactions,
        allocations,
        withdrawals: [],
        marketUpdates: [
            {
                id: 'mu_1',
                title: 'Market Outlook March 2026',
                content: 'We are seeing strong interest in bank currencies. Our systems are working well.',
                created_at: new Date().toISOString()
            }
        ]
    };
};

export const useStore = create<DatabaseState>((set, get) => ({
    ...getInitialState(),

    loadData: () => {
        // Data is pre-loaded via getInitialState()
    },

    addInvestor: (fullName: string, email: string, initialCapital: number) => {
        const userId = Math.random().toString(36).substring(7);
        const invId = `inv_${userId}`;

        const newUser: User = {
            id: userId,
            role: 'investor',
            full_name: fullName,
            email: email,
            phone: '',
            status: 'active',
            created_at: new Date().toISOString()
        };

        const newInvestor: Investor = {
            id: invId,
            user_id: userId,
            join_date: new Date().toISOString(),
            user: newUser
        };

        const firstDeposit: Transaction = {
            id: `t_${Math.random()}`,
            investor_id: invId,
            type: 'deposit',
            amount: initialCapital,
            description: 'Starting Deposit',
            created_by: '1',
            created_at: new Date().toISOString()
        };

        const newAllocations: AssetAllocation[] = [
            { id: `al_${Math.random()}`, investor_id: invId, asset_type: 'forex', percentage: 40 },
            { id: `al_${Math.random()}`, investor_id: invId, asset_type: 'money_market', percentage: 40 },
            { id: `al_${Math.random()}`, investor_id: invId, asset_type: 'crypto', percentage: 20 }
        ];

        set((state) => {
            const next = {
                ...state,
                users: [...state.users, newUser],
                investors: [...state.investors, newInvestor],
                transactions: [...state.transactions, firstDeposit],
                allocations: [...state.allocations, ...newAllocations]
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    },

    addTransaction: (investorId: string, type: TransactionType, amount: number, description: string) => {
        const newTx: Transaction = {
            id: `t_${Math.random()}`,
            investor_id: investorId,
            type,
            amount: type === 'withdrawal' || type === 'fee' ? -Math.abs(amount) : Math.abs(amount),
            description,
            created_by: '1',
            created_at: new Date().toISOString()
        };
        set((state) => {
            const next = { ...state, transactions: [...state.transactions, newTx] };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    },

    requestWithdrawal: (investorId: string, amount: number) => {
        const req: WithdrawalRequest = {
            id: `w_${Math.random()}`,
            investor_id: investorId,
            amount,
            status: 'pending',
            requested_at: new Date().toISOString()
        };
        set((state) => {
            const next = { ...state, withdrawals: [...state.withdrawals, req] };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    },

    processWithdrawal: (requestId: string, status: 'approved' | 'rejected') => {
        set((state) => {
            const request = state.withdrawals.find(w => w.id === requestId);
            if (!request) return state;

            const updatedWithdrawals = state.withdrawals.map(w =>
                w.id === requestId ? { ...w, status, processed_by: '1' } : w
            );

            let updatedTransactions = state.transactions;
            if (status === 'approved') {
                const withdrawalTx: Transaction = {
                    id: `t_${Math.random()}`,
                    investor_id: request.investor_id,
                    type: 'withdrawal',
                    amount: -request.amount,
                    description: 'Cash Withdrawal',
                    created_by: '1',
                    created_at: new Date().toISOString()
                };
                updatedTransactions = [...updatedTransactions, withdrawalTx];
            }

            const next = { ...state, withdrawals: updatedWithdrawals, transactions: updatedTransactions };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    },

    closeMonth: (returns: Record<string, number>, monthName: string) => {
        const state = get();
        const newTransactions: Transaction[] = [];

        state.investors.forEach(inv => {
            const balance = state.transactions
                .filter(tx => tx.investor_id === inv.id)
                .reduce((acc, tx) => acc + tx.amount, 0);

            if (balance <= 0) return;

            const invAllocations = state.allocations.filter(a => a.investor_id === inv.id);
            let totalProfit = 0;

            invAllocations.forEach(alloc => {
                const assetReturn = returns[alloc.asset_type] || 0;
                const assetAmount = balance * (alloc.percentage / 100);
                totalProfit += assetAmount * (assetReturn / 100);
            });

            if (totalProfit !== 0) {
                newTransactions.push({
                    id: `t_${Math.random()}`,
                    investor_id: inv.id,
                    type: 'profit',
                    amount: Math.floor(totalProfit),
                    description: `Profit for ${monthName}`,
                    created_by: '1',
                    created_at: new Date().toISOString()
                });

                if (totalProfit > 0) {
                    newTransactions.push({
                        id: `t_${Math.random()}`,
                        investor_id: inv.id,
                        type: 'fee',
                        amount: -Math.floor(totalProfit * 0.20),
                        description: `Management Fee - ${monthName}`,
                        created_by: '1',
                        created_at: new Date().toISOString()
                    });
                }
            }
        });

        set((state) => {
            const next = { ...state, transactions: [...state.transactions, ...newTransactions] };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    },

    postUpdate: (title: string, content: string) => {
        const update: MarketUpdate = {
            id: `mu_${Math.random()}`,
            title,
            content,
            created_at: new Date().toISOString()
        };
        set((state) => {
            const next = { ...state, marketUpdates: [update, ...state.marketUpdates] };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }
}));
