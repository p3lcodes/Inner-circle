import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Phone, Mail, Shield, Key, Bell } from 'lucide-react';

export const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-neutral-400">Manage your private details and account security.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <Card className="md:col-span-1" animate>
                    <div className="p-8 text-center space-y-4">
                        <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mx-auto border-2 border-neutral-700">
                            <User className="w-12 h-12 text-neutral-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{user?.full_name}</h2>
                            <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest mt-1">{user?.role === 'super_admin' ? 'Fund Manager' : 'Inner Circle Investor'}</p>
                        </div>
                        <Button variant="outline" className="w-full text-xs">Change Photo</Button>
                    </div>
                </Card>

                <Card className="md:col-span-2" animate>
                    <CardHeader className="border-b border-neutral-900">
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-500" />
                            Account Information
                        </CardTitle>
                    </CardHeader>
                    <div className="p-6 space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest flex items-center gap-2">
                                    <Mail className="w-3 h-3" /> Email
                                </label>
                                <p className="text-white font-medium">{user?.email}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest flex items-center gap-2">
                                    <Phone className="w-3 h-3" /> Phone
                                </label>
                                <p className="text-white font-medium">{user?.phone || 'Not set'}</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-neutral-900 space-y-4">
                            <h3 className="text-sm font-bold text-white">Security & Settings</h3>
                            <div className="grid gap-3">
                                <button className="flex items-center justify-between p-4 bg-neutral-900/50 rounded-lg hover:bg-neutral-900 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Key className="w-4 h-4 text-neutral-500 group-hover:text-blue-500" />
                                        <span className="text-sm text-neutral-300">Update Password</span>
                                    </div>
                                    <span className="text-xs text-neutral-600">Last changed 3 months ago</span>
                                </button>
                                <button className="flex items-center justify-between p-4 bg-neutral-900/50 rounded-lg hover:bg-neutral-900 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Bell className="w-4 h-4 text-neutral-500 group-hover:text-amber-500" />
                                        <span className="text-sm text-neutral-300">Notification Preferences</span>
                                    </div>
                                    <span className="text-xs text-neutral-600">Email Only</span>
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <Button>Save Changes</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
