"use client";
import logo from "../public/logo.png"
import Image from "next/image";

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
        <Image src={logo} alt="Logo" width={80} height={100} />
        <span
            className="text-3xl font-bold text-white-200 dark:text-black-400"
            style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
        >
            DEPIN Uptime
        </span>

        <div className="mr-10">
            <SignedOut>
                <SignInButton />
                <SignUpButton>
                    <button className="text-white rounded-md font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
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