import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        try {
            await signIn(email, password);
            navigate('/dashboard'); // Navigation will be properly routed by the ProtectedRoute
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to login';
            setErrorMsg(message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-accent-500)]/10 text-[var(--color-accent-500)] mb-4">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Inner Circle</h1>
                    <p className="text-sm text-neutral-400 mt-2">Private Investment Management</p>
                </div>

                <Card>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            {errorMsg && (
                                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    {errorMsg}
                                </div>
                            )}
                            <Input
                                label="Email address"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>



                        <Button type="submit" className="w-full" isLoading={loading}>
                            Secure Login
                        </Button>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
};
