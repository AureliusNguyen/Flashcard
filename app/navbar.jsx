"use client"
import { useState, useEffect } from 'react';
import { SignInButton, UserButton,SignedIn,SignedOut } from "@clerk/nextjs";
import { useTheme } from "next-themes";

const themes = ["light", "dark", "cupcake",  "emerald", "corporate", "synthwave", "retro","lofi"];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl font-bold ml-4 text-primary">FlashCard </a>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn m-1 border rounded-lg">
            Theme
            <svg width="12px" height="12px" className="h-2 w-2 fill-current opacity-60 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path></svg>
          </label>
          <ul tabIndex={0} className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52">
            {themes.map((t) => (
              <li key={t}>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start border rounded-lg"
                  aria-label={t}
                  value={t}
                  checked={theme === t}
                  onChange={() => setTheme(t)}
                />
              </li>
            ))}
          </ul>
        </div>
        <SignedIn>
        <UserButton afterSignOutUrl="/"/>

        </SignedIn>
        <SignedOut>
              <SignInButton mode="modal">
                <button
                  
                  className="btn btn-ghost border rounded-lg hidden sm:inline-flex transition-colors duration-300 ease-in-out hover:bg-slate-100 hover:text-slate-900"
                >
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>
      </div>
    </div>
  );
}