"use client";

import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import { Activity } from 'lucide-react';

export function AppBar() {
    return <div className='flex justify-between items-center'>
        <Activity className="w-8 h-8 text-green-500" />
        <span className="text-2xl font-bold text-white">Better Uptime</span>
        <div>
            <SignedOut>
                <SignInButton />
                <SignUpButton>
                    <button className="text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                        Sign up
                    </button>
                </SignUpButton>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    </div>
}