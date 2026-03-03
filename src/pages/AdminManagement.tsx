import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useStore } from '../services/store';
import { MessageSquare, PieChart, FileText, Send, Upload, CheckCircle2 } from 'lucide-react';

export const AdminManagement = () => {
    const { postUpdate } = useStore();
    const [updateTitle, setUpdateTitle] = useState('');
    const [updateContent, setUpdateContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePostUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPosting(true);
        await postUpdate(updateTitle, updateContent);
        setIsPosting(false);
        setUpdateTitle('');
        setUpdateContent('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 py-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Fund Intelligence</h1>
                <p className="text-neutral-500">Manage market commentary and operational reports.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Market Commentary */}
                <Card className="p-8 space-y-6 flex flex-col h-full">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <MessageSquare className="text-amber-500 w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Market Update</h2>
                    </div>

                    <form onSubmit={handlePostUpdate} className="space-y-4 flex-grow flex flex-col">
                        <Input
                            label="Title"
                            placeholder="e.g. Q1 Performance Summary"
                            value={updateTitle}
                            onChange={(e) => setUpdateTitle(e.target.value)}
                            required
                        />
                        <div className="space-y-2 flex-grow flex flex-col">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Commentary Content</label>
                            <textarea
                                className="w-full flex-grow p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-sm text-white focus:ring-2 focus:ring-[var(--color-accent-500)] outline-none min-h-[200px]"
                                placeholder="Describe market movements, strategy shifts, or fund performance..."
                                value={updateContent}
                                onChange={(e) => setUpdateContent(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" isLoading={isPosting}>
                            {success ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Posted</> : <><Send className="mr-2 h-4 w-4" /> Publish to Dashboards</>}
                        </Button>
                    </form>
                </Card>

                {/* Operations & Reports */}
                <div className="space-y-6">
                    <Card className="p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <PieChart className="text-blue-500 w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Target Allocations</h2>
                        </div>
                        <p className="text-sm text-neutral-400">Set the default asset mix displayed to new investors.</p>
                        <div className="grid grid-cols-2 gap-4">
                            {['Forex', 'Stocks', 'Crypto', 'Money Market'].map((asset) => (
                                <Input key={asset} label={asset} placeholder="%" type="number" />
                            ))}
                        </div>
                        <Button variant="outline" className="w-full border-neutral-800">Update Allocations</Button>
                    </Card>

                    <Card className="p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <FileText className="text-emerald-500 w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Import Reports</h2>
                        </div>
                        <p className="text-sm text-neutral-400 italic font-medium">Support for Excel, CV, or WhatsApp paste.</p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border-2 border-dashed border-neutral-800 rounded-xl flex flex-col items-center justify-center group cursor-pointer hover:border-emerald-500/50 transition-colors">
                                <Upload className="h-6 w-6 text-neutral-600 group-hover:text-emerald-500 mb-2" />
                                <span className="text-[10px] font-bold text-neutral-500 uppercase">Upload File</span>
                            </div>
                            <div
                                onClick={() => alert('Feature: Paste WhatsApp summary to auto-generate report.')}
                                className="p-4 border-2 border-dashed border-neutral-800 rounded-xl flex flex-col items-center justify-center group cursor-pointer hover:border-emerald-500/50 transition-colors"
                            >
                                <MessageSquare className="h-6 w-6 text-neutral-600 group-hover:text-emerald-500 mb-2" />
                                <span className="text-[10px] font-bold text-neutral-500 uppercase">Paste Text</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
