'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';
import { 
    User, 
    LogOut, 
    LayoutDashboard, 
    LogIn,
    ChevronDown,
    ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function UserMenu() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLoginSuccess = (u: any) => {
        setIsModalOpen(false);
        if (u.isAdmin) {
            router.push('/admin');
        }
    };

    if (!user) {
        return (
            <>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-semibold"
                >
                    <LogIn size={16} />
                    Login
                </button>
                <AuthModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleLoginSuccess}
                />
            </>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
            >
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-blue-500/20 border border-blue-500/20 flex items-center justify-center">
                    {user.avatarUrl ? (
                        <Image src={user.avatarUrl} alt={user.username} width={32} height={32} />
                    ) : (
                        <User className="text-blue-400" size={18} />
                    )}
                </div>
                <div className="hidden sm:flex flex-col items-start mr-2">
                    <span className="text-xs font-bold leading-none">{user.username}</span>
                    {user.isAdmin && <span className="text-[9px] uppercase font-black text-blue-400 tracking-tighter">Admin</span>}
                </div>
                <ChevronDown size={14} className={cn("text-gray-500 transition-transform", isDropdownOpen && "rotate-180")} />
            </button>

            {isDropdownOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-[#0F0F12] border border-white/10 rounded-2xl shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-4 py-3 bg-white/5 rounded-xl mb-2 flex items-center gap-3">
                             <div className="flex flex-col">
                                <span className="text-sm font-bold truncate">{user.username}</span>
                                <span className="text-[10px] text-gray-500 truncate">{user.email}</span>
                             </div>
                        </div>

                        {user.isAdmin && (
                            <Link
                                href="/admin"
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all"
                            >
                                <LayoutDashboard size={18} />
                                Admin Dashboard
                            </Link>
                        )}
                        
                        <button
                            onClick={() => {
                                logout();
                                setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
