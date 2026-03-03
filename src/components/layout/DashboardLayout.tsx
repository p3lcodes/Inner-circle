import { useState } from 'react';
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Building2,
    LayoutDashboard,
    Users,
    LogOut,
    Menu,
    X,
    Activity,
    History,
    Sun,
    Moon,
    Calculator,
    Info,
    Wallet,
    Brain,
    UserCircle // Added UserCircle icon
} from 'lucide-react';
import { cn } from '../../utils';
import { useTheme } from '../../context/ThemeContext';

export const DashboardLayout = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();

    const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';

    const menuItems = isAdmin
        ? [
            { name: 'Overview', href: '/admin', icon: LayoutDashboard },
            { name: 'Investors', href: '/admin/investors', icon: Users },
            { name: 'Performance', href: '/admin/performance', icon: Activity },
            { name: 'Transactions', href: '/admin/transactions', icon: History },
            { name: 'Bulk Distribution', href: '/admin/operations', icon: Calculator },
            { name: 'Intelligence', href: '/admin/management', icon: Brain },
            { name: 'Our Firm', href: '/admin/about', icon: Info },
            { name: 'My Profile', href: '/admin/profile', icon: UserCircle }, // Added for admin
        ]
        : [
            { name: 'My Portfolio', href: '/dashboard', icon: LayoutDashboard },
            { name: 'How to Invest', href: '/dashboard/funding', icon: Wallet },
            { name: 'About Us', href: '/dashboard/about', icon: Info },
            { name: 'Transactions', href: '/dashboard/transactions', icon: History },
            { name: 'My Profile', href: '/dashboard/profile', icon: UserCircle }, // Added for investor
        ];

    const handleSignOut = () => {
        signOut();
        navigate('/login');
    };

    const navClass = ({ isActive }: { isActive: boolean }) =>
        cn(
            'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            isActive
                ? 'bg-[var(--color-surface-hover)] text-[var(--color-accent-500)]'
                : 'text-neutral-400 hover:bg-[var(--color-surface)] hover:text-white'
        );

    return (
        <div className="min-h-screen bg-[var(--color-background)]">
            {/* Mobile header */}
            <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2 text-white font-semibold">
                    <Building2 className="w-6 h-6 text-[var(--color-accent-500)]" />
                    <span>Inner Circle</span>
                </div>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-neutral-400">
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] transform transition-transform duration-300 lg:translate-x-0',
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="h-full flex flex-col">
                    <div className="hidden lg:flex items-center gap-3 px-6 py-8">
                        <div className="p-2 bg-[var(--color-accent-500)]/10 rounded-lg">
                            <Building2 className="w-6 h-6 text-[var(--color-accent-500)]" />
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">Inner Circle</span>
                    </div>

                    <div className="px-6 pb-6">
                        <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                            Menu
                        </div>
                        <nav className="space-y-1">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.href}
                                    to={item.href}
                                    className={navClass}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <item.icon
                                        className={cn(
                                            'mr-3 flex-shrink-0 h-5 w-5',
                                            location.pathname === item.href ? 'text-[var(--color-accent-500)]' : 'text-neutral-500 group-hover:text-white'
                                        )}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-auto p-6 border-t border-[var(--color-border)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center border border-[var(--color-border)]">
                                <span className="text-sm font-medium text-white">
                                    {user?.full_name?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user?.full_name}</p>
                                <p className="text-xs text-neutral-400 capitalize">{user?.role.replace('_', ' ')}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={toggleTheme}
                                className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg text-neutral-400 hover:bg-[var(--color-surface)] hover:text-white transition-colors"
                            >
                                {isDark ? <Sun className="mr-3 h-5 w-5 text-neutral-500" /> : <Moon className="mr-3 h-5 w-5 text-neutral-500" />}
                                {isDark ? 'Light Mode' : 'Dark Mode'}
                            </button>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg text-neutral-400 hover:bg-[var(--color-surface)] hover:text-white transition-colors"
                            >
                                <LogOut className="mr-3 h-5 w-5 text-neutral-500" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:pl-64 flex flex-col h-screen overflow-hidden">
                <main className="flex-1 overflow-y-auto w-full">
                    <div className="p-6 md:p-8 max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
