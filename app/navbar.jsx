"use client";

import Link from "next/link";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = ["light", "dark", "cupcake", "emerald", "corporate", "lofi"];

export default function Navbar() {
	const { theme, setTheme } = useTheme();
	const [plan, setPlan] = useState("Free");

	useEffect(() => {
		(async () => {
			const response = await fetch("/api/users");

			if (response.ok) {
				const data = await response.json();
				setPlan(data[0] ? data[0].plan : "free");
			}
		})();
	}, []);

	return (
		<div className="navbar px-4 bg-base-100 sticky top-0 z-50 transition-all duration-300 ease-in-out max-w-full">
			<div className="flex-1">
				<Link
					href="/"
					className="text-xl font-bold text-primary hover:scale-105 transition-transform duration-200"
				>
					FlashCard.ai
				</Link>
			</div>

			<div className="flex-none gap-3">
				<SignedIn>
					<p className="btn btn-sm btn-ghost h-10 border border-primary text-sm font-medium animate-pulse cursor-default rounded-lg">
						<span className="text-primary capitalize">{plan}</span>
					</p>
				</SignedIn>
				<div className="dropdown dropdown-end">
					<label
						tabIndex={0}
						className="btn btn-primary btn-sm h-10 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out hover:shadow-md group"
					>
						Menu
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
						className="dropdown-content z-[1] py-4 shadow-2xl bg-base-300 rounded-box w-52 mt-2 animate-fadeIn"
					>
						<SignedIn>
							<Link
								href="/flashcards"
								className="px-5 btn btn-block btn-ghost hover:bg-primary hover:text-primary-content justify-start border rounded-lg transition-all duration-200 ease-in-out hover:shadow-md"
							>
								My Flashcards
							</Link>
						</SignedIn>
						<p className="pl-5 py-1 my-2 w-full h-8">Theme</p>
						{themes.map((t) => (
							<li key={t} className="mb-1 mx-2">
								<input
									type="radio"
									name="theme-dropdown"
									className="theme-controller btn btn-sm btn-block btn-ghost justify-start pl-5 border rounded-lg hover:bg-primary hover:text-primary-content transition-colors duration-200"
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
								avatarBox: "size-10 rounded-full hover:ring-4 transition-all duration-200",
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
