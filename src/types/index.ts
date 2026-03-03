export type Role = 'super_admin' | 'admin' | 'investor';
export type Status = 'active' | 'suspended';
export type TransactionType = 'deposit' | 'withdrawal' | 'profit' | 'fee' | 'adjustment';
export type AssetType = 'forex' | 'money_market' | 'crypto' | 'stocks' | 'real_estate' | 'other';
export type WithdrawalStatus = 'pending' | 'approved' | 'rejected';

export interface User {
    id: string;
    role: Role;
    full_name: string;
    email: string;
    phone: string;
    status: Status;
    created_at: string;
}

export interface Investor {
    id: string;
    user_id: string;
    join_date: string;
    user?: User;
}

export interface Transaction {
    id: string;
    investor_id: string;
    type: TransactionType;
    amount: number;
    description: string;
    created_by: string;
    created_at: string;
}

export interface AssetAllocation {
    id: string;
    investor_id: string;
    asset_type: AssetType;
    percentage: number;
}

export interface MonthlyPerformance {
    id: string;
    month: string; // YYYY-MM
    asset_type: AssetType;
    return_percentage: number;
    locked: boolean;
}

export interface WithdrawalRequest {
    id: string;
    investor_id: string;
    amount: number;
    status: WithdrawalStatus;
    requested_at: string;
    processed_by?: string;
}

export interface MarketUpdate {
    id: string;
    title: string;
    content: string;
    created_at: string;
}

export interface DetailedReport {
    id: string;
    asset_type: AssetType;
    period: string; // e.g. "March 2024"
    content: string;
    created_at: string;
}

export interface AuditLog {
    id: string;
    action: string;
    performed_by: string;
    target_id: string;
    timestamp: string;
}
