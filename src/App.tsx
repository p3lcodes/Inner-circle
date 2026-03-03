import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { InvestorDashboard } from './pages/InvestorDashboard';
import { AdminInvestors } from './pages/AdminInvestors';
import { AdminTransactions } from './pages/AdminTransactions';
import { AdminOperations } from './pages/AdminOperations';
import { AdminManagement } from './pages/AdminManagement';
import { AboutUs } from './pages/AboutUs';
import { FundingHub } from './pages/FundingHub';
import { Profile } from './pages/Profile';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ThemeProvider } from './context/ThemeContext';

const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-background)]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--color-accent-500)]"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'investor' ? '/dashboard' : '/admin'} replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute allowedRoles={['super_admin', 'admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/investors" element={<AdminInvestors />} />
                <Route path="/admin/performance" element={<AdminDashboard />} />
                <Route path="/admin/transactions" element={<AdminTransactions />} />
                <Route path="/admin/operations" element={<AdminOperations />} />
                <Route path="/admin/management" element={<AdminManagement />} />
                <Route path="/admin/about" element={<AboutUs />} />
                <Route path="/admin/profile" element={<Profile />} /> {/* Added admin profile route */}
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['investor']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<InvestorDashboard />} />
                <Route path="/dashboard/funding" element={<FundingHub />} />
                <Route path="/dashboard/about" element={<AboutUs />} />
                <Route path="/dashboard/transactions" element={<InvestorDashboard />} />
                <Route path="/dashboard/profile" element={<Profile />} /> {/* Added investor profile route */}
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
