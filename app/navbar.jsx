"use client";

import Link from "next/link";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = [
	"light",
	"dark",
	"cupcake",
	"emerald",
	"corporate",
	"synthwave",
	"retro",
	"lofi",
];

export default function Navbar() {
	const { theme, setTheme } = useTheme();
	const [plan, setPlan] = useState("Free");

	useEffect(() => {
		(async () => {
			const response = fetch("/api/users");

			if (response.ok) {
				data = await response.json();
				setPlan(data.plan);
			}
		})();
	}, []);

	return (
		<div className="navbar bg-base-100 sticky top-0 z-50 transition-all duration-300 ease-in-out">
  <div className="flex-1">
    <Link
      href="/"
      className="btn btn-ghost text-xl font-bold ml-4 text-primary hover:scale-105 transition-transform duration-200"
    >
      FlashCard.ai
    </Link>
  </div>

  <p className="text-sm font-medium mr-4 animate-pulse">
    Current plan: <span className="text-primary">{plan}</span>
  </p>
  
  <SignedIn>
    <Link
      href="/flashcards"
      className="btn btn-primary m-1 border rounded-lg hover:scale-105 transition-all duration-200 ease-in-out hover:shadow-md"
    >
      My Flashcards
    </Link>
  </SignedIn>

  <div className="flex-none gap-2">
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-primary m-1 border rounded-lg hover:scale-105 transition-all duration-200 ease-in-out hover:shadow-md group">
        Theme
        <svg
          width="12px"
          height="12px"
          className="h-2 w-2 fill-current opacity-60 inline-block ml-1 transform transition-transform duration-200 ease-in-out group-hover:rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52 mt-2 animate-fadeIn"
      >
        {themes.map((t) => (
          <li key={t} className="mb-1">
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller btn btn-sm btn-block btn-ghost justify-start border rounded-lg hover:bg-primary hover:text-primary-content transition-colors duration-200"
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
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-10 h-10 rounded-full ring-2 ring-primary hover:ring-4 transition-all duration-200",
          },
        }}
      />
    </SignedIn>

    <SignedOut>
      <SignInButton mode="modal">
        <button className="btn btn-ghost border rounded-lg hidden sm:inline-flex transition-all duration-300 ease-in-out hover:bg-primary hover:text-primary-content hover:scale-105">
          Sign in
        </button>
      </SignInButton>
    </SignedOut>
  </div>
</div>
	);
}
